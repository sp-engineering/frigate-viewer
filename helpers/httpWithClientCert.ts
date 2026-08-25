import {NativeModules, Platform} from 'react-native';
import {Server} from '../store/settings';
import {clientCertManager} from './clientCertificates';

/**
 * HTTP request options with optional client certificate support.
 */
export interface HttpRequestOptions extends RequestInit {
  clientCertAlias?: string;
}

/**
 * HTTP Response wrapper.
 */
export interface HttpResponse {
  status: number;
  headers: Record<string, string>;
  body: string;
  json: () => Promise<any>;
  text: () => Promise<string>;
}

/**
 * Custom HTTP client that supports client certificates for mTLS authentication.
 * Delegates to native modules when client certificates are configured.
 */
class HttpClientWithClientCert {
  private clientCertModule: any;

  constructor() {
    this.clientCertModule = NativeModules.ClientCertModule;
  }

  /**
   * Perform an HTTP request with optional client certificate support.
   * If a client certificate is specified, the request is delegated to the native HTTP client
   * which can access the device's keystore/keychain.
   *
   * @param url The URL to request
   * @param options Request options
   * @returns Promise resolving to the response
   */
  async request(url: string, options: HttpRequestOptions = {}): Promise<HttpResponse> {
    const {clientCertAlias, ...fetchOptions} = options;

    // If no client certificate is specified, use standard fetch
    if (!clientCertAlias || !this.clientCertModule) {
      return this.performFetch(url, fetchOptions as RequestInit);
    }

    // Verify the certificate exists before attempting the request
    try {
      const availability =
        await clientCertManager.checkCertificateAvailability(clientCertAlias);
      if (!availability.exists) {
        console.warn(
          `Client certificate not found: ${clientCertAlias}. ` +
            'Falling back to standard HTTP request.',
        );
        return this.performFetch(url, fetchOptions as RequestInit);
      }
    } catch (error) {
      console.warn(
        `Error checking certificate availability: ${error}. ` +
          'Falling back to standard HTTP request.',
      );
      return this.performFetch(url, fetchOptions as RequestInit);
    }

    // Use native HTTP client for certificate-based authentication
    try {
      if (Platform.OS === 'android') {
        return await this.requestWithAndroidClientCert(
          url,
          clientCertAlias,
          fetchOptions as RequestInit,
        );
      } else if (Platform.OS === 'ios') {
        return await this.requestWithIOSClientCert(
          url,
          clientCertAlias,
          fetchOptions as RequestInit,
        );
      }
    } catch (error) {
      console.error(
        `Error with native client cert request: ${error}. ` +
          'Falling back to standard HTTP request.',
      );
    }

    // Fallback to standard fetch if native request fails
    return this.performFetch(url, fetchOptions as RequestInit);
  }

  /**
   * Perform a standard fetch request.
   */
  private async performFetch(
    url: string,
    options: RequestInit = {},
  ): Promise<HttpResponse> {
    const response = await fetch(url, options);
    const body = await response.text();

    return {
      status: response.status,
      headers: this.headersToObject(response.headers),
      body,
      json: async () => JSON.parse(body),
      text: async () => body,
    };
  }

  /**
   * Perform an HTTP request on Android using client certificate from Keystore.
   * Requires a native HTTP client that supports client certificates.
   */
  private async requestWithAndroidClientCert(
    url: string,
    certAlias: string,
    options: RequestInit,
  ): Promise<HttpResponse> {
    if (!this.clientCertModule?.performHttpRequestWithClientCert) {
      console.warn(
        'Native HTTP request with client cert not available on Android. ' +
          'Using standard fetch.',
      );
      return this.performFetch(url, options);
    }

    try {
      const result = await this.clientCertModule.performHttpRequestWithClientCert(
        url,
        certAlias,
        options.method || 'GET',
        this.objectToHeaders(options.headers as Record<string, string> || {}),
        options.body as string | undefined,
      );

      return {
        status: result.statusCode,
        headers: result.headers || {},
        body: result.body || '',
        json: async () => JSON.parse(result.body || '{}'),
        text: async () => result.body || '',
      };
    } catch (error) {
      console.error('Android native client cert request failed:', error);
      throw error;
    }
  }

  /**
   * Perform an HTTP request on iOS using client certificate from Keychain.
   * Requires a native HTTP client that supports client certificates.
   */
  private async requestWithIOSClientCert(
    url: string,
    certIdentity: string,
    options: RequestInit,
  ): Promise<HttpResponse> {
    if (!this.clientCertModule?.performHttpRequestWithClientCert) {
      console.warn(
        'Native HTTP request with client cert not available on iOS. ' +
          'Using standard fetch.',
      );
      return this.performFetch(url, options);
    }

    try {
      const result = await this.clientCertModule.performHttpRequestWithClientCert(
        url,
        certIdentity,
        options.method || 'GET',
        this.objectToHeaders(options.headers as Record<string, string> || {}),
        options.body as string | undefined,
      );

      return {
        status: result.statusCode,
        headers: result.headers || {},
        body: result.body || '',
        json: async () => JSON.parse(result.body || '{}'),
        text: async () => result.body || '',
      };
    } catch (error) {
      console.error('iOS native client cert request failed:', error);
      throw error;
    }
  }

  /**
   * Convert headers object to array format for native code.
   */
  private objectToHeaders(
    headers: Record<string, string>,
  ): Array<{key: string; value: string}> {
    return Object.entries(headers).map(([key, value]) => ({
      key,
      value,
    }));
  }

  /**
   * Convert Response headers to object.
   */
  private headersToObject(headers: Headers): Record<string, string> {
    const result: Record<string, string> = {};
    headers.forEach((value, key) => {
      result[key] = value;
    });
    return result;
  }
}

// Export singleton instance
export const httpClientWithCert = new HttpClientWithClientCert();

export default HttpClientWithClientCert;

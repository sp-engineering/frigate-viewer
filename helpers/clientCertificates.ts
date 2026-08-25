import {NativeModules, Platform} from 'react-native';

/**
 * Information about an available client certificate.
 */
export interface CertificateInfo {
  alias?: string;
  identity?: string;
  commonName?: string;
  type?: string;
}

/**
 * Result of checking certificate availability.
 */
export interface CertificateAvailability {
  exists: boolean;
  isPrivateKeyEntry?: boolean;
  identity?: string;
  alias?: string;
}

/**
 * Client certificate utility module.
 * Provides a cross-platform abstraction for accessing device certificates
 * stored in Android Keystore or iOS Keychain.
 */
class ClientCertificateManager {
  private platformModule: any;

  constructor() {
    // Get the platform-specific native module
    const moduleName =
      Platform.OS === 'android' ? 'ClientCertModule' : 'ClientCertModule';
    this.platformModule = NativeModules[moduleName];

    if (!this.platformModule) {
      console.warn(
        `ClientCertModule not available on ${Platform.OS}. ` +
          'Client certificate authentication will not be available.',
      );
    }
  }

  /**
   * List all available client certificates on the device.
   * @returns Promise resolving to an array of available certificates
   */
  async listCertificates(): Promise<CertificateInfo[]> {
    if (!this.platformModule?.listCertificates) {
      return Promise.resolve([]);
    }

    try {
      const result = await this.platformModule.listCertificates();
      return result || [];
    } catch (error) {
      console.error('Error listing certificates:', error);
      return [];
    }
  }

  /**
   * Get information about a specific certificate.
   * @param alias The certificate alias (Android) or identity (iOS)
   * @returns Promise resolving to certificate information
   */
  async getCertificateInfo(
    alias: string,
  ): Promise<CertificateInfo | undefined> {
    if (!this.platformModule) {
      return undefined;
    }

    try {
      if (Platform.OS === 'android') {
        if (this.platformModule.getCertificateChain) {
          const chain = await this.platformModule.getCertificateChain(alias);
          return {
            alias,
            type: Array.isArray(chain) && chain.length > 0 ? chain[0].type : undefined,
          };
        }
      } else {
        // iOS
        if (this.platformModule.getCertificateInfo) {
          return await this.platformModule.getCertificateInfo(alias);
        }
      }
    } catch (error) {
      console.error(`Error getting certificate info for ${alias}:`, error);
    }

    return undefined;
  }

  /**
   * Check if a specific certificate exists and is usable.
   * @param alias The certificate alias (Android) or identity (iOS)
   * @returns Promise resolving to availability information
   */
  async checkCertificateAvailability(
    alias: string,
  ): Promise<CertificateAvailability> {
    if (!this.platformModule) {
      return {exists: false};
    }

    try {
      if (Platform.OS === 'android') {
        if (this.platformModule.checkCertificateAvailability) {
          const result =
            await this.platformModule.checkCertificateAvailability(alias);
          return {
            exists: result.exists,
            isPrivateKeyEntry: result.isPrivateKeyEntry,
            alias,
          };
        }
      } else {
        // iOS
        if (this.platformModule.checkCertificateAvailability) {
          const result =
            await this.platformModule.checkCertificateAvailability(alias);
          return {
            exists: result.exists,
            identity: result.identity,
          };
        }
      }
    } catch (error) {
      console.error(`Error checking certificate availability for ${alias}:`, error);
    }

    return {exists: false};
  }

  /**
   * Get the private key for a specific certificate (Android only).
   * Note: On Android, this returns metadata about the key, not the key itself.
   * @param alias The certificate alias
   * @returns Promise resolving to private key availability
   */
  async getPrivateKeyInfo(
    alias: string,
  ): Promise<{isPrivateKeyAvailable: boolean}> {
    if (Platform.OS !== 'android' || !this.platformModule?.getPrivateKeyInfo) {
      return {isPrivateKeyAvailable: false};
    }

    try {
      return await this.platformModule.getPrivateKeyInfo(alias);
    } catch (error) {
      console.error(`Error getting private key info for ${alias}:`, error);
      return {isPrivateKeyAvailable: false};
    }
  }

  /**
   * Check if client certificate support is available on this platform.
   * @returns true if the native module is available
   */
  isAvailable(): boolean {
    return !!this.platformModule;
  }
}

// Export singleton instance
export const clientCertManager = new ClientCertificateManager();

// Export the class for testing purposes
export default ClientCertificateManager;

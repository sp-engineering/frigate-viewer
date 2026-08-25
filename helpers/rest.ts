import {Buffer} from 'buffer';
import {ToastAndroid} from 'react-native';
import crashlytics from '@react-native-firebase/crashlytics';
import {Server} from '../store/settings';
import {useIntl} from 'react-intl';
import {messages} from './rest.messages';
import {httpClientWithCert} from './httpWithClientCert';

export const buildServerUrl = (server: Server) => {
  const {protocol, host, port, path} = server;
  const pathPart = path
    ? `${path
        .split('/')
        .filter(p => p !== '')
        .join('/')}/`
    : '';
  return protocol && host
    ? `${protocol}://${host}${port ? `:${port}` : ''}/${pathPart}`
    : undefined;
};

export const buildServerApiUrl = (server: Server) => {
  const serverUrl = buildServerUrl(server);
  return serverUrl ? `${serverUrl}api` : undefined;
};

export const authorizationHeader: (server: Server) => {
  Authorization?: string;
} = server =>
  server.auth === 'basic'
    ? {
        Authorization: `Basic ${Buffer.from(
          `${server.credentials.username}:${server.credentials.password}`,
        ).toString('base64')}`,
      }
    : {};

export const useRest = () => {
  const intl = useIntl();

  const login = async (server: Server) => {
    try {
      const url = `${buildServerApiUrl(server)}/login`;
      crashlytics().log(`POST ${url}`);
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user: server.credentials.username,
          password: server.credentials.password,
        }),
      });
      if (response.status === 400) {
        throw new Error(
          intl.formatMessage(messages['frigateAuth.wrongCredentials']),
        );
      }
      return response.json();
    } catch (error) {
      crashlytics().recordError(error as Error);
      const e = error as {message: string};
      ToastAndroid.show(e.message, ToastAndroid.LONG);
      return Promise.reject();
    }
  };

  interface QueryOptions {
    queryParams?: Record<string, string>;
    json?: boolean;
  }

  const query = async <T>(
    server: Server,
    method: 'GET' | 'POST' | 'DELETE',
    endpoint: string,
    options: QueryOptions = {},
  ): Promise<T> => {
    try {
      const {queryParams, json} = options;
      const url = `${buildServerApiUrl(server)}/${endpoint}`;
      const headers = {
        ...authorizationHeader(server),
      };

      const executeFetch = () => {
        // Use client certificate if configured, otherwise use standard fetch
        if (server.clientCertConfig?.alias) {
          return httpClientWithCert.request(
            `${url}${queryParams ? `?${new URLSearchParams(queryParams)}` : ''}`,
            {
              method,
              headers,
              clientCertAlias: server.clientCertConfig.alias,
            },
          );
        } else {
          return fetch(
            `${url}${queryParams ? `?${new URLSearchParams(queryParams)}` : ''}`,
            {
              method,
              headers,
            },
          ).then(response => ({
            status: response.status,
            headers: Object.fromEntries(response.headers.entries()),
            body: null,
            json: async () => response.json(),
            text: async () => response.text(),
          }));
        }
      };

      crashlytics().log(`${method} ${url}`);
      const response = await executeFetch();

      if (!response) {
        crashlytics().log(`HTTP request failed: ${method} ${url}`);
        throw new Error(
          intl.formatMessage(messages['error.unauthorized'], {url}),
        );
      }

      if (response.status === 401) {
        if (server.auth === 'frigate') {
          await login(server);
          const retriedResponse = await executeFetch();
          return retriedResponse
            ? retriedResponse[json === false ? 'text' : 'json']()
            : Promise.reject(
                new Error(
                  intl.formatMessage(messages['error.unauthorized'], {url}),
                ),
              );
        } else {
          crashlytics().log(`Unauthorized`);
          throw new Error(
            intl.formatMessage(messages['error.unauthorized'], {url}),
          );
        }
      }

      const result = await response[json === false ? 'text' : 'json']();
      return result;
    } catch (error) {
      crashlytics().recordError(error as Error);
      const e = error as {message: string};
      ToastAndroid.show(e.message, ToastAndroid.LONG);
      return Promise.reject();
    }
  };

  const get = async <T>(
    server: Server,
    endpoint: string,
    options?: QueryOptions,
  ): Promise<T> => {
    return query(server, 'GET', endpoint, options);
  };

  const post = async <T>(
    server: Server,
    endpoint: string,
    options?: QueryOptions,
  ): Promise<T> => {
    return query(server, 'POST', endpoint, options);
  };

  const del = async <T>(
    server: Server,
    endpoint: string,
    options?: QueryOptions,
  ): Promise<T> => {
    return query(server, 'DELETE', endpoint, options);
  };

  return {
    get,
    post,
    del,
  };
};


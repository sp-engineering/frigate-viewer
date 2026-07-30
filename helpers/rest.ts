import {Buffer} from 'buffer';
import {ToastAndroid} from 'react-native';
import crashlytics from '@react-native-firebase/crashlytics';
import {Server} from '../store/settings';
import {useIntl} from 'react-intl';
import {messages} from './rest.messages';

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

export const buildQueryString = (
  queryParams: Record<string, string | number | boolean>,
) =>
  Object.entries(queryParams)
    .map(([key, value]) => {
      const normalizedValue =
        typeof value === 'boolean' ? Number(value) : value;
      return `${encodeURIComponent(key)}=${encodeURIComponent(
        normalizedValue.toString(),
      )}`;
    })
    .join('&');

export const buildServerApiUrl = (
  server: Server,
  endpoint?: string | string[],
  queryParams?: Record<string, string | number | boolean>,
) => {
  const serverUrl = buildServerUrl(server);
  if (!serverUrl) {
    throw new Error('Cannot build an API URL without a configured server.');
  }

  const endpointSegments =
    typeof endpoint === 'string' ? endpoint.split('/') : endpoint ?? [];
  const endpointPath = endpointSegments.length
    ? `/${endpointSegments
        .filter(segment => segment !== '')
        .map(encodeURIComponent)
        .join('/')}`
    : '';
  const queryString = queryParams ? `?${buildQueryString(queryParams)}` : '';

  return `${serverUrl}api${endpointPath}${queryString}`;
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
      const url = buildServerApiUrl(server, 'login');
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
      const url = buildServerApiUrl(server, endpoint, queryParams);
      const executeFetch = () =>
        fetch(url, {
          method,
          headers: {
            ...authorizationHeader(server),
          },
        });
      crashlytics().log(`${method} ${url}`);
      const response = await executeFetch();
      if (!response.ok) {
        crashlytics().log(`HTTP/${response.status}: ${method} ${url}`);
      }
      if (response.status === 401) {
        if (server.auth === 'frigate') {
          await login(server);
          const retriedResponse = await executeFetch();
          return retriedResponse[json === false ? 'text' : 'json']();
        } else {
          crashlytics().log(`Unauthorized`);
          throw new Error(
            intl.formatMessage(messages['error.unauthorized'], {url}),
          );
        }
      }
      return response[json === false ? 'text' : 'json']();
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

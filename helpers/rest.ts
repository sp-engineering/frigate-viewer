import {Buffer} from 'buffer';
import {ToastAndroid} from 'react-native';
import crashlytics from '@react-native-firebase/crashlytics';
import {Credentials} from '../store/settings';

export const authorizationHeader: (credentials: Credentials | null) => {
  Authorization?: string;
} = credentials =>
  credentials !== null
    ? {
        Authorization: `Basic ${Buffer.from(
          `${credentials.username}:${credentials.password}`,
        ).toString('base64')}`,
      }
    : {};

export const get = async <T>(
  endpoint: string,
  credentials: Credentials | null,
  queryParams?: Record<string, string>,
  json?: boolean,
): Promise<T> => {
  try {
    crashlytics().log(`GET ${endpoint}`);
    const response = await fetch(
      `${endpoint}${queryParams ? `?${new URLSearchParams(queryParams)}` : ''}`,
      {
        headers: {
          ...authorizationHeader(credentials),
        },
      },
    );
    if (response.status === 401) {
      throw new Error(`Wrong credentials when tried to reach ${endpoint}`);
    }
    return response[json === false ? 'text' : 'json']();
  } catch (error) {
    crashlytics().recordError(error as Error);
    const e = error as {message: string};
    ToastAndroid.show(e.message, ToastAndroid.LONG);
    return Promise.reject();
  }
};

export const post = async <T>(
  endpoint: string,
  credentials: Credentials | null,
  queryParams?: Record<string, string>,
  json?: boolean,
): Promise<T> => {
  try {
    crashlytics().log(`POST ${endpoint}`);
    const response = await fetch(
      `${endpoint}${queryParams ? `?${new URLSearchParams(queryParams)}` : ''}`,
      {
        method: 'post',
        headers: {
          ...authorizationHeader(credentials),
        },
      },
    );
    if (response.status === 401) {
      throw new Error(`Wrong credentials when tried to reach ${endpoint}`);
    }
    return response[json === false ? 'text' : 'json']();
  } catch (error) {
    crashlytics().recordError(error as Error);
    const e = error as {message: string};
    ToastAndroid.show(e.message, ToastAndroid.LONG);
    return Promise.reject();
  }
};

export const del = async <T>(
  endpoint: string,
  credentials: Credentials | null,
  queryParams?: Record<string, string>,
  json?: boolean,
): Promise<T> => {
  try {
    crashlytics().log(`DELETE ${endpoint}`);
    const response = await fetch(
      `${endpoint}${queryParams ? `?${new URLSearchParams(queryParams)}` : ''}`,
      {
        method: 'delete',
        headers: {
          ...authorizationHeader(credentials),
        },
      },
    );
    if (response.status === 401) {
      throw new Error(`Wrong credentials when tried to reach ${endpoint}`);
    }
    return response[json === false ? 'text' : 'json']();
  } catch (error) {
    crashlytics().recordError(error as Error);
    const e = error as {message: string};
    ToastAndroid.show(e.message, ToastAndroid.LONG);
    return Promise.reject();
  }
};

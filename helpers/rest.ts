import {Buffer} from 'buffer';
import {ToastAndroid} from 'react-native';
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
    return await fetch(
      `${endpoint}${queryParams ? `?${new URLSearchParams(queryParams)}` : ''}`,
      {
        headers: {
          ...authorizationHeader(credentials),
        },
      },
    ).then(res => (json === false ? res.text() : res.json()));
  } catch (error) {
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
    return await fetch(
      `${endpoint}${queryParams ? `?${new URLSearchParams(queryParams)}` : ''}`,
      {
        method: 'post',
        headers: {
          ...authorizationHeader(credentials),
        },
      },
    ).then(res => (json === false ? res.text() : res.json()));
  } catch (error) {
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
    return await fetch(
      `${endpoint}${queryParams ? `?${new URLSearchParams(queryParams)}` : ''}`,
      {
        method: 'delete',
        headers: {
          ...authorizationHeader(credentials),
        },
      },
    ).then(res => (json === false ? res.text() : res.json()));
  } catch (error) {
    const e = error as {message: string};
    ToastAndroid.show(e.message, ToastAndroid.LONG);
    return Promise.reject();
  }
};

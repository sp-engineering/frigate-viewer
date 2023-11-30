import { ToastAndroid } from 'react-native';
import { Credentials } from '../store/settings';

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
          Authorization: credentials !== null ? `Basic ${Buffer.from(`${credentials.username}:${credentials.password}`).toString('base64')}` : undefined,
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
          Authorization: credentials !== null ? `Basic ${Buffer.from(`${credentials.username}:${credentials.password}`).toString('base64')}` : undefined,
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
          Authorization: credentials !== null ? `Basic ${Buffer.from(`${credentials.username}:${credentials.password}`).toString('base64')}` : undefined,
        },
      },
    ).then(res => (json === false ? res.text() : res.json()));
  } catch (error) {
    const e = error as {message: string};
    ToastAndroid.show(e.message, ToastAndroid.LONG);
    return Promise.reject();
  }
};

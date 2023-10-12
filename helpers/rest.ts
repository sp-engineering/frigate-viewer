import { ToastAndroid } from 'react-native';

export const get = async <T>(
  endpoint: string,
  queryParams?: Record<string, string>,
  json?: boolean,
): Promise<T> => {
  try {
    return await fetch(
      `${endpoint}${queryParams ? `?${new URLSearchParams(queryParams)}` : ''}`,
    ).then(res => (json === false ? res.text() : res.json()));
  } catch (error) {
    const e = error as {message: string};
    ToastAndroid.show(e.message, ToastAndroid.LONG);
    return Promise.reject();
  }
};

export const post = async <T>(
  endpoint: string,
  queryParams?: Record<string, string>,
  json?: boolean,
): Promise<T> => {
  try {
    return await fetch(
      `${endpoint}${queryParams ? `?${new URLSearchParams(queryParams)}` : ''}`,
      {
        method: 'post',
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
  queryParams?: Record<string, string>,
  json?: boolean,
): Promise<T> => {
  try {
    return await fetch(
      `${endpoint}${queryParams ? `?${new URLSearchParams(queryParams)}` : ''}`,
      {
        method: 'delete',
      },
    ).then(res => (json === false ? res.text() : res.json()));
  } catch (error) {
    const e = error as {message: string};
    ToastAndroid.show(e.message, ToastAndroid.LONG);
    return Promise.reject();
  }
};

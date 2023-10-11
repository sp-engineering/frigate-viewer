import { ToastAndroid } from 'react-native';
import {catchError, from, Observable} from 'rxjs';

export const get = <T>(
  endpoint: string,
  queryParams?: Record<string, string>,
  json?: boolean,
): Observable<T> => {
  return from(
    fetch(
      `${endpoint}${queryParams ? `?${new URLSearchParams(queryParams)}` : ''}`,
    ).then(res => (json === false ? res.text() : res.json())),
  ).pipe(catchError((e) => {
    ToastAndroid.show(e.message, ToastAndroid.LONG);
    throw e;
  }));
};

export const post = <T>(
  endpoint: string,
  queryParams?: Record<string, string>,
  json?: boolean,
): Observable<T> => {
  return from(
    fetch(
      `${endpoint}${queryParams ? `?${new URLSearchParams(queryParams)}` : ''}`,
      {
        method: 'post',
      },
    ).then(res => (json === false ? res.text() : res.json())),
  );
};

export const del = <T>(
  endpoint: string,
  queryParams?: Record<string, string>,
  json?: boolean,
): Observable<T> => {
  return from(
    fetch(
      `${endpoint}${queryParams ? `?${new URLSearchParams(queryParams)}` : ''}`,
      {
        method: 'delete',
      },
    ).then(res => (json === false ? res.text() : res.json())),
  );
};

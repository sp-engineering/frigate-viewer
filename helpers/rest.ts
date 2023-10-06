import {from, Observable} from 'rxjs';

export const get = <T>(
  endpoint: string,
  queryParams?: Record<string, string>,
  json?: boolean,
): Observable<T> => {
  return from(
    fetch(
      `${endpoint}${queryParams ? `?${new URLSearchParams(queryParams)}` : ''}`,
    ).then(res => (json === false ? res.text() : res.json())),
  );
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

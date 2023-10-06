import {from, Observable} from 'rxjs';

export const get = <T>(
  endpoint: string,
  queryParams?: Record<string, string>,
): Observable<T> => {
  return from(
    fetch(
      `${endpoint}${queryParams ? `?${new URLSearchParams(queryParams)}` : ''}`,
    ).then(res => res.json()),
  );
};

export const del = <T>(
  endpoint: string,
  queryParams?: Record<string, string>,
): Observable<T> => {
  return from(
    fetch(
      `${endpoint}${queryParams ? `?${new URLSearchParams(queryParams)}` : ''}`,
      {
        method: 'delete',
      },
    ).then(res => res.json()),
  );
};

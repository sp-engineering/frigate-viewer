import {from, Observable} from 'rxjs';
import {apiUrl} from '../config';

export const get = <T>(
  endpoint: string,
  queryParams?: Record<string, string>,
): Observable<T> => {
  return from(
    fetch(
      `${apiUrl}${endpoint}${
        queryParams ? `?${new URLSearchParams(queryParams)}` : ''
      }`,
    ).then(res => res.json()),
  );
};

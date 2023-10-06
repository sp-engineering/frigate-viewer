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

import {from, Observable} from 'rxjs';
import {apiUrl} from '../config';

export const get = <T>(endpoint: string): Observable<T> => {
  return from(fetch(`${apiUrl}${endpoint}`).then(res => res.json()));
};

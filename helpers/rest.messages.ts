import {MessageDescriptor} from 'react-intl';
import {makeMessages} from './locale';

export const messages = makeMessages('api', {
  'frigateAuth.wrongCredentials':
    'Authorization error, check your credentials.',
  'error.unauthorized': 'Wrong credentials when tried to reach {url}',
});

export type MessageKey = typeof messages extends Record<
  infer R,
  MessageDescriptor
>
  ? R
  : never;

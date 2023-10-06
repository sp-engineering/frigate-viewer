import {MessageDescriptor} from 'react-intl';
import {makeMessages} from '../../helpers/locale';

export const messages = makeMessages('menu', {
  'item.camerasList.label': 'List of cameras',
  'item.cameraEvents.label': 'All events',
  'item.settings.label': 'Settings',
  'item.author.label': 'Author',
});

export type MessageKey = typeof messages extends Record<
  infer R,
  MessageDescriptor
>
  ? R
  : never;

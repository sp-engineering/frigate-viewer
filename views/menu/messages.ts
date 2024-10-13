import {MessageDescriptor} from 'react-intl';
import {makeMessages} from '../../helpers/locale';

export const messages = makeMessages('menu', {
  'item.camerasList.label': 'List of cameras',
  'item.cameraEvents.label': 'All events',
  'item.retained.label': 'Retained',
  'item.storage.label': 'Storage',
  'item.system.label': 'System',
  'item.logs.label': 'Logs',
  'item.settings.label': 'Settings',
  'item.author.label': 'Author',
  'item.report.label': 'Report problem',
});

export type MessageKey = typeof messages extends Record<
  infer R,
  MessageDescriptor
>
  ? R
  : never;

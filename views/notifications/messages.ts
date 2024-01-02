import {makeMessages} from '../../helpers/locale';

export const messages = makeMessages('notifications', {
  'topBar.title': 'Notifications',
  'description': 'Your phone will check for new events in background and notify you about them. The checking interval is 15 minutes and can\'t be changed because of technical limitations. Be aware that this feature can drain your battery.',
  'table.cameras.header': 'Cameras',
  'table.labels.header': 'Labels',
  'table.zones.header': 'Zones',
  'table.enabled.header': 'Enabled',
});

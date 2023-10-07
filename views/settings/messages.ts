import {MessageDescriptor} from 'react-intl';
import {makeMessages} from '../../helpers/locale';

export const messages = makeMessages('settings', {
  'topBar.title': 'Settings',
  'error.required': 'This field is required.',
  'error.min': 'Minimum value is {min}.',
  'error.max': 'Maximum value is {max}',
  'action.save': 'Save',
  'action.cancel': 'Cancel',
  'server.header': 'Server',
  'server.protocol.label': 'Protocol',
  'server.host.label': 'Host',
  'server.port.label': 'Port',
  'server.useDemoServerButton': 'Use demo server',
  'locale.header': 'Locale',
  'locale.region.label': 'Region',
  'locale.region.option.en_GB': 'Great Britain',
  'locale.region.option.en_US': 'United States',
  'locale.region.option.pl_PL': 'Poland',
  'locale.datesDisplay.label': 'Dates display',
  'locale.datesDisplay.option.descriptive': 'Descriptive',
  'locale.datesDisplay.option.numeric': 'Numeric',
  'cameras.header': 'Cameras',
  'cameras.imageRefreshFrequency.label': 'Image refresh frequency (seconds)',
  'cameras.numberOfColumns.label': 'Number of columns',
  'events.header': 'Events',
  'events.numberOfColumns.label': 'Number of columns',
  'events.photoPreference.label': 'Photo preference',
  'events.photoPreference.option.snapshot': 'Snapshot',
  'events.photoPreference.option.thumbnail': 'Thumbnail',
});

export type MessageKey = typeof messages extends Record<
  infer R,
  MessageDescriptor
>
  ? R
  : never;

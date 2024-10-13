import {MessageDescriptor} from 'react-intl';
import {makeMessages} from '../../helpers/locale';

export const messages = makeMessages('report', {
  'topBar.title': 'Report problem',
  'introduction.info':
    'The report will contain some logs of how you used the application. It will not contain your authentication info.',
  'issue.header': 'Issue',
  'issue.description.label': 'Describe the problem',
  'action.send': 'Send',
  'toast.success': 'The issue was reported successfully',
  'error.crash-report-disabled':
    'Reporting crashes is disabled. Go to settings and enable it to report an issue. It will help me to better understand the matter of the issue. You can also report it on GitHub.',
});

export type MessageKey = typeof messages extends Record<
  infer R,
  MessageDescriptor
>
  ? R
  : never;

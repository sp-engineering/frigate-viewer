import {makeMessages} from '../../helpers/locale';

export const messages = makeMessages('cameraEvents', {
  'topBar.general.title': 'Events',
  'topBar.retained.title': 'Retained',
  'topBar.specificCamera.title': 'Events of {cameraName}',
  noEvents: 'No events',
  'labels.inProgressLabel': 'In progress',
  'action.delete': 'Delete',
  'action.retain': 'Retain',
  'action.unretain': 'Unretain',
  'action.share': 'Share',
  'share.snapshot.label': 'Snapshot',
  'share.clip.label': 'Clip',
  'toast.noClip': 'This event has no clip.',
});

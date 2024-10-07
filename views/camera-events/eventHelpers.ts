import {ICameraEvent} from './CameraEvent';

const eventDateStr = (event: ICameraEvent) => {
  const date = new Date(event.start_time * 1000);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  return `${year}-${month}-${day}_${hours}-${minutes}-${seconds}`;
};

export const snapshotFilename = (event: ICameraEvent) => {
  return `${event.camera}-${eventDateStr(event)}.jpg`;
};

export const clipFilename = (event: ICameraEvent) => {
  return `${event.camera}-${eventDateStr(event)}.mp4`;
};

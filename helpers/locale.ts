import {enGB, enUS, pl} from 'date-fns/locale';
import {Region, selectLocaleRegion} from '../store/settings';
import {useAppSelector} from '../store/store';

export const useDateLocale = () => {
  const region = useAppSelector(selectLocaleRegion);
  const regionLocaleMap: Record<Region, Locale> = {
    enGB,
    enUS,
    pl,
  };
  const fallbackLocale = enGB;
  return regionLocaleMap[region] || fallbackLocale;
};

export const formatVideoTime = (t: number) => {
  const sign = t < 0 ? '-' : '';
  const time = Math.abs(Math.round(t / 1000));
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;
  return `${sign}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
};

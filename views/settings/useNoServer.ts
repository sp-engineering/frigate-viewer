import { useEffect } from 'react';
import { useIntl } from 'react-intl';
import { ToastAndroid } from 'react-native';
import { useAppSelector } from '../../store/store';
import { selectServerApiUrl } from '../../store/settings';
import { navigateToMenuItem, settingsMenuItem } from '../menu/Menu';
import { messages } from './messages';

export const useNoServer = () => {
  const apiUrl = useAppSelector(selectServerApiUrl);
  const intl = useIntl();

  useEffect(() => {
    if (apiUrl === undefined) {
      navigateToMenuItem(settingsMenuItem)();
      ToastAndroid.showWithGravity(
        intl.formatMessage(messages['toast.noServerData']),
        ToastAndroid.LONG,
        ToastAndroid.TOP,
      );
    }
  }, [apiUrl, intl]);
}

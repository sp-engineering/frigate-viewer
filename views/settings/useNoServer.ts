import {useEffect} from 'react';
import {useIntl} from 'react-intl';
import {ToastAndroid} from 'react-native';
import {useAppSelector} from '../../store/store';
import {navigateToMenuItem, settingsMenuItem} from '../menu/Menu';
import {messages} from './messages';
import {selectServer} from '../../store/settings';

export const useNoServer = () => {
  const server = useAppSelector(selectServer);
  const intl = useIntl();

  useEffect(() => {
    if (!server.host) {
      navigateToMenuItem(settingsMenuItem)();
      ToastAndroid.showWithGravity(
        intl.formatMessage(messages['toast.noServerData']),
        ToastAndroid.LONG,
        ToastAndroid.TOP,
      );
    }
  }, [server, intl]);
};

import { useCallback } from 'react';
import { useIntl } from 'react-intl';
import { Alert, Linking } from 'react-native';
import { messages } from './messages';

export const useOpenLink = () => {
  const intl = useIntl();

  return useCallback(
    (url: string) => async () => {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert(intl.formatMessage(messages['error.cantOpenLink']));
      }
    },
    [],
  );
};

import React, {useCallback, useEffect} from 'react';
import {useIntl} from 'react-intl';
import {
  Alert,
  Image,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {Navigation, NavigationFunctionComponent} from 'react-native-navigation';
import {menuButton, useMenu} from '../menu/menuHelpers';
import {BuyMeACoffee} from './BuyMeACoffee';
import {messages} from './messages';

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    height: '100%',
    backgroundColor: 'white',
  },
  authorInfo: {
    marginTop: 20,
    flexDirection: 'column',
    alignItems: 'center',
  },
  logo: {
    width: 100,
    height: 100,
    marginHorizontal: 12,
    resizeMode: 'contain',
  },
  link: {
    color: 'blue',
  },
  item: {
    marginVertical: 10,
    marginHorizontal: 20,
  },
  itemLabel: {
    fontWeight: '500',
    color: 'black',
  },
  itemValue: {
    color: 'black',
  },
});

export const Author: NavigationFunctionComponent = ({componentId}) => {
  useMenu(componentId, 'author');
  const intl = useIntl();

  const openLink = useCallback(
    (url: string) => async () => {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert("Can't find any app to open this link.");
      }
    },
    [],
  );

  useEffect(() => {
    Navigation.mergeOptions(componentId, {
      topBar: {
        title: {
          text: intl.formatMessage(messages['topBar.title']),
        },
        leftButtons: [menuButton],
      },
    });
  }, [componentId, intl]);

  return (
    <ScrollView style={styles.wrapper}>
      <View style={styles.authorInfo}>
        <Image
          source={require('./sp-engineering-logo.png')}
          style={styles.logo}
        />
        <Text style={styles.item}>
          <Text style={styles.itemLabel}>
            {intl.formatMessage(messages['info.authorLabel'])}:{' '}
          </Text>
          <Text style={styles.itemValue}>SP engineering</Text>
        </Text>
        <Text style={styles.item}>
          <Text style={styles.itemLabel}>
            {intl.formatMessage(messages['info.contactLabel'])}:{' '}
          </Text>
          <Text
            style={[styles.itemValue, styles.link]}
            onPress={openLink('mailto:szymon@piwowarczyk.net')}>
            szymon@piwowarczyk.net
          </Text>
        </Text>
        <Text style={styles.item}>
          <Text
            style={[styles.itemValue, styles.link]}
            onPress={openLink('https://github.com/piwko28')}>
            {intl.formatMessage(messages['info.githubLabel'])}
          </Text>
        </Text>
      </View>
      <BuyMeACoffee
        onPress={openLink('https://www.buymeacoffee.com/sp.engineering')}
      />
    </ScrollView>
  );
};

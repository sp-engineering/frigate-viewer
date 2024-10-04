import React, {useEffect} from 'react';
import {useIntl} from 'react-intl';
import {Image, ImageStyle, Text, View} from 'react-native';
import {Navigation, NavigationFunctionComponent} from 'react-native-navigation';
import {menuButton, useMenu} from '../menu/menuHelpers';
import {BuyMeACoffee} from './BuyMeACoffee';
import {messages} from './messages';
import {UsedLibs} from './UsedLibs';
import {useOpenLink} from './useOpenLink';
import {ScrollView} from 'react-native-gesture-handler';
import {palette, useStyles} from '../../helpers/colors';

export const Author: NavigationFunctionComponent = ({componentId}) => {
  useMenu(componentId, 'author');
  const intl = useIntl();
  const openLink = useOpenLink();

  const styles = useStyles(({theme}) => ({
    wrapper: {
      width: '100%',
      height: '100%',
      backgroundColor: theme.background,
    },
    authorInfo: {
      marginTop: 20,
      flexDirection: 'column',
      alignItems: 'center',
    },
    logoWrapper: {
      backgroundColor: palette.white,
      borderRadius: 10,
    },
    logo: {
      width: 100,
      height: 100,
      marginHorizontal: 12,
      resizeMode: 'contain',
    },
    link: {
      color: theme.link,
    },
    item: {
      marginVertical: 10,
      marginHorizontal: 20,
    },
    itemLabel: {
      fontWeight: '500',
      color: theme.text,
    },
    itemValue: {
      color: theme.text,
      textAlign: 'center',
    },
    repository: {
      flexDirection: 'column',
    },
  }));

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
        <View style={styles.logoWrapper}>
          <Image
            source={require('./sp-engineering-logo.png')}
            style={styles.logo as ImageStyle}
          />
        </View>
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
        <View style={[styles.item, styles.repository]}>
          <Text style={styles.itemValue}>
            {intl.formatMessage(messages['info.opensourceLabel'])}
          </Text>
          <Text
            style={[styles.itemValue, styles.link]}
            onPress={openLink('https://github.com/sp-engineering')}>
            {intl.formatMessage(messages['info.githubLabel'])}
          </Text>
        </View>
      </View>
      <BuyMeACoffee
        onPress={openLink('https://www.buymeacoffee.com/sp.engineering')}
      />
      <UsedLibs />
    </ScrollView>
  );
};

import React, {useCallback} from 'react';
import {
  Alert,
  Image,
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {NavigationFunctionComponent} from 'react-native-navigation';
import {menuButton, useMenu} from '../menu/menuHelpers';

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
  buyMeCoffee: {
    margin: 20,
    paddingTop: 20,
    borderColor: '#00000088',
    borderTopWidth: 1,
    flexDirection: 'column',
    alignItems: 'center',
  },
  buyMeCoffeeText: {
    fontWeight: '500',
    color: 'black',
  },
  buyMeCoffeeButtonInline: {
    marginVertical: 15,
    flexDirection: 'row',
  },
  buyMeCoffeeButton: {
    flexDirection: 'row',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 10,
    backgroundColor: '#fd0',
    borderRadius: 5,
  },
  buyMeCoffeeButtonText: {
    color: 'black',
  },
});

export const Author: NavigationFunctionComponent = ({componentId}) => {
  useMenu(componentId, 'author');

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

  return (
    <ScrollView style={styles.wrapper}>
      <View style={styles.authorInfo}>
        <Image
          source={require('./sp-engineering-logo.png')}
          style={styles.logo}
        />
        <Text style={styles.item}>
          <Text style={styles.itemLabel}>Author: </Text>
          <Text style={styles.itemValue}>SP engineering</Text>
        </Text>
        <Text style={styles.item}>
          <Text style={styles.itemLabel}>Contact: </Text>
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
            See on github
          </Text>
        </Text>
      </View>
      <View style={styles.buyMeCoffee}>
        <Text style={styles.buyMeCoffeeText}>Do you like this application</Text>
        <Text style={styles.buyMeCoffeeText}>and want to say "thank you"?</Text>
        <View style={styles.buyMeCoffeeButtonInline}>
          <Pressable
            style={styles.buyMeCoffeeButton}
            onPress={openLink('https://www.buymeacoffee.com/sp.engineering')}>
            <Text style={styles.buyMeCoffeeButtonText}>☕</Text>
            <Text style={styles.buyMeCoffeeButtonText}>Buy me a coffee</Text>
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
};

Author.options = () => ({
  topBar: {
    title: {
      text: 'Author',
    },
    rightButtons: [menuButton],
  },
});

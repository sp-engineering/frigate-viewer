import React, {FC} from 'react';
import {useIntl} from 'react-intl';
import {Pressable, StyleSheet, Text, View, ViewProps} from 'react-native';
import {messages} from './messages';

const styles = StyleSheet.create({
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

interface IButMeACoffeeProps extends ViewProps {
  onPress: () => void;
}

export const BuyMeACoffee: FC<IButMeACoffeeProps> = ({
  onPress,
  style,
  ...viewProps
}) => {
  const intl = useIntl();

  return (
    <View {...viewProps} style={[style, styles.buyMeCoffee]}>
      <Text style={styles.buyMeCoffeeText}>
        {intl.formatMessage(messages['buyMeCoffee.doYouLikeLabel'])}
      </Text>
      <Text style={styles.buyMeCoffeeText}>
        {intl.formatMessage(messages['buyMeCoffee.sayThankYouLabel'])}
      </Text>
      <View style={styles.buyMeCoffeeButtonInline}>
        <Pressable style={styles.buyMeCoffeeButton} onPress={onPress}>
          <Text style={styles.buyMeCoffeeButtonText}>☕</Text>
          <Text style={styles.buyMeCoffeeButtonText}>
            {intl.formatMessage(messages['buyMeCoffee.buttonText'])}
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

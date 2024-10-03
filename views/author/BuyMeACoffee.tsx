import React, {FC} from 'react';
import {useIntl} from 'react-intl';
import {Pressable, Text, View, ViewProps} from 'react-native';
import {messages} from './messages';
import {useStyles} from '../../helpers/colors';

interface IButMeACoffeeProps extends ViewProps {
  onPress: () => void;
}

export const BuyMeACoffee: FC<IButMeACoffeeProps> = ({
  onPress,
  style,
  ...viewProps
}) => {
  const intl = useIntl();

  const styles = useStyles(({colorScheme}) => ({
    wrapper: {
      margin: 20,
      paddingTop: 20,
      borderColor: colorScheme.border,
      borderTopWidth: 1,
      flexDirection: 'column',
      alignItems: 'center',
    },
    nonProfitText: {
      marginBottom: 10,
      color: colorScheme.text,
      textAlign: 'center',
    },
    text: {
      fontWeight: '500',
      color: colorScheme.text,
      textAlign: 'center',
    },
    buttonInline: {
      marginVertical: 15,
      flexDirection: 'row',
    },
    button: {
      flexDirection: 'row',
      gap: 5,
      paddingHorizontal: 10,
      paddingVertical: 10,
      backgroundColor: '#fd0',
      borderRadius: 5,
    },
    buttonText: {
      color: 'black',
    },
  }));

  return (
    <View {...viewProps} style={[style, styles.wrapper]}>
      <Text style={styles.nonProfitText}>
        {intl.formatMessage(messages['buyMeCoffee.nonProfitLabel'])}
      </Text>
      <Text style={styles.text}>
        {intl.formatMessage(messages['buyMeCoffee.doYouLikeLabel'])}
      </Text>
      <Text style={styles.text}>
        {intl.formatMessage(messages['buyMeCoffee.sayThankYouLabel'])}
      </Text>
      <View style={styles.buttonInline}>
        <Pressable style={styles.button} onPress={onPress}>
          <Text style={styles.buttonText}>☕</Text>
          <Text style={styles.buttonText}>
            {intl.formatMessage(messages['buyMeCoffee.buttonText'])}
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

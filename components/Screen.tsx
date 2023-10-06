import React, {FC, PropsWithChildren} from 'react';
import {SafeAreaView, StatusBar, View} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';

export const Screen: FC<PropsWithChildren> = ({children}) => {
  return (
    <SafeAreaView>
      <StatusBar barStyle="light-content" backgroundColor={Colors.darker} />
      <View>{children}</View>
    </SafeAreaView>
  );
};

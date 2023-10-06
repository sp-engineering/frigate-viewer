import React, {FC} from 'react';
import {StyleSheet, Text, View} from 'react-native';

const styles = StyleSheet.create({
  wrapper: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderColor: 'black',
  },
});

interface IFilterItemProps {
  label: string;
}

export const FilterItem: FC<IFilterItemProps> = ({label}) => {
  return (
    <View style={styles.wrapper}>
      <Text>{label}</Text>
    </View>
  );
};

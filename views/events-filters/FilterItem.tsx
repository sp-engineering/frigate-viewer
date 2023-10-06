import React, {FC, useCallback} from 'react';
import {Pressable, StyleSheet, Text} from 'react-native';

const styles = StyleSheet.create({
  wrapper: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderColor: 'black',
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkmark: {
    width: 18,
    fontSize: 10,
    color: 'green',
  },
  text: {
    color: 'black',
  },
  selectedText: {
    fontWeight: '600',
  },
  disabledText: {
    color: '#888',
  },
});

interface IFilterItemProps {
  label: string;
  selected: boolean;
  disabled?: boolean;
  onPress?: (item: string) => void;
}

export const FilterItem: FC<IFilterItemProps> = ({
  label,
  selected,
  disabled,
  onPress,
}) => {
  const onItemPress = useCallback(() => {
    if (onPress && !disabled) {
      onPress(label);
    }
  }, [onPress, disabled, label]);

  return (
    <Pressable style={styles.wrapper} onPress={onItemPress}>
      <Text style={[styles.checkmark]}>{selected ? '✔️' : ''}</Text>
      <Text
        style={[
          styles.text,
          ...(selected ? [styles.selectedText] : []),
          ...(disabled ? [styles.disabledText] : []),
        ]}>
        {label}
      </Text>
    </Pressable>
  );
};

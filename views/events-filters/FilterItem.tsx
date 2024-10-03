import React, {FC, useCallback} from 'react';
import {Pressable, Text} from 'react-native';
import {useStyles} from '../../helpers/colors';

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
  const styles = useStyles(({colorScheme}) => ({
    wrapper: {
      paddingVertical: 10,
      paddingHorizontal: 10,
      backgroundColor: colorScheme.background,
      borderBottomWidth: 1,
      borderColor: colorScheme.border,
      flexDirection: 'row',
      alignItems: 'center',
    },
    checkmark: {
      width: 18,
      fontSize: 10,
      color: colorScheme.text,
    },
    text: {
      color: colorScheme.text,
    },
    selectedText: {
      fontWeight: '600',
    },
    disabledText: {
      color: colorScheme.disabled,
    },
  }));

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

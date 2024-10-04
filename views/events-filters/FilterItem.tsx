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
  const styles = useStyles(({theme}) => ({
    wrapper: {
      paddingVertical: 10,
      paddingHorizontal: 10,
      backgroundColor: theme.background,
      borderBottomWidth: 1,
      borderColor: theme.border,
      flexDirection: 'row',
      alignItems: 'center',
    },
    checkmark: {
      width: 18,
      fontSize: 10,
      color: theme.text,
    },
    text: {
      color: theme.text,
    },
    selectedText: {
      fontWeight: '600',
    },
    disabledText: {
      color: theme.disabled,
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

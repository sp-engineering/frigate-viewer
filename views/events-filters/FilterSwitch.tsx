import { ActionCreatorWithPayload } from '@reduxjs/toolkit';
import { FC, useCallback } from 'react';
import { StyleSheet } from 'react-native';
import { Switch, SwitchProps, Text, View } from 'react-native-ui-lib';
import { useAppDispatch } from '../../store/store';
import { colors } from '../../store/colors';

const styles = StyleSheet.create({
  wrapper: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 26,
    paddingVertical: 10,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderColor: colors.background,
  },
  label: {
  },
});

interface IFilterSwitchProps extends SwitchProps {
  label?: string | JSX.Element;
  actionOnChange?: ActionCreatorWithPayload<boolean>;
}

export const FilterSwitch: FC<IFilterSwitchProps> = ({label, actionOnChange, ...switchProps}) => {
  const dispatch = useAppDispatch();

  const onValueChange = useCallback(
    (value: boolean) => {
      if (actionOnChange) {
        dispatch(actionOnChange(value));
      }
    },
    [dispatch, actionOnChange],
  );

  return (
    <View style={styles.wrapper}>
      {label && <Text style={styles.label}>{label}</Text>}
      <Switch
        onValueChange={onValueChange}
        {...switchProps}
      />
    </View>
  );
};

import { ActionCreatorWithPayload } from '@reduxjs/toolkit';
import { FC, useCallback } from 'react';
import { StyleSheet } from 'react-native';
import { Switch, SwitchProps, Text, View } from 'react-native-ui-lib';
import { useAppDispatch } from '../../store/store';

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
    borderColor: 'black',
  },
  label: {
  },
});

interface IFilterSwitchProps extends SwitchProps {
  label?: string | JSX.Element;
  onChange?: (value: boolean) => void;
  actionOnChange?: ActionCreatorWithPayload<boolean>;
}

export const FilterSwitch: FC<IFilterSwitchProps> = ({label, onChange, actionOnChange, ...switchProps}) => {
  const dispatch = useAppDispatch();

  const onValueChange = useCallback(
    (value: boolean) => {
      if (actionOnChange) {
        dispatch(actionOnChange(value));
      }
      if (onChange) {
        onChange(value);
      }
    },
    [dispatch, onChange, actionOnChange],
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

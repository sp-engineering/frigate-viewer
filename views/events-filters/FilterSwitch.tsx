import {ActionCreatorWithPayload} from '@reduxjs/toolkit';
import {FC, useCallback} from 'react';
import {Switch, SwitchProps, Text, View} from 'react-native-ui-lib';
import {useAppDispatch} from '../../store/store';
import {useStyles} from '../../helpers/colors';

interface IFilterSwitchProps extends SwitchProps {
  label?: string | JSX.Element;
  actionOnChange?: ActionCreatorWithPayload<boolean>;
}

export const FilterSwitch: FC<IFilterSwitchProps> = ({
  label,
  actionOnChange,
  ...switchProps
}) => {
  const styles = useStyles(({colorScheme}) => ({
    wrapper: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 26,
      paddingVertical: 10,
      backgroundColor: colorScheme.background,
      borderBottomWidth: 1,
      borderColor: colorScheme.border,
    },
    label: {
      color: colorScheme.text,
    },
  }));

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
      <Switch onValueChange={onValueChange} {...switchProps} />
    </View>
  );
};

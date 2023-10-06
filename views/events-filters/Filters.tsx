import {ActionCreatorWithPayload} from '@reduxjs/toolkit';
import React, {FC, useCallback} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Section} from '../../components/forms/Section';
import {useAppDispatch} from '../../store/store';
import {FilterItem} from './FilterItem';

const styles = StyleSheet.create({
  sectionHeader: {
    paddingHorizontal: 28,
  },
  sectionHeaderText: {
    fontSize: 18,
    fontWeight: '600',
    color: 'black',
  },
});

const SectionHeader: FC<{label: string}> = ({label}) => (
  <View style={styles.sectionHeader}>
    <Text style={styles.sectionHeaderText}>{label}</Text>
  </View>
);

export interface IFilter {
  name: string;
  selected: boolean;
}

interface IFilters {
  header: string;
  items: IFilter[];
  disabled?: boolean;
  actionOnFilter?: ActionCreatorWithPayload<string[]>;
}

export const Filters: FC<IFilters> = ({
  header,
  items,
  disabled,
  actionOnFilter,
}) => {
  const dispatch = useAppDispatch();

  const onPress = useCallback(
    (pressedName: string) => {
      if (actionOnFilter) {
        const filters = items
          .filter(item =>
            item.name === pressedName ? !item.selected : item.selected,
          )
          .map(item => item.name);
        dispatch(actionOnFilter(filters));
      }
    },
    [items, dispatch, actionOnFilter],
  );

  return (
    <Section header={<SectionHeader label={header} />}>
      {items.map(item => (
        <FilterItem
          key={item.name}
          label={item.name}
          selected={item.selected}
          disabled={disabled}
          onPress={onPress}
        />
      ))}
    </Section>
  );
};

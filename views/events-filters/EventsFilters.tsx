import React, {FC, useCallback, useEffect, useMemo, useState} from 'react';
import {useIntl} from 'react-intl';
import {ScrollView, StyleSheet} from 'react-native';
import {
  selectAvailableCameras,
  selectAvailableLabels,
  selectAvailableZones,
  selectFiltersCameras,
  selectFiltersLabels,
  selectFiltersRetained,
  selectFiltersZones,
  setFiltersCameras,
  setFiltersLabels,
  setFiltersRetained,
  setFiltersZones,
} from '../../store/events';
import {useAppDispatch, useAppSelector} from '../../store/store';
import {Filters, IFilter, SectionHeader} from './Filters';
import {messages} from './messages';
import { Section } from '../../components/forms/Section';
import { FilterSwitch } from './FilterSwitch';
import { addNotificationsFilter, removeNotificationsFilter, selectNotificationsFilter, setNotificationsFilterEnabled } from '../../store/settings';

interface IEventsFiltersProps {
  viewedCameraNames?: string[];
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: 'white',
    width: '100%',
    height: '100%',
  },
});

export const EventsFilters: FC<IEventsFiltersProps> = ({viewedCameraNames}) => {
  const availableCameras = useAppSelector(selectAvailableCameras);
  const filtersCameras = useAppSelector(selectFiltersCameras);
  const availableLabels = useAppSelector(selectAvailableLabels);
  const filtersLabels = useAppSelector(selectFiltersLabels);
  const availableZones = useAppSelector(selectAvailableZones);
  const filtersZones = useAppSelector(selectFiltersZones);
  const filtersRetained = useAppSelector(selectFiltersRetained);
  const [notify, setNofity] = useState(false);
  const existingNotificationsFilter = useAppSelector(state => selectNotificationsFilter(state, {
    cameras: cameras?.filter(s => s).map(s => s.name),
    labels: labels?.filter(s => s).map(s => s.name),
    zones: zones?.filter(s => s).map(s => s.name),
  }));
  const dispatch = useAppDispatch();
  const intl = useIntl();

  useEffect(() => {
    if (existingNotificationsFilter) {
      setNofity(existingNotificationsFilter.enabled);
    }
  }, [existingNotificationsFilter]);

  const cameras: IFilter[] = useMemo(
    () =>
      availableCameras.map(cameraName => ({
        name: cameraName,
        selected: (viewedCameraNames
          ? viewedCameraNames
          : filtersCameras
        ).includes(cameraName),
      })),
    [availableCameras, filtersCameras, viewedCameraNames],
  );

  const labels: IFilter[] = useMemo(
    () =>
      availableLabels.map(cameraName => ({
        name: cameraName,
        selected: filtersLabels.includes(cameraName),
      })),
    [availableLabels, filtersLabels],
  );

  const zones: IFilter[] = useMemo(
    () =>
      availableZones.map(cameraName => ({
        name: cameraName,
        selected: filtersZones.includes(cameraName),
      })),
    [availableZones, filtersZones],
  );

  const notifyChange = useCallback((value: boolean) => {
    if (existingNotificationsFilter) {
      if (existingNotificationsFilter.enabled) {
        dispatch(removeNotificationsFilter(existingNotificationsFilter));
      } else {
        dispatch(setNotificationsFilterEnabled({
          ...existingNotificationsFilter,
          enabled: true,
        }));
      }
    } else {
      dispatch(addNotificationsFilter({
        enabled: true,
        cameras: cameras.filter(s => s).map(s => s.name),
        labels: labels.filter(s => s).map(s => s.name),
        zones: zones.filter(s => s).map(s => s.name),
      }));
    }
  }, [notify, cameras, labels, zones]);

  return (
    <ScrollView style={[styles.wrapper]}>
      <Filters
        header={intl.formatMessage(messages['cameras.title'])}
        items={cameras}
        disabled={viewedCameraNames !== undefined}
        actionOnFilter={setFiltersCameras}
      />
      <Filters
        header={intl.formatMessage(messages['labels.title'])}
        items={labels}
        actionOnFilter={setFiltersLabels}
      />
      <Filters
        header={intl.formatMessage(messages['zones.title'])}
        items={zones}
        actionOnFilter={setFiltersZones}
      />
      <Section
        header={(
          <SectionHeader
            label={intl.formatMessage(messages['miscellaneous.title'])} />
        )}
      >
        <FilterSwitch
          label={intl.formatMessage(messages['miscellaneous.retained.label'])}
          value={filtersRetained}
          actionOnChange={setFiltersRetained}
        />
        <FilterSwitch
          label={intl.formatMessage(messages['miscellaneous.notify.label'])}
          value={notify}
          onChange={notifyChange}
        />
      </Section>
    </ScrollView>
  );
};

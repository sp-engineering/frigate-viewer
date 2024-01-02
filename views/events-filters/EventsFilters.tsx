import React, {FC, useMemo} from 'react';
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
import {useAppSelector} from '../../store/store';
import {Filters, IFilter, SectionHeader} from './Filters';
import {messages} from './messages';
import { Section } from '../../components/forms/Section';
import { FilterSwitch } from './FilterSwitch';
import { colors, darkModeColors, lightModeColors } from '../../store/colors';

interface IEventsFiltersProps {
  viewedCameraNames?: string[];
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: colors.background,
    color: colors.text,
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
  const intl = useIntl();

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
      </Section>
    </ScrollView>
  );
};

import React, {FC, useMemo} from 'react';
import {ScrollView, StyleSheet} from 'react-native';
import {componentWithRedux} from '../../helpers/redux';
import {
  selectAvailableCameras,
  selectAvailableLabels,
  selectAvailableZones,
  selectFiltersCameras,
  selectFiltersLabels,
  selectFiltersZones,
  setFiltersCameras,
  setFiltersLabels,
  setFiltersZones,
} from '../../store/events';
import {useAppSelector} from '../../store/store';
import {Filters, IFilter} from './Filters';

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

const EventsFiltersComponent: FC<IEventsFiltersProps> = ({
  viewedCameraNames,
}) => {
  const availableCameras = useAppSelector(selectAvailableCameras);
  const filtersCameras = useAppSelector(selectFiltersCameras);
  const availableLabels = useAppSelector(selectAvailableLabels);
  const filtersLabels = useAppSelector(selectFiltersLabels);
  const availableZones = useAppSelector(selectAvailableZones);
  const filtersZones = useAppSelector(selectFiltersZones);

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
        header="Cameras"
        items={cameras}
        disabled={viewedCameraNames !== undefined}
        actionOnFilter={setFiltersCameras}
      />
      <Filters
        header="Labels"
        items={labels}
        actionOnFilter={setFiltersLabels}
      />
      <Filters header="Zones" items={zones} actionOnFilter={setFiltersZones} />
    </ScrollView>
  );
};

export const EventsFilters = componentWithRedux(EventsFiltersComponent);

import React, {FC} from 'react';
import {StyleSheet, View} from 'react-native';
import {Section} from '../../components/forms/Section';
import {componentWithRedux} from '../../helpers/redux';
import {
  selectAvailableCameras,
  selectAvailableLabels,
  selectAvailableZones,
} from '../../store/events';
import {useAppSelector} from '../../store/store';
import {FilterItem} from './FilterItem';

interface IEventsFiltersProps {}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: 'white',
    width: '100%',
    height: '100%',
  },
});

const EventsFiltersComponent: FC<IEventsFiltersProps> = () => {
  const cameras = useAppSelector(selectAvailableCameras);
  const labels = useAppSelector(selectAvailableLabels);
  const zones = useAppSelector(selectAvailableZones);

  return (
    <View style={[styles.wrapper]}>
      <Section header="Cameras">
        {cameras.map(cameraName => (
          <FilterItem key={cameraName} label={cameraName} />
        ))}
      </Section>
      <Section header="Labels">
        {labels.map(labelName => (
          <FilterItem key={labelName} label={labelName} />
        ))}
      </Section>
      <Section header="Zones">
        {zones.map(zoneName => (
          <FilterItem key={zoneName} label={zoneName} />
        ))}
      </Section>
    </View>
  );
};

export const EventsFilters = componentWithRedux(EventsFiltersComponent);

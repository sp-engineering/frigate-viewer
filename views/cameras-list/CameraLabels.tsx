import React, {FC, useCallback} from 'react';
import {Pressable, ScrollView, StyleSheet, Text, View} from 'react-native';
import {Colors} from 'react-native-ui-lib';
import {selectAvailableLabels} from '../../store/events';
import {selectCamerasPreviewHeight} from '../../store/settings';
import {useAppSelector} from '../../store/store';

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    backgroundColor: Colors.green70,
  },
  labels: {
    display: 'flex',
    margin: 2,
    marginTop: 35,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  label: {
    display: 'flex',
    margin: 2,
    padding: 5,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-end',
    width: 88,
    height: 88,
    backgroundColor: Colors.green40,
  },
  labelText: {
    color: 'white',
  },
  iconEmoji: {
    fontSize: 40,
    color: 'white',
  },
});

const labelEmoji: Record<string, string> = {
  person: '🧑',
  car: '🚗',
  cat: '🐈',
  dog: '🐕',
  bus: '🚌',
  bicycle: '🚲',
  plate: '🔢',
};

interface ICameraLabelsProps {
  onLabelPress: (label: string) => void;
}

export const CameraLabels: FC<ICameraLabelsProps> = ({onLabelPress}) => {
  const labels = useAppSelector(selectAvailableLabels);
  const previewHeight = useAppSelector(selectCamerasPreviewHeight);

  const onPress = useCallback(
    (label: string) => () => {
      onLabelPress(label);
    },
    [onLabelPress],
  );

  return (
    <ScrollView style={[styles.wrapper, {height: previewHeight}]}>
      <View style={styles.labels}>
        {labels.map(label => (
          <Pressable onPress={onPress(label)} key={label}>
            <View style={styles.label}>
              {labelEmoji[label] && (
                <Text style={styles.iconEmoji}>{labelEmoji[label]}</Text>
              )}
              <Text style={styles.labelText}>{label}</Text>
            </View>
          </Pressable>
        ))}
      </View>
    </ScrollView>
  );
};

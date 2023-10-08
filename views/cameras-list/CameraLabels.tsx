import React, {FC, useCallback} from 'react';
import {Pressable, StyleSheet, Text} from 'react-native';
import {Colors} from 'react-native-ui-lib';
import {selectAvailableLabels} from '../../store/events';
import {selectCamerasPreviewHeight} from '../../store/settings';
import {useAppSelector} from '../../store/store';
import {FlatList} from 'react-native-gesture-handler';

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    height: '100%',
    backgroundColor: Colors.green70,
    padding: 2,
    marginTop: 35,
  },
  label: {
    display: 'flex',
    margin: 2,
    padding: 5,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-end',
    flex: 1,
    maxWidth: '24%',
    height: 80,
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
      <FlatList
        data={labels}
        numColumns={4}
        renderItem={({item}) => (
          <Pressable
            style={styles.label}
            onPress={onPress(item)}
          >
            {labelEmoji[item] && (
              <Text style={styles.iconEmoji}>{labelEmoji[item]}</Text>
            )}
            <Text style={styles.labelText}>{item}</Text>
          </Pressable>
        )}
        keyExtractor={label => label}
        style={[styles.wrapper, {height: previewHeight - 35}]}
      ></FlatList>
  );
};

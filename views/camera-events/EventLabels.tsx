import React, {FC, useMemo} from 'react';
import {useIntl} from 'react-intl';
import {StyleSheet, Text, View} from 'react-native';
import {messages} from './messages';

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    left: 2,
    bottom: 1,
    width: '100%',
    padding: 2,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  label: {
    paddingVertical: 1,
    paddingHorizontal: 2,
    margin: 1,
    color: 'white',
    backgroundColor: 'blue',
    fontSize: 10,
    fontWeight: '600',
    opacity: 0.7,
  },
  zone: {
    backgroundColor: 'black',
  },
  score: {
    backgroundColor: 'gray',
  },
  inProgress: {
    color: 'black',
    backgroundColor: 'gold',
  },
});

interface IEventLabelsProps {
  endTime: number;
  label: string;
  zones: string[];
  topScore: number;
}

export const EventLabels: FC<IEventLabelsProps> = ({
  endTime,
  label,
  zones,
  topScore,
}) => {
  const score = useMemo(() => `${Math.round(topScore * 100)}%`, [topScore]);
  const isInProgress = useMemo(() => !endTime, [endTime]);
  const intl = useIntl();

  return (
    <View style={[styles.wrapper]}>
      <Text style={[styles.label]}>{label}</Text>
      {zones.map(zone => (
        <Text style={[styles.label, styles.zone]} key={zone}>
          {zone}
        </Text>
      ))}
      <Text style={[styles.label, styles.score]}>{score}</Text>
      {isInProgress && (
        <Text style={[styles.label, styles.inProgress]}>
          {intl.formatMessage(messages['labels.inProgressLabel'])}
        </Text>
      )}
    </View>
  );
};

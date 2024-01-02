import React, { FC, useMemo } from 'react';
import { useIntl } from 'react-intl';
import { StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { messages } from './messages';
import { colors } from '../../store/colors';

const stylesFn = (numColumns: number) => StyleSheet.create({
  wrapper: {
    position: 'absolute',
    left: 2,
    bottom: 1,
    width: '100%',
    padding: 2,
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: colors.background,
    color: colors.text,
  },
  label: {
    paddingVertical: 1,
    paddingHorizontal: 2,
    margin: 1,
    color: colors.text,
    backgroundColor: 'blue',
    fontSize: 10 / (numColumns / 1.5),
    fontWeight: '600',
    opacity: 0.7,
  },
  zone: {
    backgroundColor: colors.background,
  },
  score: {
    backgroundColor: 'gray',
  },
  inProgress: {
    color: colors.text,
    backgroundColor: 'gold',
  },
});

interface IEventLabelsProps {
  endTime: number;
  label: string;
  zones: string[];
  topScore: number;
  style?: StyleProp<ViewStyle>;
  numColumns?: number;
}

export const EventLabels: FC<IEventLabelsProps> = ({
  endTime,
  label,
  zones,
  topScore,
  style,
  numColumns,
}) => {
  const score = useMemo(() => `${Math.round(topScore * 100)}%`, [topScore]);
  const isInProgress = useMemo(() => !endTime, [endTime]);
  const intl = useIntl();

  const styles = useMemo(() => stylesFn(numColumns || 1), [numColumns]);

  return (
    <View style={[styles.wrapper, style]}>
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

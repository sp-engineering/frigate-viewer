import { FC, useMemo } from 'react';
import { StorageInfo, StorageShortPlace } from '../../helpers/interfaces';
import { StyleSheet } from 'react-native';
import { ProgressCircle } from 'react-native-svg-charts';
import { Text, View } from 'react-native-ui-lib';
import { useIntl } from 'react-intl';
import { messages } from './messages';

const styles = StyleSheet.create({
  wrapper: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  circle: {
    position: 'absolute',
    left: 0,
    width: '100%',
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 2,
  },
  legendMarker: {
    width: 12,
    height: 12,
    borderRadius: 4,
    marginRight: 4,
  },
  legendLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  legendValue: {
    marginLeft: 2,
    fontSize: 12,
  },
});

interface ChartData {
  label: string;
  value: number;
  color: string;
}

interface IStorageChartProps {
  storage: Record<StorageShortPlace, StorageInfo>;
}

const percent = (value: number) => `${Math.floor(value * 100)}%`;

export const StorageChart: FC<IStorageChartProps> = ({storage}) => {
  const intl = useIntl();

  const chartData: ChartData[] = useMemo(() => {
    const { recordings, cache, shm } = storage;
    return [
      {
        label: intl.formatMessage(messages['location.recordings']),
        value: recordings.used / recordings.total,
        color: 'rgb(249, 166, 2)',
      },
      {
        label: intl.formatMessage(messages['location.cache']),
        value: cache.used / cache.total,
        color: 'gold',
      },
      {
        label: intl.formatMessage(messages['location.shm']),
        value: shm.used / shm.total,
        color: 'yellow',
      },
    ];
  }, [storage]);

  const angle = useMemo(() => Math.PI * 0.8, []);
  const height = useMemo(() => 260, []);
  const offset = useMemo(() => 12, []);

  return (
    <View style={[styles.wrapper, { height}]}>
      {chartData.map((point, index) => (
        <ProgressCircle
          style={[styles.circle, { top: offset * index, height: height - 2 * offset * index }]}
          progress={point.value}
          progressColor={point.color}
          startAngle={-angle}
          endAngle={angle}
          key={index}
        />
      ))}
      <View>
        {chartData.map((point, i) => (
          <View style={styles.legend} key={i}>
            <View style={[styles.legendMarker, { backgroundColor: point.color }]}></View>
            <Text style={styles.legendLabel}>{point.label}:</Text>
            <Text style={styles.legendValue}>{percent(point.value)}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

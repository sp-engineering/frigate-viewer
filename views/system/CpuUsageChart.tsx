import {FC, useMemo} from 'react';
import {StyleSheet} from 'react-native';
import {Text, View} from 'react-native-ui-lib';
import {GpuRow} from './GpusTable';
import {DetectorRow} from './DetectorsTable';
import {getColor} from '../../helpers/charts';
import {
  ProgressChart,
  ProgressChartData,
} from '../../components/charts/ProgressChart';
import {useIntl} from 'react-intl';
import {messages} from './messages';

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
  },
  chartTitle: {
    fontSize: 10,
    textAlign: 'center',
    fontWeight: '600',
  },
});

interface ICpuUsageChartProps {
  detectors: DetectorRow[];
  gpus: GpuRow[];
}

export const CpuUsageChart: FC<ICpuUsageChartProps> = ({detectors, gpus}) => {
  const intl = useIntl();

  const chartData: [ProgressChartData[], ProgressChartData[]] = useMemo(() => {
    const data = [
      ...gpus.map((gpu, gpuIndex) => ({
        label: gpu.name.substring(0, 12),
        cpu: gpu.gpu / 100,
        mem: gpu.mem / 100,
        color: getColor(gpuIndex),
      })),
      ...detectors
        .filter(d => d.cpu !== undefined)
        .map((detector, detectorIndex) => ({
          label: detector.name.substring(0, 12),
          cpu: (detector.cpu || 0) / 100,
          mem: (detector.mem || 0) / 100,
          color: getColor(gpus.length + detectorIndex),
        })),
    ];
    return [
      data.map(({label, cpu, color}) => ({label, value: cpu, color})),
      data.map(({label, mem, color}) => ({label, value: mem, color})),
    ];
  }, [detectors, gpus]);

  return (
    <View style={styles.wrapper}>
      <View style={{flex: 1}}>
        <ProgressChart chartData={chartData[0]} height={160} />
        <Text style={styles.chartTitle}>
          {intl.formatMessage(messages['usageChart.usage'])}
        </Text>
      </View>
      <View style={{flex: 1}}>
        <ProgressChart chartData={chartData[1]} height={160} />
        <Text style={styles.chartTitle}>
          <Text style={styles.chartTitle}>
            {intl.formatMessage(messages['usageChart.memory'])}
          </Text>
        </Text>
      </View>
    </View>
  );
};

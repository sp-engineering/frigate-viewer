import { FC, useMemo } from 'react';
import { getRandomColor } from '../../helpers/charts';
import { CameraInfo } from './CameraTable';
import { BarChart, Grid, YAxis } from 'react-native-svg-charts';
import { Text, View } from 'react-native-ui-lib';
import * as scale from 'd3-scale';
import { StyleSheet } from 'react-native';
import { messages } from './messages';
import { useIntl } from 'react-intl';

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
  },
  chart: {
    flex: 1,
  },
  chartTitle: {
    fontSize: 10,
    textAlign: 'center',
    fontWeight: '600',
  },
});

interface BarChartData {
  data: number[];
  svg?: {
    fill?: string;
  };
}

interface ICameraInfoChartProps {
  cameraInfos: Record<string, CameraInfo>;
}

export const CameraInfoChart: FC<ICameraInfoChartProps> = ({cameraInfos}) => {
  const intl = useIntl();
  const cameraNames = useMemo(() => Object.keys(cameraInfos), [cameraInfos]);

  const chartData: BarChartData[] = useMemo(
    () => [
      {
        data: Object.values(cameraInfos).map(info => info.ffmpeg.cpu!).filter(v => v !== undefined),
        svg: { fill: getRandomColor() },
      },
      {
        data: Object.values(cameraInfos).map(info => info.capture.cpu!).filter(v => v !== undefined),
        svg: { fill: getRandomColor() },
      },
      {
        data: Object.values(cameraInfos).map(info => info.detect.cpu!).filter(v => v !== undefined),
        svg: { fill: getRandomColor() },
      },
    ],
    [cameraInfos],
  );

  const chartHeight = useMemo(() => Math.min(cameraNames.length * 30, 200), [cameraNames]);

  return (
    <View>
      <View style={styles.wrapper}>
        <YAxis
          data={cameraNames}
          yAccessor={({ index }) => index}
          scale={scale.scaleBand}
          formatLabel={(_, i) => cameraNames[i]}
        />
        <View style={{flex: 1}}>
          <BarChart
            style={[styles.chart, {height: chartHeight}]}
            data={chartData}
            horizontal={true}
            gridMin={0}
            gridMax={100}
            spacingInner={0.3}
            spacingOuter={0.3}
          >
            <Grid direction={Grid.Direction.VERTICAL} />
          </BarChart>
          {/* <XAxis
            style={{ marginTop: 10 }}
            data={[0, 1]}
            numberOfTicks={5}
            scale={scale.scaleLinear}
            formatLabel={value => `${value * 100}%`}
          /> */}
        </View>
      </View>
      <View>
        <Text style={styles.chartTitle}>{intl.formatMessage(messages['cameraInfoChart.usage'])}</Text>
      </View>
    </View>
  );
};

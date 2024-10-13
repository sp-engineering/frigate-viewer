import {FC, useMemo} from 'react';
import {getColor} from '../../helpers/charts';
import {CameraInfo} from './CameraTable';
import {BarChart, Grid, YAxis} from 'react-native-svg-charts';
import {Text, View} from 'react-native-ui-lib';
import * as scale from 'd3-scale';
import {messages} from './messages';
import {useIntl} from 'react-intl';
import {useStyles} from '../../helpers/colors';

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
  const styles = useStyles(({theme}) => ({
    wrapper: {
      flexDirection: 'row',
    },
    chart: {
      flex: 1,
    },
    chartTitle: {
      color: theme.text,
      fontSize: 10,
      textAlign: 'center',
      fontWeight: '600',
    },
  }));

  const intl = useIntl();
  const cameraNames = useMemo(() => Object.keys(cameraInfos), [cameraInfos]);

  const chartData: BarChartData[] = useMemo(
    () => [
      {
        data: Object.values(cameraInfos)
          .map(info => info.ffmpeg.cpu! || 0)
          .filter(v => v !== undefined),
        svg: {fill: getColor(0)},
      },
      {
        data: Object.values(cameraInfos)
          .map(info => info.capture.cpu! || 0)
          .filter(v => v !== undefined),
        svg: {fill: getColor(1)},
      },
      {
        data: Object.values(cameraInfos)
          .map(info => info.detect.cpu! || 0)
          .filter(v => v !== undefined),
        svg: {fill: getColor(2)},
      },
    ],
    [cameraInfos],
  );

  const chartHeight = useMemo(
    () => Math.min(cameraNames.length * 30, 200),
    [cameraNames],
  );

  const yAxisData = useMemo(
    () =>
      cameraNames.map(name => {
        name;
      }),
    [cameraNames],
  );

  return (
    <View>
      <View style={styles.wrapper}>
        {cameraNames.length > 0 && (
          <YAxis
            data={yAxisData}
            yAccessor={({index}) => index}
            scale={scale.scaleBand}
            formatLabel={(d, i) => cameraNames[i]}
          />
        )}
        <View style={{flex: 1}}>
          <BarChart
            style={[styles.chart, {height: chartHeight}]}
            data={chartData}
            horizontal={true}
            gridMin={0}
            gridMax={100}
            spacingInner={0.3}
            spacingOuter={0.3}>
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
        <Text style={styles.chartTitle}>
          {intl.formatMessage(messages['cameraInfoChart.usage'])}
        </Text>
      </View>
    </View>
  );
};

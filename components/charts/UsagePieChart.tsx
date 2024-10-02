import {FC, useMemo} from 'react';
import {StyleSheet} from 'react-native';
import {PieChart, PieChartData} from 'react-native-svg-charts';
import {View} from 'react-native-ui-lib';
import {Circle, G, Line, Text} from 'react-native-svg';

const styles = StyleSheet.create({
  wrapper: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pie: {
    width: '100%',
    height: '100%',
  },
});

interface Slice {
  labelCentroid: [number, number];
  pieCentroid: [number, number];
  data: PieChartData;
}

export interface UsagePieChartData {
  label: string;
  value: number;
  color: string;
}

interface IUsagePieChartProps {
  chartData: UsagePieChartData[];
  height: number;
}

export const UsagePieChart: FC<IUsagePieChartProps> = ({chartData, height}) => {
  const data: PieChartData[] = useMemo(
    () => [
      ...chartData.map(({label, value, color}) => ({
        key: label,
        value,
        svg: {fill: color},
        arc: {outerRadius: '110%', cornerRadius: 5},
      })),
      {
        key: '_free',
        value: 100 - chartData.reduce((sum, data) => sum + data.value, 0),
        svg: {fill: '#ddd'},
        arc: {cornerRadius: 5},
      },
    ],
    [chartData],
  );

  const Labels: FC<{slices?: Slice[]}> = ({slices}) => (
    <>
      {slices &&
        slices
          .filter(slice => slice.data.key !== '_free')
          .map((slice, index) => {
            const {labelCentroid, pieCentroid, data} = slice;
            const [centroidX, centroidY] = slice.labelCentroid;
            let alignment: 'start' | 'end' | 'middle' = 'middle';
            let dx = 0; // Default no horizontal shift
            let dy = 0; // Default no vertical shift

            // Adjust dx and dy based on quadrant
            if (centroidX > 0 && centroidY < 0) {
              // Top-right quadrant
              alignment = 'start';
              dx = 10; // Move text right
            } else if (centroidX < 0 && centroidY < 0) {
              // Top-left quadrant
              alignment = 'end';
              dx = -10; // Move text left
            } else if (centroidX < 0 && centroidY > 0) {
              // Bottom-left quadrant
              alignment = 'middle';
              dx = 0;
              dy = 10; // Move text down
            } else if (centroidX > 0 && centroidY > 0) {
              // Bottom-right quadrant
              alignment = 'start';
              dx = 10; // Move text right
            }

            return (
              <G key={index}>
                <Line
                  x1={labelCentroid[0]}
                  y1={labelCentroid[1]}
                  x2={pieCentroid[0]}
                  y2={pieCentroid[1]}
                  stroke={data.svg?.fill}
                />
                <Text
                  fill={data.svg?.fill}
                  alignmentBaseline={'middle'}
                  x={centroidX}
                  y={centroidY}
                  dx={dx}
                  dy={dy}
                  textAnchor={alignment}>
                  {data.key}
                </Text>
                <Circle
                  cx={labelCentroid[0]}
                  cy={labelCentroid[1]}
                  r={3}
                  fill={data.svg?.fill}
                />
              </G>
            );
          })}
    </>
  );

  return (
    <View style={[styles.wrapper, {height}]}>
      <PieChart
        data={data}
        innerRadius={10}
        outerRadius={80}
        labelRadius={110}
        style={styles.pie}>
        <Labels />
      </PieChart>
    </View>
  );
};

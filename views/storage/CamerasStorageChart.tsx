import { FC, useMemo } from 'react';
import { CamerasStorage } from '../../helpers/interfaces';
import { StyleSheet } from 'react-native';
import { PieChart, PieChartData } from 'react-native-svg-charts';
import { View } from 'react-native-ui-lib';
import { Circle, G, Line, Text } from 'react-native-svg';

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

const randomColor = () => ('#' + (Math.random() * 0xFFFFFF << 0).toString(16) + '000000').slice(0, 7);

interface Slice {
  labelCentroid: [number, number];
  pieCentroid: [number, number];
  data: PieChartData;
}

interface ICamerasStorageChartProps {
  camerasStorage: CamerasStorage;
}

export const CamerasStorageChart: FC<ICamerasStorageChartProps> = ({camerasStorage}) => {
  const height = useMemo(() => 260, []);

  const data: PieChartData[] = useMemo(() => [
    ...Object
      .keys(camerasStorage)
      .map(cameraName => ({
        key: cameraName,
        value: camerasStorage[cameraName].usage_percent,
        svg: { fill: randomColor() },
        arc: { outerRadius: '110%', cornerRadius: 5 }
      })),
    {
      key: '_free',
      value: 100 - Object
        .values(camerasStorage)
        .reduce((sum, cameraInfo) => sum + cameraInfo.usage_percent, 0),
      svg: { fill: '#ddd' },
      arc: { cornerRadius: 5 }
    },
  ], [camerasStorage]);

  const Labels: FC<{ slices?: Slice[] }> = ({ slices }) => (
    <>
      {slices && slices
        .filter(slice => slice.data.key !== '_free')
        .map((slice, index) => {
          const { labelCentroid, pieCentroid, data } = slice;
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
                    x={labelCentroid[0]}
                    y={labelCentroid[1]}
                    dx={5}
                    dy={3}
                    fill={data.svg?.fill}
                  >{data.key}</Text>
                  <Circle
                      cx={labelCentroid[0]}
                      cy={labelCentroid[1]}
                      r={3}
                      fill={data.svg?.fill}
                  />
              </G>
          );
        })
      }
    </>
  );

  return (
    <View style={[styles.wrapper, { height}]}>
      <PieChart data={data} innerRadius={10} outerRadius={80} labelRadius={110} style={styles.pie}>
        <Labels />
      </PieChart>
    </View>
  );
};

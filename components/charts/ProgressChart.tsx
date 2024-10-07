import {FC, useMemo} from 'react';
import {ProgressCircle} from 'react-native-svg-charts';
import {Text, View} from 'react-native-ui-lib';
import {useStyles} from '../../helpers/colors';

export interface ProgressChartData {
  label: string;
  value: number;
  color: string;
}

interface IProgressChartProps {
  chartData: ProgressChartData[];
  height: number;
  angle?: number;
  offset?: number;
}

const percent = (value: number) => `${Math.floor(value * 100)}%`;

export const ProgressChart: FC<IProgressChartProps> = ({
  chartData,
  angle,
  height,
  offset,
}) => {
  const styles = useStyles(({theme}) => ({
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
      color: theme.text,
      fontSize: 12,
      fontWeight: '600',
    },
    legendValue: {
      color: theme.text,
      marginLeft: 2,
      fontSize: 12,
    },
  }));

  const startAngle = useMemo(() => Math.PI * angle!, []);

  return (
    <View style={[styles.wrapper, {height}]}>
      {chartData.map((point, index) => (
        <ProgressCircle
          style={[
            styles.circle,
            {top: offset! * index, height: height - 2 * offset! * index},
          ]}
          progress={point.value}
          progressColor={point.color}
          startAngle={-startAngle}
          endAngle={startAngle}
          key={index}
        />
      ))}
      <View>
        {chartData.map((point, i) => (
          <View style={styles.legend} key={i}>
            <View
              style={[
                styles.legendMarker,
                {backgroundColor: point.color},
              ]}></View>
            <Text style={styles.legendLabel}>{point.label}:</Text>
            <Text style={styles.legendValue}>{percent(point.value)}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};
ProgressChart.defaultProps = {
  angle: 0.8,
  offset: 12,
};

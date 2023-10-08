import {format, formatDistance, formatRelative} from 'date-fns';
import React, {FC, useMemo} from 'react';
import {StyleProp, StyleSheet, Text, View, ViewStyle} from 'react-native';
import {formatVideoTime, useDateLocale} from '../../helpers/locale';
import {selectLocaleDatesDisplay} from '../../store/settings';
import {useAppSelector} from '../../store/store';

const stylesFn = (numColumns: number) => StyleSheet.create({
  wrapper: {
    position: 'absolute',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    left: 2,
    top: 1,
    width: '100%',
    padding: 5 / numColumns,
    backgroundColor: '#00000040',
  },
  timeText: {
    fontSize: 12 / (numColumns / 1.5),
    fontWeight: '600',
    color: 'white',
  },
});

interface IEventTitleProps {
  startTime: number;
  endTime: number;
  retained: boolean;
  style?: StyleProp<ViewStyle>;
  numColumns?: number;
}

export const EventTitle: FC<IEventTitleProps> = ({
  startTime,
  endTime,
  retained,
  style,
  numColumns,
}) => {
  const dateLocale = useDateLocale();
  const datesDisplay = useAppSelector(selectLocaleDatesDisplay);

  const isInProgress = useMemo(() => !endTime, [endTime]);

  const startDate = useMemo(
    () =>
      datesDisplay === 'descriptive'
        ? formatRelative(new Date(startTime * 1000), new Date(), {
            locale: dateLocale,
          })
        : format(new Date(startTime * 1000), 'Pp', {locale: dateLocale}),
    [startTime, dateLocale, datesDisplay],
  );

  const duration = useMemo(
    () =>
      datesDisplay === 'descriptive'
        ? formatDistance(new Date(endTime * 1000), new Date(startTime * 1000), {
            includeSeconds: true,
            locale: dateLocale,
          })
        : formatVideoTime(Math.round(endTime * 1000 - startTime * 1000)),
    [startTime, endTime, dateLocale, datesDisplay],
  );

  const styles = useMemo(() => stylesFn(numColumns || 1), [numColumns]);

  return (
    <View style={[styles.wrapper, style]}>
      <Text style={styles.timeText}>
        {startDate} {!isInProgress && <Text>({duration})</Text>}
      </Text>
      {retained && <Text>⭐</Text>}
    </View>
  );
};

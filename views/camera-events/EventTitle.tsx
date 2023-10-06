import {format, formatDistance, formatRelative} from 'date-fns';
import React, {FC, useMemo} from 'react';
import {StyleSheet, Text} from 'react-native';
import {formatVideoTime, useDateLocale} from '../../helpers/locale';
import {selectLocaleDatesDisplay} from '../../store/settings';
import {useAppSelector} from '../../store/store';

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    left: 2,
    top: 1,
    width: '100%',
    padding: 5,
    fontSize: 12,
    fontWeight: '600',
    color: 'white',
    backgroundColor: '#00000040',
  },
});

interface IEventTitleProps {
  startTime: number;
  endTime: number;
}

export const EventTitle: FC<IEventTitleProps> = ({startTime, endTime}) => {
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

  return (
    <Text style={[styles.wrapper]}>
      {startDate} {!isInProgress && <Text>({duration})</Text>}
    </Text>
  );
};

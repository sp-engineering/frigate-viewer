import { FC, useMemo } from 'react';
import { StorageInfo, StorageShortPlace } from '../../helpers/interfaces';
import { useIntl } from 'react-intl';
import { messages } from './messages';
import { ProgressChartData, ProgressChart } from '../../components/charts/ProgressChart';

interface IStorageChartProps {
  storage: Record<StorageShortPlace, StorageInfo>;
}

export const StorageChart: FC<IStorageChartProps> = ({storage}) => {
  const intl = useIntl();

  const chartData: ProgressChartData[] = useMemo(() => {
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

  return <ProgressChart chartData={chartData} height={260} />;
};

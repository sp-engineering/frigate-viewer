import { FC, useMemo } from 'react';
import { CamerasStorage } from '../../helpers/interfaces';
import { getRandomColor } from '../../helpers/charts';
import { UsagePieChart, UsagePieChartData } from '../../components/charts/UsagePieChart';

interface ICamerasStorageChartProps {
  camerasStorage: CamerasStorage;
}

export const CamerasStorageChart: FC<ICamerasStorageChartProps> = ({ camerasStorage }) => {
  const chartData: UsagePieChartData[] = useMemo(
    () => Object.keys(camerasStorage)
      .map(cameraName => ({
        label: cameraName,
        value: camerasStorage[cameraName].usage_percent,
        color: getRandomColor(),
      })),
    [camerasStorage],
  );

  return <UsagePieChart chartData={chartData} height={260} />;
};


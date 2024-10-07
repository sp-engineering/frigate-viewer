import {FC, useMemo} from 'react';
import {
  Cell,
  Col,
  Rows,
  Table,
  TableWrapper,
} from 'react-native-reanimated-table';
import {useIntl} from 'react-intl';
import {messages} from './messages';
import {useTableStyles} from '../../helpers/table';

export interface DetectorRow {
  name: string;
  inferenceSpeed: number;
  cpu?: number;
  mem?: number;
}

interface IDetectorseTableProps {
  detectors: DetectorRow[];
}

export const DetectorsTable: FC<IDetectorseTableProps> = ({detectors}) => {
  const intl = useIntl();
  const tableStyles = useTableStyles();

  const dataHeaders = useMemo(
    () => detectors.map(detector => detector.name),
    [detectors],
  );

  const inferenceSpeedData = useMemo(
    () => detectors.map(detector => `${detector.inferenceSpeed}`),
    [detectors],
  );

  const isCpuUsageInfo = useMemo(
    () => detectors.some(detector => detector.cpu),
    [detectors],
  );

  const cpuData = useMemo(
    () =>
      isCpuUsageInfo
        ? detectors.map(detector => [
            detector.cpu ? `${detector.cpu.toFixed(1)}%` : '-',
            detector.mem ? `${detector.mem.toFixed(1)}%` : '-',
          ])
        : undefined,
    [detectors, isCpuUsageInfo],
  );

  return (
    <Table borderStyle={{borderWidth: 1}}>
      <TableWrapper style={tableStyles.row}>
        <Cell
          data={intl.formatMessage(messages['detectors.detector.header'])}
          style={tableStyles.mainHeader}
          textStyle={tableStyles.mainHeaderText}
        />
        <Cell
          data={intl.formatMessage(
            messages['detectors.inference_speed.header'],
          )}
          style={tableStyles.header}
          textStyle={tableStyles.headerText}
        />
        {isCpuUsageInfo ? (
          <Cell
            data={intl.formatMessage(messages['detectors.cpu_usage.header'])}
            style={tableStyles.header}
            textStyle={tableStyles.headerText}
          />
        ) : (
          <></>
        )}
        {isCpuUsageInfo ? (
          <Cell
            data={intl.formatMessage(messages['detectors.mem_usage.header'])}
            style={tableStyles.header}
            textStyle={tableStyles.headerText}
          />
        ) : (
          <></>
        )}
      </TableWrapper>
      <TableWrapper style={tableStyles.row}>
        <Col
          data={dataHeaders}
          style={tableStyles.dataHeader}
          textStyle={tableStyles.dataHeaderText}
        />
        <Col
          data={inferenceSpeedData}
          style={tableStyles.data}
          textStyle={tableStyles.dataText}
        />
        {isCpuUsageInfo && cpuData ? (
          <Rows
            data={cpuData}
            flexArr={[1, 1]}
            style={tableStyles.data}
            textStyle={tableStyles.dataText}
          />
        ) : (
          <></>
        )}
      </TableWrapper>
    </Table>
  );
};

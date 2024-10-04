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

interface CameraProcessInfo {
  fps?: number;
  fps_skipped?: number;
  cpu?: number;
  mem?: number;
}

export interface CameraInfo {
  ffmpeg: CameraProcessInfo;
  capture: CameraProcessInfo;
  detect: CameraProcessInfo;
}

interface ICameraTableProps {
  cameraInfo: CameraInfo;
}

export const CameraTable: FC<ICameraTableProps> = ({cameraInfo}) => {
  const intl = useIntl();
  const tableStyles = useTableStyles();

  const dataHeaders = useMemo(
    () => [
      intl.formatMessage(messages['cameraInfo.process.ffmpeg']),
      intl.formatMessage(messages['cameraInfo.process.capture']),
      intl.formatMessage(messages['cameraInfo.process.detect']),
    ],
    [intl],
  );

  const fpsData = useMemo(
    () => [
      `${cameraInfo.ffmpeg.fps}`,
      `${cameraInfo.capture.fps}`,
      `${cameraInfo.detect.fps} /${cameraInfo.detect.fps_skipped}`,
    ],
    [cameraInfo],
  );

  const isCpuUsageInfo = useMemo(
    () => Object.values(cameraInfo).some(process => process.cpu),
    [cameraInfo],
  );

  const cpuData = useMemo(() => {
    if (isCpuUsageInfo) {
      const processCpuData = (process: {cpu?: number; mem?: number}) => [
        process.cpu ? `${process.cpu.toFixed(1)}%` : '-',
        process.mem ? `${process.mem.toFixed(1)}%` : '-',
      ];
      return [
        processCpuData(cameraInfo.ffmpeg),
        processCpuData(cameraInfo.capture),
        processCpuData(cameraInfo.detect),
      ];
    } else {
      return undefined;
    }
  }, [cameraInfo, isCpuUsageInfo]);

  return (
    <Table borderStyle={{borderWidth: 1}}>
      <TableWrapper style={tableStyles.row}>
        <Cell
          data={intl.formatMessage(messages['cameraInfo.process.header'])}
          style={tableStyles.mainHeader}
          textStyle={tableStyles.mainHeaderText}
        />
        <Cell
          data={intl.formatMessage(messages['cameraInfo.fps.header'])}
          style={tableStyles.header}
          textStyle={tableStyles.headerText}
        />
        {isCpuUsageInfo ? (
          <Cell
            data={intl.formatMessage(messages['cameraInfo.cpu_usage.header'])}
            style={tableStyles.header}
            textStyle={tableStyles.headerText}
          />
        ) : (
          <></>
        )}
        {isCpuUsageInfo ? (
          <Cell
            data={intl.formatMessage(messages['cameraInfo.mem_usage.header'])}
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
          data={fpsData}
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

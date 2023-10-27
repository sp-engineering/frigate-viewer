import { FC, useMemo } from 'react';
import { Cell, Col, Rows, Table, TableWrapper } from 'react-native-reanimated-table';
import { useIntl } from 'react-intl';
import { messages } from './messages';
import { tableStyles } from '../../helpers/table';

export interface GpuRow {
  name: string;
  gpu: number;
  mem: number;
}

interface IGpusTableProps {
  gpus: GpuRow[];
}

export const GpusTable: FC<IGpusTableProps> = ({gpus}) => {
  const intl = useIntl();

  const dataHeaders = useMemo(
    () => gpus.map(detector => detector.name),
    [gpus],
  );

  const data = useMemo(
    () => gpus.map(detector => [
      detector.gpu ? `${detector.gpu.toFixed(1)}%` : '-',
      detector.mem ? `${detector.mem.toFixed(1)}%` : '-',
    ]),
    [gpus],
  );

  return (
    <Table borderStyle={{borderWidth: 1}}>
      <TableWrapper style={tableStyles.row}>
        <Cell data={intl.formatMessage(messages['gpus.name.header'])} style={tableStyles.mainHeader} textStyle={tableStyles.mainHeaderText} />
        <Cell data={intl.formatMessage(messages['gpus.gpu_usage.header'])} style={tableStyles.header} textStyle={tableStyles.headerText} />
        <Cell data={intl.formatMessage(messages['gpus.memory.header'])} style={tableStyles.header} textStyle={tableStyles.headerText} />
      </TableWrapper>
      <TableWrapper style={tableStyles.row}>
        <Col data={dataHeaders} style={tableStyles.dataHeader} textStyle={tableStyles.dataHeaderText} />
        <Rows data={data} flexArr={[1, 1]} style={tableStyles.data} textStyle={tableStyles.dataText} />
      </TableWrapper>
    </Table>
  );
};

import { FC, useMemo } from 'react';
import { StorageInfo, StorageShortPlace } from '../../helpers/interfaces';
import { Cell, Col, Rows, Table, TableWrapper } from 'react-native-reanimated-table';
import { useIntl } from 'react-intl';
import { messages } from './messages';
import { formatSize, tableStyles } from '../../helpers/table';

interface IStorageTableProps {
  storage: Record<StorageShortPlace, StorageInfo>;
}

export const StorageTable: FC<IStorageTableProps> = ({storage}) => {
  const intl = useIntl();

  const dataHeaders = useMemo(() => [
    intl.formatMessage(messages['location.recordings']),
    intl.formatMessage(messages['location.cache']),
    intl.formatMessage(messages['location.shm']),
  ], []);

  const data = useMemo(() => storage !== undefined ? [
    [formatSize(storage.recordings.used), formatSize(storage.recordings.total)],
    [formatSize(storage.cache.used), formatSize(storage.cache.total)],
    [formatSize(storage.shm.used), formatSize(storage.shm.total)],
  ] : [], [storage]);

  return (
    <Table borderStyle={{borderWidth: 1}}>
      <TableWrapper style={tableStyles.row}>
        <Cell data={intl.formatMessage(messages['location.header'])} style={tableStyles.mainHeader} textStyle={tableStyles.mainHeaderText} />
        <Cell data={intl.formatMessage(messages['used.header'])} style={tableStyles.header} textStyle={tableStyles.headerText} />
        <Cell data={intl.formatMessage(messages['total.header'])} style={tableStyles.header} textStyle={tableStyles.headerText} />
      </TableWrapper>
      <TableWrapper style={tableStyles.row}>
        <Col data={dataHeaders} style={tableStyles.dataHeader} textStyle={tableStyles.dataHeaderText} />
        <Rows data={data} flexArr={[1, 1]} style={tableStyles.data} textStyle={tableStyles.dataText} />
      </TableWrapper>
    </Table>
  );
};

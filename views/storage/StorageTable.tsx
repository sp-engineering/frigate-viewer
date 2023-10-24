import { FC, useMemo } from 'react';
import { StorageInfo, StorageShortPlace } from '../../helpers/interfaces';
import { Cell, Col, Row, Rows, Table, TableWrapper } from 'react-native-table-component';
import { StyleSheet } from 'react-native';
import { useIntl } from 'react-intl';
import { messages } from './messages';

const styles = StyleSheet.create({
  mainHeader: {
    flex: 2,
    backgroundColor: '#ddd',
  },
  mainHeaderText: {
    padding: 2,
    color: 'black',
    fontWeight: '600',
  },
  header: {
    flex: 1,
    backgroundColor: '#ddd',
  },
  headerText: {
    padding: 2,
    color: 'black',
    textAlign: 'center',
    fontWeight: '600',
  },
  row: {
    flexDirection: 'row',
  },
  dataHeader: {
    backgroundColor: '#eee',
    flex: 2,
  },
  dataHeaderText: {
    padding: 2,
    color: 'black',
  },
  data: {
    backgroundColor: 'white',
  },
  dataText: {
    padding: 2,
    color: 'black',
    textAlign: 'right',
  },
});

const formatSize = (mb: number) => `${(mb / 1024).toFixed(2)} GB`;

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
      <TableWrapper style={styles.row}>
        <Cell data={intl.formatMessage(messages['location.header'])} style={styles.mainHeader} textStyle={styles.mainHeaderText} />
        <Cell data={intl.formatMessage(messages['used.header'])} style={styles.header} textStyle={styles.headerText} />
        <Cell data={intl.formatMessage(messages['total.header'])} style={styles.header} textStyle={styles.headerText} />
      </TableWrapper>
      <TableWrapper style={styles.row}>
        <Col data={dataHeaders} style={styles.dataHeader} textStyle={styles.dataHeaderText} />
        <Rows data={data} flexArr={[1, 1]} style={styles.data} textStyle={styles.dataText} />
      </TableWrapper>
    </Table>
  );
};

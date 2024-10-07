import {FC, useMemo} from 'react';
import {CamerasStorage} from '../../helpers/interfaces';
import {
  Cell,
  Col,
  Rows,
  Table,
  TableWrapper,
} from 'react-native-reanimated-table';
import {useIntl} from 'react-intl';
import {messages} from './messages';
import {formatBandwidth, formatSize, useTableStyles} from '../../helpers/table';

interface ICamerasStorageTableProps {
  camerasStorage: CamerasStorage;
}

export const CamerasStorageTable: FC<ICamerasStorageTableProps> = ({
  camerasStorage,
}) => {
  const intl = useIntl();
  const tableStyles = useTableStyles();

  const dataHeaders = useMemo(
    () => Object.keys(camerasStorage),
    [camerasStorage],
  );

  const data = useMemo(
    () =>
      Object.values(camerasStorage).map(cameraStorage => [
        `${(cameraStorage.usage_percent || 0).toFixed(1)}%`,
        formatSize(cameraStorage.usage),
        formatBandwidth(cameraStorage.bandwidth),
      ]),
    [camerasStorage],
  );

  return (
    <Table borderStyle={{borderWidth: 1}}>
      <TableWrapper style={tableStyles.row}>
        <Cell
          data={intl.formatMessage(messages['camera.header'])}
          style={tableStyles.mainHeader}
          textStyle={tableStyles.mainHeaderText}
        />
        <Cell
          data={intl.formatMessage(messages['used.header'])}
          style={[tableStyles.header, {flex: 2}]}
          textStyle={tableStyles.headerText}
        />
        <Cell
          data={intl.formatMessage(messages['bandwidth.header'])}
          style={tableStyles.header}
          textStyle={tableStyles.headerText}
        />
      </TableWrapper>
      <TableWrapper style={tableStyles.row}>
        <Col
          data={dataHeaders}
          style={tableStyles.dataHeader}
          textStyle={tableStyles.dataHeaderText}
        />
        <Rows
          data={data}
          flexArr={[1, 1, 1]}
          style={tableStyles.data}
          textStyle={tableStyles.dataText}
        />
      </TableWrapper>
    </Table>
  );
};

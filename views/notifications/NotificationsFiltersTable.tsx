import { FC, useMemo } from 'react';
import { Cell, Rows, Table, TableWrapper } from 'react-native-reanimated-table';
import { useIntl } from 'react-intl';
import { messages } from './messages';
import { tableStyles } from '../../helpers/table';
import { useAppSelector } from '../../store/store';
import { selectNotificationsFilters } from '../../store/settings';

export const NotificationsFiltersTable: FC = () => {
  const intl = useIntl();
  const notificationsFilters = useAppSelector(selectNotificationsFilters);

  const data = useMemo(() => notificationsFilters
    .map(filter => [
      filter.cameras.join(', '),
      filter.labels.join(', '),
      filter.zones.join(', '),
      filter.enabled ? 'Yes' : 'No',
    ]), [notificationsFilters]);

  return (
    <Table borderStyle={{borderWidth: 1}}>
      <TableWrapper style={tableStyles.row}>
        <Cell data={intl.formatMessage(messages['table.cameras.header'])} style={tableStyles.header} textStyle={tableStyles.headerText} />
        <Cell data={intl.formatMessage(messages['table.labels.header'])} style={tableStyles.header} textStyle={tableStyles.headerText} />
        <Cell data={intl.formatMessage(messages['table.zones.header'])} style={tableStyles.header} textStyle={tableStyles.headerText} />
        <Cell data={intl.formatMessage(messages['table.enabled.header'])} style={tableStyles.header} textStyle={tableStyles.headerText} />
      </TableWrapper>
      <TableWrapper style={tableStyles.row}>
        <Rows data={data} flexArr={[1, 1, 1]} style={tableStyles.data} textStyle={tableStyles.dataText} />
      </TableWrapper>
    </Table>
  );
};

import {useStyles} from '../helpers/colors';

export const useTableStyles = () =>
  useStyles(({theme}) => ({
    mainHeader: {
      flex: 2,
      backgroundColor: theme.tableColumnHeaderBg,
    },
    mainHeaderText: {
      padding: 2,
      color: theme.tableText,
      fontWeight: '600',
    },
    header: {
      flex: 1,
      backgroundColor: theme.tableColumnHeaderBg,
    },
    headerText: {
      padding: 2,
      color: theme.tableText,
      textAlign: 'center',
      fontWeight: '600',
    },
    row: {
      flexDirection: 'row',
    },
    dataHeader: {
      backgroundColor: theme.tableRowHeaderBg,
      flex: 2,
    },
    dataHeaderText: {
      padding: 2,
      color: theme.tableText,
    },
    data: {
      backgroundColor: theme.tableCellBg,
      flex: 1,
    },
    dataText: {
      padding: 2,
      color: theme.tableText,
      textAlign: 'right',
    },
  }));

export const formatSize = (mb: number) => `${(mb / 1024).toFixed(2)} GB`;
export const formatBandwidth = (mb: number) => `${(mb / 1024).toFixed(2)} GB/h`;

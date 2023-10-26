import { StyleSheet } from 'react-native';

export const tableStyles = StyleSheet.create({
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

export const formatSize = (mb: number) => `${(mb / 1024).toFixed(2)} GB`;
export const formatBandwidth = (mb: number) => `${(mb / 1024).toFixed(2)} GB/h`;

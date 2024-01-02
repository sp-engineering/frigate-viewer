import { StyleSheet } from 'react-native';
import { colors } from '../store/colors';
const colorPalette = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#C9CBCF', '#FF9F40'];
export const staticColorPalette = colorPalette;

export const tableStyles = StyleSheet.create({
  mainHeader: {
    flex: 2,
    backgroundColor: colors.background,
    color: colors.text,
  },
  mainHeaderText: {
    backgroundColor: colors.background,
    color: colors.text,
    padding: 2,
    fontWeight: '600',
  },
  header: {
    flex: 1,
    backgroundColor: colors.background,
  },
  headerText: {
    color: colors.text,
    padding: 2,
    textAlign: 'center',
    fontWeight: '600',
  },
  row: {
    backgroundColor: colors.background,
    color: colors.text,
    flexDirection: 'row',
  },
  dataHeader: {
    backgroundColor: colors.background,
    flex: 2,
  },
  dataHeaderText: {
    padding: 2,
    color: colors.text,
  },
  data: {
    backgroundColor: colors.background,
    flex: 1,
  },
  dataText: {
    backgroundColor: colors.background,
    padding: 2,
    textAlign: 'right',
  },
});

export const formatSize = (mb: number) => `${(mb / 1024).toFixed(2)} GB`;
export const formatBandwidth = (mb: number) => `${(mb / 1024).toFixed(2)} GB/h`;

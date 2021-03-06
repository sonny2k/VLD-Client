import { Font, StyleSheet } from '@react-pdf/renderer';

// ----------------------------------------------------------------------

Font.register({
  family: 'Roboto',
  fonts: [{ src: '/fonts/Roboto-Regular.ttf' }, { src: '/fonts/Roboto-Bold.ttf' }],
});

const styles = StyleSheet.create({
  col4: { width: '30%' },
  col5: { width: '45%' },
  col8: { width: '75%' },
  col6: { width: '50%' },
  col7: { width: '60%' },
  mb8: { marginBottom: 8 },
  mb40: { marginBottom: 40 },
  mt20: { marginTop: 20 },
  overline: {
    fontSize: 8,
    marginBottom: 8,
    fontWeight: 700,
    textTransform: 'uppercase',
  },
  h3: { fontSize: 16, fontWeight: 700 },
  h4: { fontSize: 13, fontWeight: 700 },
  body1: { fontSize: 10 },
  subtitle2: { fontSize: 9, fontWeight: 700 },
  subtitle3: { fontSize: 20, fontWeight: 700 },
  alignRight: { textAlign: 'right' },
  alignCenter: { textAlign: 'center' },
  page: {
    padding: '40px 24px 0 24px',
    fontSize: 10,
    lineHeight: 2,
    fontFamily: 'Roboto',
    backgroundColor: '#fff',
    textTransform: 'capitalize',
  },
  footer: {
    left: 0,
    right: 0,
    bottom: 0,
    padding: 24,
    margin: 'auto',
    borderTopWidth: 1,
    borderStyle: 'solid',
    position: 'absolute',
    borderColor: '#DFE3E8',
  },
  gridContainer: { flexDirection: 'row', justifyContent: 'space-between' },
  table: { display: 'flex', width: 'auto' },
  tableHeader: {},
  tableBody: {},
  tableRow: {
    padding: '8px 0',
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderStyle: 'solid',
    borderColor: '#DFE3E8',
  },
  noBorder: { paddingTop: 8, paddingBottom: 0, borderBottomWidth: 0 },
  tableCell_1: { width: '30%' },
  tableCell_2: { width: '15%', paddingRight: 28 },
  tableCell_3: { width: '20%' },
  tableCell_4: { width: '15%' },
});

export default styles;

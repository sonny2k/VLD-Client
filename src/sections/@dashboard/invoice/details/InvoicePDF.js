import PropTypes from 'prop-types';
import { Page, View, Text, Image, Document } from '@react-pdf/renderer';
import { format } from 'date-fns';
// @mui
import { Avatar, Divider } from '@mui/material';
// utils
import { fCurrency } from '../../../../utils/formatNumber';
import { fDateToa } from '../../../../utils/formatTime';
//
import styles from './InvoiceStyle';

// ----------------------------------------------------------------------

InvoicePDF.propTypes = {
  pre: PropTypes.object.isRequired,
};

export default function InvoicePDF({ pre }) {
  const { fname, lname } = pre.docinfo.doctor.account;

  const { department, signature } = pre.docinfo.doctor;

  const { gender } = pre.userinfo.user.account;

  const { weight, height, pastmedicalhistory } = pre.userinfo.user;

  const namedoc = `${lname} ${fname}`;

  const { name } = pre.userinfo;

  const { quantity,everate,morningrate,noonrate } = pre.prescription.medicines[0];

  const { title, image, specdes, unit } = pre.prescription.medicines[0].product;

  const { medicines } = pre.prescription;

  const { date, status, symptom } = pre.consultation.consultation;

  const { diagnosis, pname, note } = pre.consultation;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={[styles.gridContainer, styles.mb40]}>
          <Image source="/logo/logo_full.png" style={{ height: 32 }} />
          <View style={styles.col7}>
            <Text style={styles.subtitle3}> Đơn Thuốc </Text>
          </View>
        </View>

        <View style={[styles.gridContainer, styles.mb40]}>
          <View style={styles.col6}>
            <Text style={[styles.overline, styles.mb8]}>Thông tin cơ bản</Text>
            <Text style={styles.body1}>Triệu chứng: {symptom}</Text>
            <Text style={styles.body1}>Tiền sử bệnh: {pastmedicalhistory}</Text>
            <Text style={styles.body1}>Chẩn đoán:{diagnosis}...</Text>
          </View>

          <View style={styles.col5}>
            <Text style={[styles.overline, styles.mb8]}>Thông tin bệnh nhân</Text>
            <Text style={styles.body1}>Tên: {name}</Text>
            <Text style={styles.body1}>Giới tính: {gender === 1 && 'Nam' || gender === 2 && 'Nữ' || gender === 3 && 'Không xác định' || gender === null && 'Không xác định'}.</Text>
            <Text style={styles.body1}>Cân nặng: {weight} kg</Text>
            <Text style={styles.body1}>Chiều cao: {height}cm</Text>
          </View>

        </View>

        <Text style={[styles.overline, styles.mb8]}>Chi tiết toa thuốc</Text>

        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <View style={styles.tableRow}>
              <View style={styles.tableCell_1}>
                <Text style={styles.subtitle2}>Tên thuốc</Text>
              </View>

              <View style={styles.tableCell_2}>
                <Text style={styles.subtitle2}>Số lượng</Text>
              </View>

              <View style={styles.tableCell_2}>
                <Text style={styles.subtitle2}>Đơn vị tính</Text>
              </View>

              <View style={styles.tableCell_3}>
                <Text style={styles.subtitle2}>Liều lượng </Text>
              </View>

            </View>
          </View>

          <View style={styles.tableBody}>
          {medicines.map((pro,index) => (
              <View style={styles.tableRow} key={index}>
                <View style={styles.tableCell_1}>
                  <Text>{pro.product.title}</Text>
                </View>

                <View style={styles.tableCell_4}>
                  <Text >{pro.quantity}</Text>
                </View>

                <View style={[styles.tableCell_2]}>
                  <Text style={[styles.alignCenter]}>
                    {unit}
                  </Text>
                </View>

                <View style={styles.tableCell_1}>
                  <Text>
                    {pro.rate}...
                  </Text>
                </View>

              </View>
            ))}

            </View>
          </View>
        
        <View style={[styles.gridContainer, styles.mt20]}>
          <View style={styles.col8}>
            <Text style={styles.subtitle2}>Lời dặn</Text>
            <Text>{note}...</Text>
          </View>
          <View style={[styles.col4, styles.alignCenter]}>
            <View style={styles.col8}>
              <Text style={styles.subtitle2}>ngày {(fDateToa(date))} năm 2022</Text>
              <Text style={styles.subtitle2}>Bác sĩ điều trị</Text>
              <Image alt="signature" src={signature}/>  
              <Text style={styles.subtitle2}>{namedoc}.</Text>    
            </View>      
          </View>
        </View>
      </Page>
    </Document>
  );
}

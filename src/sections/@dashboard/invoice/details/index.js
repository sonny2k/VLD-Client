import PropTypes from 'prop-types';
// @mui
import { styled, useTheme } from '@mui/material/styles';
import {
  Box,
  Card,
  Grid,
  Table,
  Divider,
  TableRow,
  TableBody,
  TableHead,
  TableCell,
  Typography,
  TableContainer,
} from '@mui/material';
// utils
import { fDate } from '../../../../utils/formatTime';
import { fCurrency } from '../../../../utils/formatNumber';
// components
import Label from '../../../../components/Label';
import Image from '../../../../components/Image';
import Scrollbar from '../../../../components/Scrollbar';
//
import InvoiceToolbar from './InvoiceToolbar';

// ----------------------------------------------------------------------

const RowResultStyle = styled(TableRow)(({ theme }) => ({
  '& td': {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
  },
}));

// ----------------------------------------------------------------------

InvoiceDetails.propTypes = {
  invoice: PropTypes.object.isRequired,
};

export default function InvoiceDetails({ invoice }) {
  const theme = useTheme();

  if (!invoice) {
    return null;
  }

  const {
    items,
    status,
    department,
    symptom,
    invoiceTo,
    createDate,
    invoiceFrom,
    invoiceNumber,
    signature,
  } = invoice;

  return (
    <>
      <InvoiceToolbar invoice={invoice} />

      <Card sx={{ pt: 5, px: 5 }}>
        <Grid container>
          <Grid item xs={12} sm={6} sx={{ mb: 6 }}>
            <Image disabledEffect visibleByDefault alt="logo" src="/logo/logo_full.svg" sx={{ maxWidth: 120 }} />
          </Grid>

          <Grid item xs={12} sm={6} sx={{ mb: 5 }}>
            <Box sx={{ textAlign: { sm: 'right' } }}>
              <Label
                variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
                color={
                  (status === 'Đã hoàn thành' && 'success') ||
                  (status === 'unpaid' && 'warning') ||
                  (status === 'overdue' && 'error') ||
                  'default'
                }
                sx={{ textTransform: 'uppercase', mb: 1 }}
              >
                {status}
              </Label>

              <Typography variant="h6">{invoiceNumber}</Typography>
            </Box>
          </Grid>
          <Grid item xs={4} sm={4} sx={{ mb: 4 }}>
            <Typography paragraph variant="overline" sx={{ color: 'text.disabled' }}>
              Thông tin cơ bản
            </Typography>
            <Typography variant="body2">Triệu chứng: </Typography>
            <Typography variant="body2">Tiền sử bệnh:</Typography>
            <Typography variant="body2">Chẩn đoán:</Typography>
          </Grid>

          <Grid item xs={4} sm={4} sx={{ mb: 4 }}>
            <Typography paragraph variant="overline" sx={{ color: 'text.disabled' }}>
              Thông tin bệnh nhân
            </Typography>
            <Typography variant="body2">{invoiceTo.name}</Typography>
            <Typography variant="body2">Giới tính: </Typography>
            <Typography variant="body2">Chiều cao: </Typography>
            <Typography variant="body2">Cân nặng: </Typography>
          </Grid>

          <Grid item xs={4} sm={4} sx={{ mb: 4 }}>
            <Typography paragraph variant="overline" sx={{ color: 'text.disabled' }}>
              Thông tin bác sĩ  
            </Typography>
            <Typography variant="body2">{invoiceFrom.name}</Typography>
            <Typography variant="body2">Chuyên khoa: Tim mạch</Typography>
            <Typography variant="body2">Ngày tạo: {fDate(createDate)}</Typography>
          </Grid>

        </Grid>

        <Scrollbar>
          <TableContainer sx={{ minWidth: 960 }}>
            <Table>
              <TableHead
                sx={{
                  borderBottom: (theme) => `solid 1px ${theme.palette.divider}`,
                  '& th': { backgroundColor: 'transparent' },
                }}
              >
                <TableRow>
                  <TableCell width={40}>#</TableCell>
                  <TableCell align="left">Sản phẩm</TableCell>
                  <TableCell align="left">Số lượng</TableCell>
                  <TableCell align="left">Liều lượng ngày</TableCell>
                  <TableCell align="left">Liều lượng buổi</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {items.map((row, index) => (
                  <TableRow
                    key={index}
                    sx={{
                      borderBottom: (theme) => `solid 1px ${theme.palette.divider}`,
                    }}
                  >
                    <TableCell>{index + 1}</TableCell>
                    <TableCell align="left">
                      <Box sx={{ maxWidth: 560 }}>
                        <Typography variant="subtitle2">{row.title}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell align="left">{row.quantity}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <Grid container>
          <Grid item xs={12} md={9} sx={{ py: 3 }}>
            <Typography variant="subtitle2">Ghi chú</Typography>
            <Typography variant="body2">
              Tránh làm việc nặng, kích động, xem phim kinh dị
            </Typography>
          </Grid>
          <Grid item xs={12} md={3} sx={{ py: 3, textAlign: 'right' }}>
          <Typography variant="subtitle2">Chữ kí bác sĩ</Typography>
          <Image alt="signature" src="https://i.ibb.co/Yp3kFbY/signature.png"/>            
          </Grid>
        </Grid>
      </Card>
    </>
  );
}

import PropTypes from 'prop-types';
import { format } from 'date-fns';
// @mui
import { styled, useTheme } from '@mui/material/styles';
import { capitalize } from '@material-ui/core';
import {
  Avatar,
  Stack,
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
import { fDateToa } from '../../../../utils/formatTime';
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
  pre: PropTypes.object.isRequired,
};

export default function InvoiceDetails({ pre }) {
  const theme = useTheme();

  if (!pre) {
    return null;
  }

  const { fname, lname } = pre.docinfo.doctor.account;

  const { department, signature } = pre.docinfo.doctor;

  const { gender } = pre.userinfo.user.account;

  const { weight, height, pastmedicalhistory } = pre.userinfo.user;

  const namedoc = `${lname} ${fname}`;

  const { name } = pre.userinfo;

  const { title, image, specdes, unit } = pre.prescription.medicines[0].product;

  const { medicines } = pre.prescription;

  const { date, status, symptom } = pre.consultation.consultation;

  const { diagnosis, pname, note } = pre.consultation;

  return (
    <>
      <InvoiceToolbar pre={pre} />
      <Card sx={{ pt: 5, px: 5 }}>
        <Grid container>
          <Grid item xs={12} sm={6} sx={{ mb: 6 }}>
            <Image disabledEffect visibleByDefault alt="logo" src="/logo/logo_full.png" sx={{ maxWidth: 250 }} />
          </Grid>

          <Grid item xs={12} sm={6} sx={{ mb: 5 }}>
            <Box sx={{ textAlign: { sm: 'right' } }}>
              <Label
                variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
                color={
                  (status === '??a?? hoa??n tha??nh' && 'success') ||
                  (status === 'unpaid' && 'warning') ||
                  (status === 'overdue' && 'error') ||
                  'default'
                }
                sx={{ textTransform: 'uppercase', color: 'Green', mb: 1 }}
              >
                {status}
              </Label>

              <Typography variant="h6">{pname}</Typography>
            </Box>
          </Grid>
          <Grid item xs={4} sm={4} sx={{ mb: 4 }}>
            <Typography paragraph variant="overline" sx={{ color: 'text.disabled' }}>
              Th??ng tin c?? ba??n
            </Typography>
            <Typography variant="body2">Tri????u ch????ng: {symptom}</Typography>
            <Typography variant="body2">Ti????n s???? b????nh: {pastmedicalhistory}</Typography>
            <Typography variant="body2">Ch????n ??oa??n: {diagnosis}</Typography>
          </Grid>

          <Grid item xs={4} sm={4} sx={{ mb: 4 }}>
            <Typography paragraph variant="overline" sx={{ color: 'text.disabled' }}>
              Th??ng tin b????nh nh??n
            </Typography>
            <Typography variant="body2">T??n: {name}</Typography>
            <Typography variant="body2">
              Gi????i ti??nh:{' '}
              {(gender === 1 && 'Nam') ||
                (gender === 2 && 'N???') ||
                (gender === 3 && 'Kh??ng x??c ?????nh') ||
                (gender === null && 'Kh??ng x??c ?????nh')}{' '}
            </Typography>
            <Typography variant="body2">C??n n????ng: {weight} kg </Typography>
            <Typography variant="body2">Chi????u cao: {height}cm </Typography>
          </Grid>

          <Grid item xs={4} sm={4} sx={{ mb: 4 }}>
            <Typography paragraph variant="overline" sx={{ color: 'text.disabled' }}>
              Th??ng tin ba??c si??
            </Typography>
            <Typography variant="body2">T??n: {namedoc}</Typography>
            <Typography variant="body2">Chuy??n khoa: {department}</Typography>
            <Typography variant="body2">????n vi??: VLang Doctor</Typography>
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
                  <TableCell align="left">T??n thu???c</TableCell>
                  <TableCell align="center">S???? l??????ng</TableCell>
                  <TableCell align="center">????n vi?? ti??nh</TableCell>
                  {/* <TableCell align="left">Quy ca??ch</TableCell> */}
                  <TableCell align="left">Li????u l??????ng</TableCell>
                </TableRow>
              </TableHead>
              {medicines.map((pro, index) => (
                <TableBody>
                  <TableRow
                    key={pro._id}
                    sx={{
                      borderBottom: (theme) => `solid 1px ${theme.palette.divider}`,
                    }}
                  >
                    {/* <TableCell>{option + 1}</TableCell> */}
                    <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
                      <Avatar alt={title} src={pro.product.image} sx={{ mr: 2 }} />
                      <Typography variant="subtitle2" noWrap>
                        {pro.product.title}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">{pro.quantity}</TableCell>
                    <TableCell align="center">{unit}</TableCell>
                    <TableCell align="left">{pro.rate}</TableCell>
                  </TableRow>
                </TableBody>
              ))}
            </Table>
          </TableContainer>
        </Scrollbar>

        <Grid container >
          <Grid item xs={12} md={9} sx={{ py: 3 }}>
            <Typography variant="subtitle2">L????i d????n</Typography>
            <Typography variant="body2">{note}</Typography>
          </Grid>
          <Grid  item xs={12} md={3} sx={{ py: 3, textAlign: 'center' }}>
            <Typography sx={{ textTransform: 'capitalize' }} >ng??y {(fDateToa(date))} n??m 2022</Typography>
            <Typography variant="body2">Ba??c si?? ??i????u tri??</Typography>
            <Image alt="signature" src={signature} />
            <Typography variant="body2">{namedoc}</Typography>
          </Grid>
        </Grid>
      </Card>
    </>
  );
}

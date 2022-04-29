import PropTypes from 'prop-types';
import { useNavigate, useLocation } from 'react-router-dom';
import { PDFDownloadLink, PDFViewer } from '@react-pdf/renderer';
import unorm from 'unorm';
// @mui
import { Box, Stack, Button, Dialog, Tooltip, IconButton, DialogActions, CircularProgress } from '@mui/material';
// hooks
import useAuth from '../../../../hooks/useAuth';
import useToggle from '../../../../hooks/useToggle';
// routes
import { PATH_DASHBOARD } from '../../../../routes/paths';
// components
import Iconify from '../../../../components/Iconify';
//
import InvoicePDF from './InvoicePDF';

// ----------------------------------------------------------------------

InvoiceToolbar.propTypes = {
  pre : PropTypes.object.isRequired,
};

export default function InvoiceToolbar({ pre }) {
  
  const { account } = useAuth();

  const navigate = useNavigate();

  const { _id } = pre.consultation.consultation;

  const { fname, lname } = pre.docinfo.doctor.account;

  const { gender } = pre.userinfo.user.account;

  const { weight, height, pastmedicalhistory } = pre.userinfo.user;

  const namedoc = `${lname} ${fname}`;

  const { name } = pre.userinfo;

  const { date, status, symptom, hour } = pre.consultation.consultation;

  const { diagnosis, pname, note } = pre.consultation;

  const { toggle: open, onOpen, onClose } = useToggle();

  const handleEdit = () => {
    navigate(PATH_DASHBOARD.prescription.edit(pre.prescription.id), {state: { id: _id, name1: name , gender1: gender, weight1: weight, height1: height, symptom1: symptom, pastmedicalhistory1: pastmedicalhistory, date1: date, hour1: hour, pname1: pname, diagnosis1: diagnosis, note1: note,  } });
  };

  return (
    <>
      <Stack
        spacing={2}
        direction={{ xs: 'column', sm: 'row' }}
        justifyContent="space-between"
        alignItems={{ sm: 'center' }}
        sx={{ mb: 5 }}
      >
       <Stack direction="row" spacing={1}>

       {unorm.nfd(account.role).toLowerCase().indexOf(unorm.nfd('Bác sĩ').toLowerCase()) !== -1 && <Tooltip title="Cập nhật toa">
            <IconButton onClick={handleEdit}>
              <Iconify icon={'eva:edit-fill'} />
            </IconButton>
          </Tooltip>}

          <Tooltip title="Xem chi tiết">
            <IconButton onClick={onOpen}>
              <Iconify icon={'eva:eye-fill'} />
            </IconButton>
          </Tooltip>

          <PDFDownloadLink
            document={<InvoicePDF pre={pre} />}
            fileName={pre.pname}
            style={{ textDecoration: 'none' }}
          >
            {({ loading }) => (
              <Tooltip title="Tải về">
                <IconButton>
                  {loading ? <CircularProgress size={24} color="inherit" /> : <Iconify icon={'eva:download-fill'} />}
                </IconButton>
              </Tooltip>
            )}
          </PDFDownloadLink>

          {/* <Tooltip title="In">
            <IconButton onClick={() => window.print()}>
            <Iconify icon={'eva:printer-fill'} />
            </IconButton>
          </Tooltip> */}

          {/* <Tooltip title="Send">
            <IconButton>
              <Iconify icon={'ic:round-send'} />
            </IconButton>
          </Tooltip> */}

          {/* <Tooltip title="Share">
            <IconButton>
              <Iconify icon={'eva:share-fill'} />
            </IconButton>
          </Tooltip> */}
        </Stack>
      </Stack>

      <Dialog fullScreen open={open}>
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
          <DialogActions
            sx={{
              zIndex: 9,
              padding: '12px !important',
              boxShadow: (theme) => theme.customShadows.z8,
            }}
          >
            <Tooltip title="Close">
              <IconButton color="inherit" onClick={onClose}>
                <Iconify icon={'eva:close-fill'} />
              </IconButton>
            </Tooltip>
          </DialogActions>
          <Box sx={{ flexGrow: 1, height: '100%', overflow: 'hidden' }}>
            <PDFViewer width="100%" height="100%" style={{ border: 'none' }}>
              <InvoicePDF pre={pre} />
            </PDFViewer>
          </Box>
        </Box>
      </Dialog>
    </>
  );
}

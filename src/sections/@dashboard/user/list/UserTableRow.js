import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useState } from 'react';
import { paramCase } from 'change-case';
import { format } from 'date-fns';
import { Link as RouterLink } from 'react-router-dom';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { useTheme } from '@mui/material/styles';
import {
  Avatar,
  Checkbox,
  TableRow,
  TableCell,
  Typography,
  MenuItem,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  Link,
  TextField,
} from '@mui/material';
// hooks
import useAuth from '../../../../hooks/useAuth';
// components
import Label from '../../../../components/Label';
import Iconify from '../../../../components/Iconify';
import { TableMoreMenu } from '../../../../components/table';
import { FormProvider, RHFTextField } from '../../../../components/hook-form';
// routes
import { PATH_DASHBOARD } from '../../../../routes/paths';

// ----------------------------------------------------------------------

UserTableRow.propTypes = {
  row: PropTypes.object,
  selected: PropTypes.bool,
  onEditRow: PropTypes.func,
  onSelectRow: PropTypes.func,
  onDeleteRow: PropTypes.func,
  onCancel: PropTypes.func,
  onViewPrescription: PropTypes.func,
};

export default function UserTableRow({
  row,
  selected,
  onEditRow,
  onSelectRow,
  onDeleteRow,
  onCancel,
  onViewPrescription,
}) {
  const theme = useTheme();

  const { fname, profilepic, lname } = row.doctor.account;

  const { department } = row.doctor;

  const { date, hour, status, _id, roomname } = row;

  const { account } = useAuth();

  const identity = `${account.lname} ${account.fname}`;

  let noRoomName = false;

  if (!roomname) {
    noRoomName = true;
  }

  const ExcuseSchema = Yup.object().shape({
    excuse: Yup.string().required('Vui lòng nhập lý do từ chối buổi hẹn'),
  });

  const linkTo =
    status === 'đã hoàn thành'
      ? `${PATH_DASHBOARD.prescription.root}/${paramCase(_id)}`
      : `${PATH_DASHBOARD.user.root}/detail/${paramCase(_id)}`;

  const name = `${lname} ${fname}`;

  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const [openMenu, setOpenMenuActions] = useState(null);

  const handleOpenMenu = (event) => {
    setOpenMenuActions(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpenMenuActions(null);
  };

  const cancelAndClose = (data) => {
    onCancel(data.excuse);
    handleClose();
  };

  const methods = useForm({
    resolver: yupResolver(ExcuseSchema),
  });

  const {
    reset,
    watch,
    control,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const handleCreateNameAndRoomName = () => {
    // navigate(PATH_DASHBOARD.video, {
    //   state: {
    //     username1: identity,
    //     roomname1: roomname,
    //     date1: date,
    //     hour1: hour,
    //     id1: _id,
    //   },
    // });
    window.open(`https://vldchatroom.herokuapp.com/room/${_id}/${identity}`);
  };

  return (
    <TableRow hover selected={selected}>
      {status === 'bị từ chối' && (
        <TableCell padding="checkbox">
          <Checkbox checked={selected} onClick={onSelectRow} />
        </TableCell>
      )}

      {status === 'đã hủy' && (
        <TableCell padding="checkbox">
          <Checkbox checked={selected} onClick={onSelectRow} />
        </TableCell>
      )}

      {status === 'chờ xác nhận' && <TableCell />}

      {status === 'chờ khám' && <TableCell />}

      {status === 'đã hoàn thành' && <TableCell />}

      <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
        <Avatar alt={name} src={profilepic} sx={{ mr: 2 }} />
        <Link to={linkTo} color="inherit" component={RouterLink}>
          <Typography variant="subtitle2" noWrap>
            {name}
          </Typography>
        </Link>
      </TableCell>

      <TableCell align="left">{format(new Date(date), 'dd/MM/yyyy')}</TableCell>

      <TableCell align="left" sx={{ textTransform: 'capitalize' }}>
        {hour}
      </TableCell>

      <TableCell align="center" sx={{ textTransform: 'capitalize' }}>
        {department}
      </TableCell>

      {/* <TableCell align="center">
        <Iconify
          icon={roomname ? 'eva:checkmark-circle-fill' : 'eva:clock-outline'}
          sx={{
            width: 20,
            height: 20,
            color: 'success.main',
            ...(!roomname && { color: 'warning.main' }),
          }}
        />
      </TableCell> */}

      <TableCell align="center">
        <Label
          variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
          color={
            (status === 'chờ xác nhận' && 'warning') ||
            (status === 'chờ khám' && 'info') ||
            (status === 'bị từ chối' && 'error') ||
            (status === 'đã hủy' && 'error') ||
            (status === 'đã hoàn thành' && 'success')
          }
          sx={{ textTransform: 'capitalize' }}
        >
          {status}
        </Label>
      </TableCell>

      <TableCell align="right">
        <TableMoreMenu
          open={openMenu}
          onOpen={handleOpenMenu}
          onClose={handleCloseMenu}
          actions={
            <>
              {status === 'đã hoàn thành' ? (
                <MenuItem
                  onClick={() => {
                    onViewPrescription();
                    handleCloseMenu();
                  }}
                >
                  <Iconify icon={'openmoji:details'} />
                  Xem chi tiết
                </MenuItem>
              ) : (
                <MenuItem
                  onClick={() => {
                    onEditRow();
                    handleCloseMenu();
                  }}
                >
                  <Iconify icon={'openmoji:details'} />
                  Xem chi tiết
                </MenuItem>
              )}
              {status === 'chờ khám' && noRoomName === false && (
                <MenuItem
                  onClick={() => {
                    handleCreateNameAndRoomName();
                  }}
                  sx={{ color: 'info.main' }}
                >
                  <Iconify icon={'healthicons:group-discussion-meeting'} />
                  Tham gia buổi tư vấn
                </MenuItem>
              )}
              {status === 'chờ khám' && (
                <MenuItem
                  onClick={() => {
                    handleClickOpen();
                    handleCloseMenu();
                  }}
                  sx={{ color: 'error.main' }}
                >
                  <Iconify icon={'eva:trash-2-outline'} />
                  Hủy lịch hẹn
                </MenuItem>
              )}
              {status === 'chờ xác nhận' && (
                <MenuItem
                  onClick={() => {
                    handleClickOpen();
                    handleCloseMenu();
                  }}
                  sx={{ color: 'error.main' }}
                >
                  <Iconify icon={'eva:trash-2-outline'} />
                  Hủy lịch hẹn
                </MenuItem>
              )}
            </>
          }
        />
        <FormProvider methods={methods}>
          <Dialog open={open} onClose={handleClose}>
            <DialogTitle sx={{ m: 1, p: 2 }}>{'Bạn muốn hủy lịch hẹn?'}</DialogTitle>
            <DialogContent>
              <DialogContentText>Buổi hẹn sẽ bị hủy sau khi nhấp đồng ý, bạn có muốn tiếp tục?</DialogContentText>
              <RHFTextField autoFocus name="excuse" label="Lý do hủy" fullWidth variant="standard" />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>Trở về</Button>
              <Button variant="contained" onClick={handleSubmit(cancelAndClose)} autoFocus>
                Đồng ý
              </Button>
            </DialogActions>
          </Dialog>
        </FormProvider>
      </TableCell>
    </TableRow>
  );
}

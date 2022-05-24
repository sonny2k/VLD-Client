import PropTypes from 'prop-types';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { useSnackbar } from 'notistack';
// @mui
import { useTheme } from '@mui/material/styles';
import { Avatar, Checkbox, TableRow, TableCell, Typography, MenuItem, Link } from '@mui/material';
// utils
import axios from '../../../../utils/axios';
// components
import Label from '../../../../components/Label';
import Iconify from '../../../../components/Iconify';
import { TableMoreMenu } from '../../../../components/table';
// routes
import { PATH_DASHBOARD } from '../../../../routes/paths';

// ----------------------------------------------------------------------

DocTableRow.propTypes = {
  row: PropTypes.object,
  selected: PropTypes.bool,
  onEditRow: PropTypes.func,
  onSelectRow: PropTypes.func,
  onDeleteRow: PropTypes.func,
};

export default function DocTableRow({ row, selected, onEditRow, onSelectRow, onDeleteRow }) {
  const theme = useTheme();

  const { department, status } = row;

  const { gender, fname, lname, profilepic, phone } = row.account;
  const { street, ward, district, city } = row.account.address;

  const name = `${lname} ${fname}`;

  const address = `${street}, ${ward}, ${district}, ${city}`;

  const navigate = useNavigate();

  const { enqueueSnackbar } = useSnackbar();

  const [openMenu, setOpenMenuActions] = useState(null);

  const handleOpenMenu = (event) => {
    setOpenMenuActions(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpenMenuActions(null);
  };

  const Public = async () => {
    try {
      await axios.post(`/api/admin/doctor/publicDoctor`, {
        id: row._id,
      });
      enqueueSnackbar('Kích hoạt bác sĩ thành công thành công!');
      navigate(PATH_DASHBOARD.user.doclist);
    } catch (error) {
      console.error(error);
      enqueueSnackbar('Có lỗi xảy ra, vui lòng thử lại!');
    }
  };

  const Hide = async () => {
    try {
      await axios.post(`/api/admin/doctor/hideDoctor`, {
        id: row._id,
      });
      enqueueSnackbar('Vô hiệu hóa bác sĩ thành công!');
      navigate(PATH_DASHBOARD.user.doclist);
    } catch (error) {
      console.error(error);
      enqueueSnackbar('Có lỗi xảy ra, vui lòng thử lại!');
    }
  };

  return (
    <TableRow hover selected={selected}>
      <TableCell padding="checkbox">
        <Checkbox checked={selected} onClick={onSelectRow} />
      </TableCell>

      <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
        <Avatar alt={name} src={profilepic} sx={{ mr: 2 }} />
        <Link
          onClick={() => {
            onEditRow(name);
          }}
          color="inherit"
        >
          <Typography variant="subtitle2" noWrap>
            {name}
          </Typography>
        </Link>
      </TableCell>

      <TableCell align="center" sx={{ textTransform: 'capitalize' }}>
        0{phone.slice(3)}
      </TableCell>

      <TableCell align="center" sx={{ textTransform: 'capitalize' }}>
        {department}
      </TableCell>

      <TableCell align="center">
        <Label
          variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
          color={(status === 0 && 'warning') || (status === 1 && 'success')}
          sx={{ textTransform: 'capitalize' }}
        >
          {status === 0 ? 'Vô hiệu hóa' : 'Kích hoạt'}
        </Label>
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

      {/* <TableCell align="center">
        <Label
          variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
          color={(status === "chờ xác nhận" && 'warning') || (status === "chờ khám" && 'info') || (status === 'đã hủy' && 'error') || (status === 'đã hoàn thành' && 'success')}
          sx={{ textTransform: 'capitalize' }}
        >
          {status}
        </Label>
      </TableCell> */}

      <TableCell align="right">
        <TableMoreMenu
          open={openMenu}
          onOpen={handleOpenMenu}
          onClose={handleCloseMenu}
          actions={
            <>
              {status === 0 && (
                <MenuItem
                  onClick={() => {
                    Public();
                    handleCloseMenu();
                  }}
                  sx={{ color: 'success.main' }}
                >
                  <Iconify icon={'ant-design:eye-filled'} />
                  Kích hoạt bác sĩ
                </MenuItem>
              )}

              {status === 1 && (
                <MenuItem
                  onClick={() => {
                    Hide();
                    handleCloseMenu();
                  }}
                  sx={{ color: 'warning.main' }}
                >
                  <Iconify icon={'ant-design:eye-invisible-filled'} />
                  Vô hiệu hóa bác sĩ
                </MenuItem>
              )}
              <MenuItem
                onClick={() => {
                  onEditRow(name);
                  handleCloseMenu();
                }}
              >
                <Iconify icon={'openmoji:details'} />
                Xem chi tiết
              </MenuItem>
            </>
          }
        />
      </TableCell>
    </TableRow>
  );
}

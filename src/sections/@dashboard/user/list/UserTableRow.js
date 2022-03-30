import PropTypes from 'prop-types';
import { useState } from 'react';
import { format } from 'date-fns';
// @mui
import { useTheme } from '@mui/material/styles';
import { Avatar, Checkbox, TableRow, TableCell, Typography, MenuItem } from '@mui/material';
// components
import Label from '../../../../components/Label';
import Iconify from '../../../../components/Iconify';
import { TableMoreMenu } from '../../../../components/table';

// ----------------------------------------------------------------------

UserTableRow.propTypes = {
  row: PropTypes.object,
  selected: PropTypes.bool,
  onEditRow: PropTypes.func,
  onSelectRow: PropTypes.func,
  onDeleteRow: PropTypes.func,
  onCancel: PropTypes.func,
};

export default function UserTableRow({ row, selected, onEditRow, onSelectRow, onDeleteRow, onCancel }) {
  const theme = useTheme();

  const { fname, profilepic, lname } = row.doctor.account;

  const { department } = row.doctor

  const { date, hour, status } = row;

  const name = `${lname} ${fname}`;

  const [openMenu, setOpenMenuActions] = useState(null);

  const handleOpenMenu = (event) => {
    setOpenMenuActions(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpenMenuActions(null);
  };

  return (
    <TableRow hover selected={selected}>
      <TableCell padding="checkbox">
        <Checkbox checked={selected} onClick={onSelectRow} />
      </TableCell>

      <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
        <Avatar alt={name} src={profilepic} sx={{ mr: 2 }} />
        <Typography variant="subtitle2" noWrap>
          {name}
        </Typography>
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
          color={(status === "chờ xác nhận" && 'warning') || (status === "chờ khám" && 'info') || (status === 'bị từ chối' && 'error') || (status === 'đã hoàn thành' && 'success')}
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
            {status === "chờ khám" && <MenuItem
                onClick={() => {
                  onCancel();
                  handleCloseMenu();
                }}
                sx={{ color: 'error.main' }}
              >
                <Iconify icon={'eva:trash-2-outline'} />
                Hủy lịch hẹn
              </MenuItem> }
              {status === "chờ khám" && <MenuItem
                onClick={() => {
                  onEditRow();
                  handleCloseMenu();
                }}
                sx={{ color: 'info.main' }}
              >
                <Iconify icon={'healthicons:group-discussion-meeting'} />
                Tham gia buổi tư vấn
              </MenuItem> }
              {status === "chờ xác nhận" && <MenuItem
                onClick={() => {
                  onCancel();
                  handleCloseMenu();
                }}
                sx={{ color: 'error.main' }}
              >
                <Iconify icon={'eva:trash-2-outline'} />
                Hủy lịch hẹn
              </MenuItem> }
              <MenuItem
                onClick={() => {
                  onEditRow();
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

import PropTypes from 'prop-types';
import { useState } from 'react';
import { format } from 'date-fns';
// @mui
import { useTheme } from '@mui/material/styles';
import { Avatar, Checkbox, TableRow, TableCell, Typography, MenuItem, Link } from '@mui/material';
// components
import Label from '../../../../components/Label';
import Iconify from '../../../../components/Iconify';
import { TableMoreMenu } from '../../../../components/table';

// ----------------------------------------------------------------------

DepartmentTableRow.propTypes = {
  row: PropTypes.object,
  selected: PropTypes.bool,
  onEditRow: PropTypes.func,
  onSelectRow: PropTypes.func,
  onDeleteRow: PropTypes.func,
};

export default function DepartmentTableRow({ row, selected, onEditRow, onSelectRow, onDeleteRow }) {
  const theme = useTheme();

  // const { fname, profilepic, lname } = row.doctor.account;

  const { _id, name, description } = row;

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

      <TableCell align="center" sx={{ textTransform: 'capitalize' }}>
        <Link onClick={onEditRow} color="inherit">
          <Typography variant="subtitle2" noWrap>
            {name}
          </Typography>
        </Link>
      </TableCell>

      <TableCell align="center" sx={{ textTransform: 'capitalize' }}>
        {description}
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
              {/* <MenuItem
                onClick={() => {
                  onDeleteRow();
                  handleCloseMenu();
                }}
                sx={{ color: 'error.main' }}
              >
                <Iconify icon={'eva:trash-2-outline'} />
                Delete
              </MenuItem> */}
              <MenuItem
                onClick={() => {
                  onEditRow(_id, name, description);
                  handleCloseMenu();
                }}
              >
                <Iconify icon={'openmoji:details'} />
                Sửa chuyên khoa
              </MenuItem>
            </>
          }
        />
      </TableCell>
    </TableRow>
  );
}

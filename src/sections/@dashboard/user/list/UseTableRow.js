import PropTypes from 'prop-types';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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

UseTableRow.propTypes = {
  row: PropTypes.object,
  selected: PropTypes.bool,
  onSelectRow: PropTypes.func,
  onDeleteRow: PropTypes.func,
};

export default function UseTableRow({ row, selected, onSelectRow, onSelectRow1 }) {
  const theme = useTheme();

  const { fname, lname, profilepic, phone, gender } = row.account;

  const name = `${lname} ${fname}`;

  const navigate = useNavigate();

  const { enqueueSnackbar } = useSnackbar();

  const [openMenu, setOpenMenuActions] = useState(null);

  const handleOpenMenu = (event) => {
    setOpenMenuActions(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpenMenuActions(null);
  };

  const selectAction = () => {
    onSelectRow();
    onSelectRow1();
  };

  return (
    <TableRow hover selected={selected}>
      <TableCell padding="checkbox">
        <Checkbox checked={selected} onClick={selectAction} />
      </TableCell>

      <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
        <Avatar alt={name} src={profilepic} sx={{ mr: 2 }} />
        <Typography variant="subtitle2" noWrap>
          {name}
        </Typography>
      </TableCell>

      <TableCell align="center" sx={{ textTransform: 'capitalize' }}>
        0{phone.slice(3)}
      </TableCell>

      {gender === 1 || gender === 2 ? (
        <TableCell align="center" sx={{ textTransform: 'capitalize' }}>
          {gender === 1 ? 'Nam' : 'Nữ'}
        </TableCell>
      ) : (
        <TableCell align="center" sx={{ textTransform: 'capitalize' }}>
          Không xác định
        </TableCell>
      )}

      {/* <TableCell align="right">
        <TableMoreMenu
          open={openMenu}
          onOpen={handleOpenMenu}
          onClose={handleCloseMenu}
          actions={
            <>
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
      </TableCell> */}
    </TableRow>
  );
}

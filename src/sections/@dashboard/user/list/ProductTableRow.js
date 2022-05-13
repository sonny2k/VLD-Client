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

ProductTableRow.propTypes = {
  row: PropTypes.object,
  selected: PropTypes.bool,
  onEditRow: PropTypes.func,
  onSelectRow: PropTypes.func,
  onDeleteRow: PropTypes.func,
};

export default function ProductTableRow({ row, selected, onEditRow, onSelectRow, onDeleteRow }) {
  const theme = useTheme();

  const { title, description, category, specdes, image, unit, components, origin, _id } = row;

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
        <Avatar alt={title} src={image} sx={{ mr: 2 }} />
        <Typography variant="subtitle2" noWrap>
          {title}
        </Typography>
      </TableCell>

      <TableCell align="left" sx={{ textTransform: 'capitalize' }}>
        {description}
      </TableCell>

      <TableCell align="left" sx={{ textTransform: 'capitalize' }}>
        {category}
      </TableCell>

      <TableCell align="left" sx={{ textTransform: 'capitalize' }}>
        {specdes}
      </TableCell>

      <TableCell align="left" sx={{ textTransform: 'capitalize' }}>
        {unit}
      </TableCell>

      <TableCell align="left" sx={{ textTransform: 'capitalize' }}>
        {components}
      </TableCell>

      <TableCell align="left" sx={{ textTransform: 'capitalize' }}>
        {origin}
      </TableCell>

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
                  onEditRow(_id, title, description, specdes, unit, components, origin, image, category);
                  handleCloseMenu();
                }}
              >
                <Iconify icon={'openmoji:details'} />
                Sửa sản phẩm
              </MenuItem>
            </>
          }
        />
      </TableCell>
    </TableRow>
  );
}

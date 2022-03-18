import { useState } from 'react';
// @mui
import { Button, MenuItem, Typography } from '@mui/material';
// redux
import { useDispatch, useSelector } from '../../../../redux/store';
import { sortByProducts } from '../../../../redux/slices/product';
// components
import Iconify from '../../../../components/Iconify';
import MenuPopover from '../../../../components/MenuPopover';

// ----------------------------------------------------------------------

const SORT_BY_OPTIONS = [
  { value: 'Mắt', label: 'Mắt' },
  { value: 'Ngoại', label: 'Ngoại' },
  { value: 'Tim mạch', label: 'Tim mạch' },
  { value: 'Nhi', label: 'Nhi'},
];

function renderLabel(value) {
  if (value === 'Mắt') {
    return 'Mắt';
  }
  if (value === 'Ngoại') {
    return 'Ngoại';
  }
  if (value === 'Nhi') {
    return 'Nhi';
  }
  return 'Tim mạch';
}

// ----------------------------------------------------------------------

export default function ShopProductSort() {
  const dispatch = useDispatch();

  const { sortBy } = useSelector((state) => state.product);

  const [open, setOpen] = useState(null);

  const handleOpen = (currentTarget) => {
    setOpen(currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
  };

  const handleSortBy = (value) => {
    handleClose();
    dispatch(sortByProducts(value));
  };

  return (
    <>
      <Button
        color="inherit"
        disableRipple
        onClick={(event) => handleOpen(event.currentTarget)}
        endIcon={<Iconify icon={open ? 'eva:chevron-up-fill' : 'eva:chevron-down-fill'} />}
      >
        Theo chuyên khoa:&nbsp;
        <Typography component="span" variant="subtitle2" sx={{ color: 'text.secondary' }}>
          {renderLabel(sortBy)}
        </Typography>
      </Button>

      <MenuPopover
        anchorEl={open}
        open={Boolean(open)}
        onClose={handleClose}
        sx={{
          width: 'auto',
          '& .MuiMenuItem-root': { typography: 'body2', borderRadius: 0.75 },
        }}
      >
        {SORT_BY_OPTIONS.map((option) => (
          <MenuItem key={option.value} selected={option.value === sortBy} onClick={() => handleSortBy(option.value)}>
            {option.label}
          </MenuItem>
        ))}
      </MenuPopover>
    </>
  );
}

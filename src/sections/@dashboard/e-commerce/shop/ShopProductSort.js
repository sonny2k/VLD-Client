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
  { value: 'tất cả', label: 'Tất cả'},
  { value: 'thần kinh', label: 'Thần Kinh' },
  { value: 'tim mạch', label: 'Tim mạch' },
  { value: 'nội', label: 'Nội' },
  { value: 'ngoại', label: 'Ngoại' },
  { value: 'nhãn khoa', label: 'Nhãn khoa' },
  { value: 'tai mũi họng', label: 'Tai mũi họng' },
  { value: 'ung bướu', label: 'Ung bướu' },
  { value: 'răng-hàm-mặt', label: 'Răng-hàm-mặt' },
];

function renderLabel(value) {
  if (value === 'thần kinh') {
    return 'Thần kinh';
  }
  if (value === 'tim mạch') {
    return 'Tim mạch';
  }
  if (value === 'nội') {
    return 'Nội';
  }
  if (value === 'ngoại') {
    return 'Ngoại';
  }
  if (value === 'nhãn khoa') {
    return 'Nhãn khoa';
  }
  if (value === 'tai mũi họng') {
    return 'Tai mũi họng';
  }
  if (value === 'ung bướu') {
    return 'ung bướu';
  }
  if (value === 'răng-hàm-mặt') {
    return 'Răng-hàm-mặt';
  }
  return 'Tất cả';
}

// ----------------------------------------------------------------------

export default function ShopProductSort({ sortFunc }) {
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
    sortFunc(value);
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

// form
import { useFormContext, useFieldArray, Controller } from 'react-hook-form';
import { useState } from 'react';
// @mui
import {
  Box,
  Stack,
  Button,
  Divider,
  Typography,
  InputAdornment,
  MenuItem,
  Autocomplete,
  TextField,
} from '@mui/material';
// utils
import { fNumber } from '../../../../utils/formatNumber';
// components
import Iconify from '../../../../components/Iconify';
import { RHFSelect, RHFTextField } from '../../../../components/hook-form';

// ----------------------------------------------------------------------

export default function InvoiceNewEditDetails({ products, loadedmeds, isEdit }) {
  const { control, setValue } = useFormContext();

  const meds = [...products];

  const [df, setDf] = useState(false);

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'medicines',
  });

  const handleAdd = () => {
    isEdit = false;
    setDf(true);
    append({
      product: '',
      quantity: '',
      rate: '',
      mednote: '',
    });
  };

  const handleRemove = (index) => {
    remove(index);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h6" sx={{ color: 'text.disabled', mb: 3 }}>
        Chi tiết toa thuốc:
      </Typography>

      <Stack divider={<Divider flexItem sx={{ borderStyle: 'dashed' }} />} spacing={3}>
        {fields.map((item, index) => (
          <Stack key={item.id} alignItems="flex-end" spacing={1.5}>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ width: 1 }}>
              <Autocomplete
                size="small"
                disabled={isEdit}
                fullWidth
                name={`medicines[${index}].product`}
                defaultValue={isEdit === true && df === false ? loadedmeds[`${index}`].product : null}
                loading={!products.length}
                onChange={(event, value) => setValue(`medicines[${index}].product`, value ? value._id : '')}
                options={meds.sort((a, b) => -b.category.localeCompare(a.category))}
                groupBy={(option) => option.category}
                autoHighlight
                getOptionLabel={(option) => option.title}
                renderOption={(props, option) => (
                  <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
                    <img loading="lazy" width="50" src={option.image} alt={option.title} />
                    {option.title}
                  </Box>
                )}
                renderInput={(params) => (
                  <TextField required helperText="Vui lòng chọn thuốc" {...params} label="Chọn thuốc" />
                )}
              />
              <RHFTextField
                required
                helperText="Vui lòng nhập số lượng"
                size="small"
                name={`medicines[${index}].quantity`}
                label="Số lượng"
                onChange={(event) => setValue(`medicines[${index}].quantity`, event.target.value)}
                sx={{ maxWidth: { md: 150 } }}
              />

              <RHFTextField
                required
                helperText="Vui lòng nhập liều lượng"
                size="small"
                name={`medicines[${index}].rate`}
                label="Liều lượng"
                onChange={(event) => setValue(`medicines[${index}].rate`, event.target.value)}
                sx={{ maxWidth: { md: 150 } }}
              />

              <RHFTextField
                size="small"
                name={`medicines[${index}].mednote`}
                label="Ghi chú"
                onChange={(event) => setValue(`medicines[${index}].mednote`, event.target.value)}
                sx={{ maxWidth: { md: 150 } }}
              />
            </Stack>

            <Button
              size="small"
              color="error"
              startIcon={<Iconify icon="eva:trash-2-outline" />}
              onClick={() => handleRemove(index)}
            >
              Xóa thuốc
            </Button>
          </Stack>
        ))}
      </Stack>

      <Divider sx={{ my: 3, borderStyle: 'dashed' }} />

      <Stack
        spacing={2}
        direction={{ xs: 'column-reverse', md: 'row' }}
        alignItems={{ xs: 'flex-start', md: 'center' }}
      >
        {isEdit !== true && <Button size="small" startIcon={<Iconify icon="eva:plus-fill" />} onClick={handleAdd} sx={{ flexShrink: 0 }}>
          Thêm thuốc mới
        </Button>}

        <Stack spacing={2} justifyContent="flex-end" direction={{ xs: 'column', md: 'row' }} sx={{ width: 1 }}>
          <RHFTextField
            size="small"
            label="Ghi chú chung"
            name="note"
            onChange={(event) => setValue('note', event.target.value)}
            sx={{ maxWidth: { md: 400 } }}
          />
        </Stack>
      </Stack>
    </Box>
  );
}

// form
import { useFormContext, useFieldArray, Controller } from 'react-hook-form';
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

export default function InvoiceNewEditDetails({ medicines }) {
  const { control, setValue, watch } = useFormContext();

  const meds = [...medicines];

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items',
  });

  const values = watch();

  const handleAdd = () => {
    append({
      title: '',
      quantity: '',
      rate: '',
      specdes: '',
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
              <Controller
                name="createDate"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <Autocomplete
                    size="small"
                    fullWidth
                    name={`items[${index}].title`}
                    loading={!medicines.length}
                    onChange={(event) => setValue(`items[${index}].title`, event.target.value)}
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
                    renderInput={(params) => <TextField {...params} label="Chọn thuốc" />}
                  />
                )}
              />
              <Controller
                name="createDate"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <RHFTextField
                    size="small"
                    name={`items[${index}].quantity`}
                    label="Số lượng"
                    onChange={(event) => setValue(`items[${index}].quantity`, event.target.value)}
                    sx={{ maxWidth: { md: 120 } }}
                  />
                )}
              />
              <Controller
                name="createDate"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <RHFTextField
                    size="small"
                    name={`items[${index}].rate`}
                    label="Liều lượng"
                    onChange={(event) => setValue(`items[${index}].rate`, event.target.value)}
                    sx={{ maxWidth: { md: 120 } }}
                  />
                )}
              />
              <Controller
                name="createDate"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <RHFTextField
                    size="small"
                    name={`items[${index}].specdes`}
                    label="Quy cách"
                    onChange={(event) => setValue(`items[${index}].specdes`, event.target.value)}
                    sx={{ maxWidth: { md: 120 } }}
                  />
                )}
              />
              <Controller
                name="createDate"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <RHFTextField
                    size="small"
                    name={`items[${index}].mednote`}
                    label="Ghi chú"
                    onChange={(event) => setValue(`items[${index}].mednote`, event.target.value)}
                    sx={{ maxWidth: { md: 120 } }}
                  />
                )}
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
        <Button size="small" startIcon={<Iconify icon="eva:plus-fill" />} onClick={handleAdd} sx={{ flexShrink: 0 }}>
          Thêm thuốc mới
        </Button>

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

// form
import { useFormContext, Controller } from 'react-hook-form';
// @mui
import DatePicker from '@mui/lab/DatePicker';
import { Stack, TextField, MenuItem } from '@mui/material';
// components
import { RHFSelect, RHFTextField } from '../../../../components/hook-form';

// ----------------------------------------------------------------------

const STATUS_OPTIONS = ['đã hoàn thành'];

// ----------------------------------------------------------------------

export default function InvoiceNewEditStatusDate() {
  const { control } = useFormContext();

  return (
    <Stack>
      <Stack direction={{ xs: 'column', sm: 'row' }} sx={{ p: 3, bgcolor: 'background.neutral' }}>
        <Controller
          name="createDate"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <RHFTextField size="small" name="pname" label="Tên toa thuốc" InputLabelProps={{ shrink: true }} />
          )}
        />
      </Stack>
      <Stack direction={{ xs: 'column', sm: 'row' }} sx={{ p: 3, bgcolor: 'background.neutral' }}>
        <Controller
          name="createDate"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <RHFTextField
              size="small"
              name="diagnosis"
              label="Chẩn đoán"
              multiline
              rows={3}
              InputLabelProps={{ shrink: true }}
            />
          )}
        />
      </Stack>
    </Stack>
  );
}

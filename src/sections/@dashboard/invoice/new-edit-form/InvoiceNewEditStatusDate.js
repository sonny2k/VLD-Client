// form
import { useFormContext, Controller } from 'react-hook-form';
// @mui
import DatePicker from '@mui/lab/DatePicker';
import { Stack, TextField, MenuItem } from '@mui/material';
// components
import { RHFSelect, RHFTextField } from '../../../../components/hook-form';

// ----------------------------------------------------------------------

export default function InvoiceNewEditStatusDate({ isEdit }) {
  const { control, setValue } = useFormContext();

  return (
    <Stack>
      <Stack direction={{ xs: 'column', sm: 'row' }} sx={{ p: 3, bgcolor: 'background.neutral' }}>
        <Controller
          name="pname"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <RHFTextField
              disabled={isEdit}
              onChange={(event) => setValue('pname', event.target.value)}
              size="small"
              name="pname"
              label="Tên toa thuốc"
            />
          )}
        />
      </Stack>
      <Stack direction={{ xs: 'column', sm: 'row' }} sx={{ p: 3, bgcolor: 'background.neutral' }}>
        <Controller
          name="diagnosis"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <RHFTextField
              onChange={(event) => setValue('diagnosis', event.target.value)}
              size="small"
              name="diagnosis"
              label="Chẩn đoán"
              multiline
              rows={4}
            />
          )}
        />
      </Stack>
    </Stack>
  );
}

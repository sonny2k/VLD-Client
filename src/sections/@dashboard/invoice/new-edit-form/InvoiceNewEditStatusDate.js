// form
import { useFormContext, Controller } from 'react-hook-form';
// @mui

import { Stack, Box, TextField } from '@mui/material';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import { icd10 } from '../../../../_mock/_icd10';
// components
import { RHFTextField } from '../../../../components/hook-form';

// ----------------------------------------------------------------------

export default function InvoiceNewEditStatusDate({ isEdit }) {
  const { control, setValue } = useFormContext();

  const filterOptions = createFilterOptions({
    matchFrom: 'start',
    limit: 500,
  });

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
          name="icd10"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <Autocomplete
              filterOptions={filterOptions}
              groupBy={(option) => option.code[0].toUpperCase()}
              size="small"
              fullWidth
              name="icd10"
              loading={!icd10.length}
              onChange={(event) => setValue('icd10', event.target.value)}
              options={icd10}
              autoHighlight
              getOptionLabel={(option) => option.code}
              renderOption={(props, option) => (
                <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
                  {option.code}
                </Box>
              )}
              renderInput={(params) => <TextField name="icd10" {...params} label="Chọn loại bệnh theo ICD-10" />}
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
              disabled={isEdit}
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

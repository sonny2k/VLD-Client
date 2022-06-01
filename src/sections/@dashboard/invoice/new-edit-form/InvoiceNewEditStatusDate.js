// form
import { useFormContext, Controller } from 'react-hook-form';
// @mui

import { Stack, Box, TextField } from '@mui/material';
import Autocomplete, { createFilterOptions } from '@mui/lab/Autocomplete';
import { icd10 } from '../../../../_mock/_icd10';
// components
import { RHFSelect, RHFTextField } from '../../../../components/hook-form';

// ----------------------------------------------------------------------

export default function InvoiceNewEditStatusDate({ isEdit }) {
  const { control, setValue } = useFormContext();

  const filterOptions = {
    matchFrom: 'any',
    limit: 500,
  };

  return (
    <Stack>
      <Stack direction={{ xs: 'column', sm: 'row' }} sx={{ p: 3, bgcolor: 'background.neutral' }}>
        <Controller
          name="pname"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <RHFTextField
              disabled={isEdit}
              filterOptions={filterOptions}
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
            <Autocomplete
              size="small"
              fullWidth
              name="diagnosis"
              loading={!icd10.length}
              onChange={(event) => setValue('diagnosis', event.target.value)}
              options={icd10}
              autoHighlight
              getOptionLabel={(option) => option.code}
              renderOption={(props, option) => (
                <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
                  {option.code}
                </Box>
              )}
              renderInput={(params) => <TextField {...params} label="Chọn chẩn đoán bệnh" />}
            />
          )}
        />
      </Stack>
    </Stack>
  );
}

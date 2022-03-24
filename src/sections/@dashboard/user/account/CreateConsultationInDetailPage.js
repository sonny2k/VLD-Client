import * as Yup from 'yup';
import * as React from 'react';
import { useSnackbar } from 'notistack';
import { useCallback } from 'react';
import { format } from 'date-fns';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Box, Grid, Card, Stack, Typography, TextField } from '@mui/material';
import { LoadingButton, DesktopDatePicker, DesktopTimePicker } from '@mui/lab';
// hooks
import useAuth from '../../../../hooks/useAuth';
// utils
import { fData } from '../../../../utils/formatNumber';
// _mock
import { hours } from '../../../../_mock/_hour';
import { datearray } from '../../../../_mock/_date';
// components
import { FormProvider, RHFSelect, RHFTextField } from '../../../../components/hook-form';

// ----------------------------------------------------------------------

export default function ModalCreateConsultation({ doctor }) {
  const { enqueueSnackbar } = useSnackbar();

  const { account } = useAuth();

  const { available } = doctor

  const UpdateUserSchema = Yup.object().shape({
    displayName: Yup.string().required('Họ tên là bắt buộc'),
  });

  const defaultValues = {
    displayName: account?.lname + account?.fname || '',
    phoneNumber: account?.phone || '',
    photoURL: account?.profilepic || '',
    note: account?.note || '',
    isPublic: account?.isPublic || '',
    birthday: new Date(account?.birthday) || '',
  };

  const methods = useForm({
    resolver: yupResolver(UpdateUserSchema),
    defaultValues,
  });

  let birthcheck;
  if (account?.birthday === null) {
    birthcheck = null
  }
  
  if (account?.birthday != null) {
    birthcheck = new Date(account?.birthday)
  }

  const [birth, setBirth] = React.useState(birthcheck);

  const handleChange = (newDate) => {
    setBirth(newDate);
  };

  const {
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async () => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      enqueueSnackbar('Đặt lịch khám thành công!');
      window.location.replace('http://localhost:2542/dashboard/user/list')
    } catch (error) {
      console.error(error);
    }
  };

  const handleDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];

      if (file) {
        setValue(
          'photoURL',
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        );
      }
    },
    [setValue]
  );

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={12}>
          <Card sx={{ p: 3 }}>
            <Box
                sx={{
                  display: 'grid',
                  rowGap: 3,
                  columnGap: 2,
                  gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' },
                }}
              >
                <RHFSelect name="date" label="Ngày" placeholder="Ngày">
                  {datearray.map((option, index) => (
                    <option key={index}>
                      {option.value}
                    </option>
                  ))}
                </RHFSelect>

                <RHFSelect name="hour" label="Giờ" placeholder="Giờ">
                  {hours.map((option, index) => (
                    <option key={index}>
                      {option.label}
                    </option>
                  ))}
                </RHFSelect>
              </Box>

            <Stack spacing={3} alignItems="flex-end" sx={{ mt: 3 }}>
              <RHFTextField name="about" multiline rows={4} label="Triệu chứng" />

              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                Hẹn Tư Vấn
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}

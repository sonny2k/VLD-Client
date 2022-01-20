import * as Yup from 'yup';
import * as React from 'react';
import { useSnackbar } from 'notistack';
import { useCallback } from 'react';
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
import { genders } from '../../../../_mock';
// components
import { FormProvider, RHFSwitch, RHFSelect, RHFTextField, RHFUploadAvatar } from '../../../../components/hook-form';

// ----------------------------------------------------------------------

export default function AccountGeneral() {
  const { enqueueSnackbar } = useSnackbar();

  const { account } = useAuth();

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
      enqueueSnackbar('Update success!');
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
        <Grid item xs={12} md={4}>
          <Card sx={{ py: 10, px: 3, textAlign: 'center' }}>
            <RHFUploadAvatar
              name="photoURL"
              accept="image/*"
              maxSize={3145728}
              onDrop={handleDrop}
              helperText={
                <Typography
                  variant="caption"
                  sx={{
                    mt: 2,
                    mx: 'auto',
                    display: 'block',
                    textAlign: 'center',
                    color: 'text.secondary',
                  }}
                >
                  BS. Trần Tuyết Mai
                  <br /> Chuyên khoa mắt
                  <br /> Sẵn sàng tư vấn: 20/11/2021

                </Typography>
              }
            />

            {/* <RHFSwitch name="isPublic" labelPlacement="start" label="Hồ sơ bệnh án" sx={{ mt: 5 }} /> */}
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Card sx={{ p: 3 }}>
            <Box
              sx={{
                display: 'grid',
                rowGap: 3,
                columnGap: 2,
                gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' },
              }}
            >
              <DesktopDatePicker
                name="birthday"
                label="Thời gian tư vấn"
                inputFormat="dd/MM/yyyy"
                value={birth}
                onChange={handleChange}
                renderInput={(params) => <TextField {...params} />}
              />
              <DesktopTimePicker
                name="time"
                label="Khung giờ"
                inputFormat='hh:mm'
                onChange={handleChange}
                renderInput={(params) => <TextField {...params} />}
              />
              {/* <RHFTextField name="phoneNumber" label="Số điện thoại" />
              <RHFTextField name="lnameandfname" label="Họ và tên" /> */}

              {/* <RHFSelect name="country" label="Country" placeholder="Quốc gia">
                <option value="" />
                {countries.map((option) => (
                  <option key={option.code} value={option.label}>
                    {option.label}
                  </option>
                ))}
              </RHFSelect> */}
                 {/* <RHFSelect name="country" label="Country" placeholder="Nhóm máu">
                <option value="" />
                {genders.map((option) => (
                  <option key={option.code} value={option.label}>
                    {option.label}
                  </option>
                ))}
                </RHFSelect> */}

              {/* <RHFTextField name="state" label="Quận/Huyện" />

              <RHFTextField name="city" label="Thành phố" />
              <RHFTextField name="zipCode" label="Phường/Xã" /> */}
            </Box>

            <Stack spacing={3} alignItems="flex-end" sx={{ mt: 3 }}>
              <RHFTextField name="about" multiline rows={4} label="Ghi chú" />

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

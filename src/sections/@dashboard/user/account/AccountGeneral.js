import * as Yup from 'yup';
import * as React from 'react';
import { useSnackbar } from 'notistack';
import { useCallback } from 'react';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Box, Grid, Card, Stack, Typography, TextField } from '@mui/material';
import { LoadingButton, DesktopDatePicker } from '@mui/lab';
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

  const { account, updateinfo } = useAuth();

  const UpdateUserSchema = Yup.object().shape({
    displayName: Yup.string().required('Name is required'),
  });

  const gender = account.gender;
  let genderview = "";
  if (gender === 1) {
    genderview = "Nam"
  } 
  if (gender === 2) {
    genderview = "Nữ"
  } 
  if (gender === 3) {
    genderview = "Không xác định"
  } 

  const name = `${account?.fname} ${account?.lname}`;

  const defaultValues = {
    fname: account?.fname || '',
    lname: account?.lname || '',
    phone: account?.phone || '',
    photoURL: account?.profilepic || '',
    email: account?.email || '',
    gender: genderview || '',
    street: account?.address.street || '',
    district: account?.address.district || '',
    city: account?.address.city || '',
    ward: account?.address.ward || '',
  };

  const methods = useForm({
    defaultValues,
  });

  const [birth, setBirth] = React.useState(new Date(account?.birthday));

  const handleChange = (newValue) => {
    setBirth(newValue);
  };

  const {
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (data) => {
    try {
      let newgender;
      if (data.gender === "Nam") {
        newgender = 1;
      }
      if (data.gender === "Nữ") {
        newgender = 2;
      }
      if (data.gender === "Không xác định") {
        newgender = 3;
      }
      await updateinfo(data.fname, data.lname, data.email, birth, newgender, data.city, data.ward, data.district, data.street);
      enqueueSnackbar('Cập nhật tài khoản thành công!');
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
                  Allowed *.jpeg, *.jpg, *.png, *.gif
                  <br /> max size of {fData(3145728)}
                </Typography>
              }
            />

            {/* <RHFSwitch name="isPublic" labelPlacement="start" label="Thông tin cá nhân" sx={{ mt: 5 }} /> */}
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
              <RHFTextField name="lname" label="Họ" />
              <RHFTextField name="fname" label="Tên" />
              <RHFTextField name="email" label="Địa chỉ email " disabled/>
              <DesktopDatePicker
                name="birthday"
                label="Ngày sinh"
                inputFormat="dd/MM/yyyy"
                value={birth}
                onChange={handleChange}
                renderInput={(params) => <TextField {...params} />}
              />

              <RHFTextField name="phone" label="Số điện thoại" disabled/>
              <RHFTextField name="street" label="Tên đường" />

              <RHFSelect name="gender" label="Giới tính">
                <option value="" />
                {genders.map((option) => (
                  <option key={option.code} value={option.label}>
                    {option.label}
                  </option>
                ))}
              </RHFSelect>

              <RHFTextField name="district" label="Quận/Huyện" />

              <RHFTextField name="city" label="Thành phố" />
              <RHFTextField name="ward" label="Phường/Xã" />
            </Box>

            <Stack spacing={3} alignItems="flex-end" sx={{ mt: 3 }}>

              <LoadingButton type="submit" variant="contained" loading={isSubmitting} >
                Lưu thay đổi
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}

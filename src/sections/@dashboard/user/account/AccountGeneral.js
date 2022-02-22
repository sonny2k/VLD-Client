import * as React from 'react';
import { format } from 'date-fns';
// form
import { useForm } from 'react-hook-form';
// @mui
import { Box, Grid, Card, Stack } from '@mui/material';
// hooks
import useAuth from '../../../../hooks/useAuth';
// _mock
import { genders } from '../../../../_mock/_gender';
// components
import { FormProvider, RHFSelect, RHFTextField, RHFUploadAvatar } from '../../../../components/hook-form';

// ----------------------------------------------------------------------

export default function AccountGeneral() {
  const { account } = useAuth();

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
    birthday: format(new Date(account?.birthday), 'dd/MM/yyyy') || '',
    cityId: account?.address.city || '',
    districtId: account?.address.district || '',
    wardId: account?.address.ward || '',
  };

  const methods = useForm({
    defaultValues,
  });

  return (
    <FormProvider methods={methods}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card sx={{ py: 10, px: 3, textAlign: 'center' }}>
            <RHFUploadAvatar
              name="photoURL"
              accept="image/*"
              maxSize={3145728}
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
              <RHFTextField name="lname" label="Họ" disabled/>
              <RHFTextField name="fname" label="Tên" disabled/>
              <RHFTextField name="email" label="Địa chỉ email" disabled/>
              <RHFTextField name="phone" label="Số điện thoại" disabled/>
              <RHFTextField name="birthday" label="Ngày sinh" disabled/>

              <RHFSelect name="gender" label="Giới tính" disabled>
                {genders.map((option) => (
                  <option key={option.code}>
                    {option.label}
                  </option>
                ))}
              </RHFSelect>

              <RHFTextField name="cityId" label="Tỉnh/Thành phố" disabled/>
          

              <RHFTextField name="districtId" label="Quận/Huyện" disabled/>
                
  
              <RHFTextField name="wardId" label="Phường/Xã" disabled/>
   

              <RHFTextField name="street" label="Địa chỉ" disabled/>
            </Box>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}

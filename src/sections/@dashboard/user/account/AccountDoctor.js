import * as React from 'react';
import { useState, useEffect } from 'react';
import { format } from 'date-fns';

// form
import { useForm } from 'react-hook-form';
// @mui
import { Box, Grid, Card, Stack, Button } from '@mui/material';
import Modal from '@mui/material/Modal';
import ModalEditInformation from './EditInformation';


// hooks
import useAuth from '../../../../hooks/useAuth';
// _mock
import { genders } from '../../../../_mock/_gender';
// components
import { FormProvider, RHFSelect, RHFTextField } from '../../../../components/hook-form';
import MyAvatar from '../../../../components/MyAvatar';


// ----------------------------------------------------------------------

export default function AccountDoctor() {
  const { account } = useAuth();

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  
  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 800,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };
  
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
            <MyAvatar
              sx={{
                mx: 'auto',
                borderWidth: 2,
                borderStyle: 'solid',
                borderColor: 'common.white',
                width: { xs: 80, md: 128 },
                height: { xs: 80, md: 128 },
              }}
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
              <RHFTextField name="workcertificate" label="Chứng chỉ" disabled/>

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
            <Stack spacing={3} alignItems="flex-end" sx={{ mt: 3 }}>
              <Button variant='contained' className="openModalBtn" onClick={handleOpen}>
                Chỉnh sửa thông tin
              </Button>
              <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
              >
                <Box sx={style}>
                  <ModalEditInformation />
                </Box>
              </Modal>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}

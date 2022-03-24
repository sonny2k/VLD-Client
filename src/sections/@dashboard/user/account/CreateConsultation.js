import * as Yup from 'yup';
import * as React from 'react';
import { useSnackbar } from 'notistack';
import { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
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
import createAvatar from '../../../../utils/createAvatar';
import axios from '../../../../utils/axios';
// _mock
import { hours } from '../../../../_mock/_hour';
import { datearray } from '../../../../_mock/_date';
// components
import { FormProvider, RHFSelect, RHFTextField } from '../../../../components/hook-form';
import Avatar from '../../../../components/Avatar';

// ----------------------------------------------------------------------

export default function ModalCreateConsultation({ doctor, ...other }) {
  const { enqueueSnackbar } = useSnackbar();

  const { lname, fname, profilepic } = doctor.account;

  const { level, department, available, workcertificate } = doctor

  const { account } = useAuth();

  ModalCreateConsultation.propTypes = {
    doctor: PropTypes.object,
  };

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
    date: '',
    hour: '',
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

  const onSubmit = async (data) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      enqueueSnackbar('Đặt lịch khám thành công!');
      // try {
      //   await axios.post('/api/user/consultation/createconsult', {
      //     status: 1,
      //     symptom: data.symptom,
      //     date,
      //     hour: data.,
      //     doctor: doctor._id,
      //     user: account._id
      //   });
      // } catch (err) {
      //   console.error(err);
      //   enqueueSnackbar('Có lỗi xảy ra, vui lòng thử lại!');
      // }
      // window.location.replace('http://localhost:2542/dashboard/user/list')
    } catch (error) {
      console.error(error);
    }
  };
  
  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card sx={{ py: 10, px: 3, textAlign: 'center' }}>
            <Avatar
              src={profilepic}
              alt={`${lname} ${fname}`}
              color={profilepic ? 'default' : createAvatar(`${lname} ${fname}`).color}
              {...other}
              sx={{
                mx: 'auto',
                borderWidth: 2,
                borderStyle: 'solid',
                borderColor: 'common.white',
                width: { xs: 80, md: 128 },
                height: { xs: 80, md: 128 },
              }}
            >
              {createAvatar(`${lname} ${fname}`).name}
            </Avatar>
           
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
                {level} {lname} {fname}
                <br /> {department}
                <br /> {workcertificate}

            </Typography>
        
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
              <RHFTextField name="symptom" multiline rows={4} label="Triệu chứng" />

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

import * as Yup from 'yup';
import { useSnackbar } from 'notistack';
import { useCallback, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// form
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Box, Grid, Card, Stack, Typography, InputAdornment } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { getUseDetail } from '../../../../redux/slices/UserDetail';

import LoadingScreen from '../../../../components/LoadingScreen';
// hooks
import useAuth from '../../../../hooks/useAuth';
// utils
import { fData } from '../../../../utils/formatNumber';
import axios from '../../../../utils/axios';
import createAvatar from '../../../../utils/createAvatar';
// _mock
import { bloodtypes } from '../../../../_mock';
// components
import { FormProvider, RHFSwitch, RHFSelect, RHFTextField, RHFUploadAvatar } from '../../../../components/hook-form';
import Avatar from '../../../../components/Avatar';

// ----------------------------------------------------------------------

export default function AccountUser() {
  const { enqueueSnackbar } = useSnackbar();

  const UpdateUserSchema = Yup.object().shape({
    height: Yup.number()
      .required('Vui lòng điền chiều cao của bạn')
      .max(200, ' Chiều cao dưới 200')
      .typeError('Chiều cao dưới 200'),
    weight: Yup.number()
      .required('Vui lòng điền cân nặng của bạn')
      .max(200, 'Cân nặng dưới 200')
      .typeError('Cân nặng dưới 200'),
  });

  const dispatch = useDispatch();
  const { usedetail } = useSelector((state) => state.userdetail);

  useEffect(() => {
    dispatch(getUseDetail());
  }, [dispatch]);

  useEffect(() => {
    reset(usedetail);
  }, [usedetail]);

  const methods = useForm({
    resolver: yupResolver(UpdateUserSchema),
  });

  const { account } = useAuth();

  const { lname, fname, profilepic } = account;

  const {
    reset,
    watch,
    setValue,
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  console.log(values.height);

  const onSubmit = async (values) => {
    try {
      await axios.put('/api/user/userinfo', {
        bloodtype: values.bloodtype,
        height: values.height,
        weight: values.weight,
        pastmedicalhistory: values.pastmedicalhistory,
        drughistory: values.drughistory,
        familyhistory: values.familyhistory,
      });
      enqueueSnackbar('Cập nhật thông tin chi tiết thành công');
    } catch (error) {
      console.error(error);
      enqueueSnackbar('Có lỗi xảy ra, vui lòng thử lại!', { variant: 'error' });
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card sx={{ py: 10, px: 3, textAlign: 'center' }}>
            <Controller
              control={control}
              render={({ field, fieldState: { error } }) => (
                <Avatar
                  src={profilepic}
                  alt={`${lname} ${fname}`}
                  color={profilepic ? 'default' : createAvatar(`${lname} ${fname}`).color}
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
              )}
            />
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
              <Controller
                name="height"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <RHFTextField
                    type="number"
                    name="height"
                    label="Chiều cao"
                    defaultValue={0}
                    onChange={(event) => setValue('height', event.target.value)}
                    InputProps={{
                      endAdornment: <InputAdornment position="end">cm</InputAdornment>,
                    }}
                  />
                )}
              />

              <Controller
                name="weight"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <RHFTextField
                    type="number"
                    name="weight"
                    label="Cân nặng"
                    defaultValue="0"
                    InputProps={{
                      endAdornment: <InputAdornment position="end">kg</InputAdornment>,
                    }}
                    onChange={(event) => setValue('weight', event.target.value)}
                  />
                )}
              />

              <Controller
                name="pastmedicalhistory"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <RHFTextField
                    name="pastmedicalhistory"
                    label="Tiền sử bệnh lý"
                    defaultValue=" "
                    onChange={(event) => setValue('pastmedicalhistory', event.target.value)}
                  />
                )}
              />

              <Controller
                name="drughistory"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <RHFTextField
                    name="drughistory"
                    label="Tiền sử dị ứng"
                    defaultValue=" "
                    onChange={(event) => setValue('drughistory', event.target.value)}
                  />
                )}
              />

              <Controller
                name="familyhistory"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <RHFTextField
                    name="familyhistory"
                    label="Tiền sử gia đình"
                    defaultValue=" "
                    onChange={(event) => setValue('familyhistory', event.target.value)}
                  />
                )}
              />
              <Controller
                name="bloodtype"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <RHFSelect
                    name="bloodtype"
                    label="Nhóm máu"
                    placeholder="Nhóm máu"
                    defaultValue={bloodtypes[0].label}
                    onChange={(event) => setValue('bloodtype', event.target.value)}
                  >
                    {bloodtypes.map((option) => (
                      <option key={option.code}>{option.label}</option>
                    ))}
                  </RHFSelect>
                )}
              />
            </Box>

            <Stack spacing={3} alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                Lưu thay đổi
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}

import * as Yup from 'yup';
import { useSnackbar } from 'notistack';
import { useCallback, useState, useEffect } from 'react';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Box, Grid, Card, Stack, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';
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

  const [user, setUser] = useState(null);

  const { account } = useAuth();

  const { lname, fname, profilepic } = account;


  const UserSchema = Yup.object().shape({
    height: Yup.string().required('Chiều cao là bắt buộc'),
    weight: Yup.string().required('Cân nặng là bắt buộc'),
  });

  const methods = useForm({
    resolver: yupResolver(UserSchema),
    
  });

  const {
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (data) => {
    try {
      await axios.put('/api/user/userinfo', {
        bloodtype: data.bloodtype,
        height: data.height,
        weight: data.weight,
        pastmedicalhistory: data.pastmedicalhistory,
        drughistory: data.drughistory,
        familyhistory: data.familyhistory,
      });
      enqueueSnackbar('Cập nhật thông tin chi tiết thành công');
      window.location.reload();
    } catch (error) {
      console.error(error);
      enqueueSnackbar('Có lỗi xảy ra, vui lòng thử lại!', { variant: 'error' });
    }
  };

  useEffect(() => {
    async function getInfo() {
      const URL = '/api/user/userinfo';
      try {
        const res = await axios.get(URL);
        setUser(res.data);
      } catch (error) {
        console.log(error);
      }
    }
    getInfo();
  }, []);

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
  if (user !== null) {
  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card sx={{ py: 10, px: 3, textAlign: 'center' }}>
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
              <RHFTextField name="height" label="Chiều cao" defaultValue={user.height} />
              <RHFTextField name="weight" label="Cân nặng" defaultValue={user.weight} />
              <RHFTextField name="pastmedicalhistory" label="Tiền sử bệnh lý" defaultValue={user.pastmedicalhistory} />
              <RHFTextField name="drughistory" label="Tiền sử dị ứng" defaultValue={user.drughistory} />
              <RHFTextField name="familyhistory" label="Tiền sử gia đình" defaultValue={user.familyhistory} />

                 <RHFSelect name="bloodtype" label="Nhóm máu" placeholder="Nhóm máu" defaultValue={user.bloodtype}>
                {bloodtypes.map((option) => (
                  <option key={option.code} >
                    {option.label}
                  </option>
                ))}
                </RHFSelect>
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
  return <LoadingScreen />;
}

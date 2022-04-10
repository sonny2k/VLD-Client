import * as React from 'react';
import { useState, useEffect, useCallback } from 'react';
import { format } from 'date-fns';
import { useSnackbar } from 'notistack';
import * as Yup from 'yup';

// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Box, Grid, Card, Stack, Button, Typography } from '@mui/material';
import { LoadingButton, DesktopDatePicker } from '@mui/lab';
import LoadingScreen from '../../../../components/LoadingScreen';

// hooks
import useAuth from '../../../../hooks/useAuth';
// utils
import { fData } from '../../../../utils/formatNumber';
import axios from '../../../../utils/axios';
// _mock

// components
import { FormProvider, RHFSelect, RHFTextField, RHFUploadAvatar, RHFSwitch } from '../../../../components/hook-form';

import { UploadAvatar } from '../../../../components/upload';

// ----------------------------------------------------------------------

export default function DoctorDetail() {
  const { account, updateinfo } = useAuth();

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [doc, setDoctor] = useState(null);
  const { enqueueSnackbar } = useSnackbar();
  const cursor = true;

  const methods = useForm({
    resolver: yupResolver(),
  });

  const {
    setValue,
    getValues,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const handleDrop = useCallback(
    async (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (file) {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
          uploadImage(reader.result);
        };
        setValue(
          'signature',
          Object.assign(file, {
            preview: URL.createObjectURL(file),   
          })
        );
      }
    },
    [setValue]
  );

  const uploadImage = async (base64EncodedImage) => {
    const pic = base64EncodedImage.toString();
    try {
      await axios.post('/api/user/account/profilepic', {
        pic
      });
    } catch (err) {
      console.error(err);
      enqueueSnackbar('Có lỗi xảy ra, vui lòng thử lại!');
    }
  };

  useEffect(() => {
    async function getInfo() {
      const URL = '/api/doctor/account/info';
      try {
        const res = await axios.get(URL);
        setDoctor(res.data);
      } catch (error) {
        console.log(error);
      }
    }
    getInfo();
  }, []);

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

  

  if (doc !== null) {
    return (
      <FormProvider methods={methods}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Card sx={{ py: 10, px: 3, textAlign: 'center' }}>
            <UploadAvatar 
                name="signature"
                accept="image/*"
                maxSize={3145728}
                onDrop={handleDrop}
                type='file'
                file={doc.signature}
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
                  disabled>
                    Cập nhật ảnh chữ ký
                    <br /> Chỉ cho phép *.jpeg, *.jpg, *.png, *.gif
                    <br /> Dung lượng tối đa {fData(3145728)}
                </Typography>
              }
            />

              {/* <RHFSwitch name="isPublic" labelPlacement="start" label="Thông tin cá nhân" sx={{ mt: 5 }} /> */}
            </Card>
          </Grid>

          <Grid item xs={12} md={8}>
            <Card sx={{ p: 3 }}>
            <Stack alignItems="flex-end">
              <RHFTextField name="department" label="Chuyên khoa" defaultValue={doc.department} disabled />
            </Stack>
            <Stack  alignItems="flex-end" sx={{ mt: 3 }}/>

              <Box
                sx={{
                  display: 'grid',
                  rowGap: 3,
                  columnGap: 2,
                  gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' },
                }}
              >
                <RHFTextField name="educationplace" label="Nơi tốt nghiệp" defaultValue={doc.educationplace} />
                <RHFTextField name="workcertificate" label="Chứng chỉ" defaultValue={doc.workcertificate} />
                <RHFTextField name="level" label="Cấp bậc" defaultValue={doc.level} />
                <RHFTextField name="degree" label="Bằng cấp" defaultValue={doc.degree} />
                <RHFTextField multiline rows={4} name="description" label="Mô tả" defaultValue={doc.description}/>
                <RHFTextField multiline rows={4} name="excellence" label="Chuyên môn" defaultValue={doc.excellence} />
                <RHFTextField multiline rows={4} name="workhistory" label="Lịch sử làm việc" defaultValue={doc.workhistory} />
                <RHFTextField multiline rows={4} name="education" label="Đào tạo" defaultValue={doc.education} />
              </Box>
              <Stack spacing={3} alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting} >
                Lưu thay đổi
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
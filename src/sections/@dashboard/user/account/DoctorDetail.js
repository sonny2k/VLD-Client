import * as React from 'react';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { format } from 'date-fns';
import { useSnackbar } from 'notistack';
import * as Yup from 'yup';

// form
import { useForm, useFormContext, Controller } from 'react-hook-form';
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

  const UpdateUserSchema = Yup.object().shape({
    educationplace: Yup.string().required('Vui lòng điền nơi tốt nghiệp'),
    workcertificate: Yup.string().required('Vui lòng điền chứng chỉ'),
    level: Yup.string().required('Vui lòng điền cấp bậc'),
    degree: Yup.string().required('Vui lòng điền bằng cấp'),
    description: Yup.string().required('Vui lòng điền mô tả'),
    excellence: Yup.string().required('Vui lòng điền chuyên môn'),
    workhistory: Yup.string().required('Vui lòng điền lịch sử làm việc'),
    education: Yup.string().required('Vui lòng điền quá trình đào tạo'),
  });

  const methods = useForm({
    resolver: yupResolver(UpdateUserSchema),
  });

  const {
    reset,
    control,
    setValue,
    getValues,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    async function getInfo() {
      const result = await axios.get('/api/doctor/account/info');
      setDoctor(result.data);
      // if (doc) {
      //   setValue([
      //     { name: doc.department },
      //     { educationplace: doc.educationplace },
      //     { workcertificate: doc.workcertificate },
      //     { level: doc.level },
      //     { degree: doc.degree },
      //     { description: doc.description },
      //     { excellence: doc.excellence },
      //     { workhistory: doc.workhistory },
      //     { education: doc.education },
      //   ]);
      // }
    }
    getInfo();
  }, []);

  const defaultValues = {
    educationplace: doc?.educationplace || '',
    workcertificate: doc?.workcertificate || '',
    level: doc?.level || '',
    description: doc?.description || '',
    excellence: doc?.excellence || '',
    degree: doc?.degree || '',
    workhistory: doc?.workhistory || '',
    education: doc?.education || '',
  };

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
      await axios.post('/api/doctor/account/signature', {
        pic,
      });
    } catch (err) {
      console.error(err);
      enqueueSnackbar('Có lỗi xảy ra, vui lòng thử lại!');
    }
  };

  const onSubmit = async (data) => {
    try {
      await axios.put('/api/doctor/account/detailinfo', {
        educationplace: data.educationplace,
        workcertificate: data.workcertificate,
        level: data.level,
        degree: data.degree,
        description: data.description,
        excellence: data.excellence,
        workhistory: data.workhistory,
        education: data.education,
      });
      enqueueSnackbar('Cập nhật thông tin tài khoản thành công!');
    } catch (error) {
      console.error(error);
      enqueueSnackbar('Có lỗi xảy ra, vui lòng thử lại', { variant: 'error' });
    }
  };

  return (
    doc !== null && (
      <FormProvider onSubmit={handleSubmit(onSubmit)} methods={methods}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Card sx={{ py: 10, px: 3, textAlign: 'center' }}>
              <UploadAvatar
                name="signature"
                accept="image/*"
                maxSize={3145728}
                onDrop={handleDrop}
                type="file"
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
                    disabled
                  >
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
              <Stack alignItems="flex-end" sx={{ mt: 3 }} />

              <Box
                sx={{
                  display: 'grid',
                  rowGap: 3,
                  columnGap: 2,
                  gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' },
                }}
              >
                <RHFTextField name="educationplace" label="Nơi tốt nghiệp" defaultValue={doc.educationplace} />

                <Controller
                  name="workcertificate"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <RHFTextField name="workcertificate" label="Chứng chỉ" defaultValue={doc.workcertificate} />
                  )}
                />

                <Controller
                  name="level"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <RHFTextField name="level" label="Cấp bậc" defaultValue={doc.level} />
                  )}
                />

                <Controller
                  name="degree"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <RHFTextField name="degree" label="Bằng cấp" defaultValue={doc.degree} />
                  )}
                />
              </Box>
              <Stack alignItems="flex-end" sx={{ mt: 3 }} />
              <Stack spacing={3} alignItems="flex-end">
                <Controller
                  name="description"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <RHFTextField multiline rows={4} name="description" label="Mô tả" defaultValue={doc.description} />
                  )}
                />

                <Controller
                  name="excellence"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <RHFTextField
                      multiline
                      rows={4}
                      name="excellence"
                      label="Chuyên môn"
                      defaultValue={doc.excellence}
                    />
                  )}
                />

                <Controller
                  name="workhistory"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <RHFTextField
                      multiline
                      rows={4}
                      name="workhistory"
                      label="Lịch sử làm việc"
                      defaultValue={doc.workhistory}
                    />
                  )}
                />

                <Controller
                  name="education"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <RHFTextField
                      multiline
                      rows={4}
                      name="education"
                      label="Quá trình đào tạo"
                      defaultValue={doc.education}
                    />
                  )}
                />
              </Stack>
              <Stack spacing={3} alignItems="flex-end" sx={{ mt: 3 }}>
                <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                  Lưu thay đổi
                </LoadingButton>
              </Stack>
            </Card>
          </Grid>
        </Grid>
      </FormProvider>
    )
  );
}

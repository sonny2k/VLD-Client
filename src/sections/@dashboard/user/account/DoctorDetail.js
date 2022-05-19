import * as React from 'react';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { format } from 'date-fns';
import { useSnackbar } from 'notistack';
import * as Yup from 'yup';

// form
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Box, Grid, Card, Stack, Button, Typography } from '@mui/material';
import { LoadingButton, DesktopDatePicker } from '@mui/lab';
import { getDocDetail } from '../../../../redux/slices/DoctorDetail';
import LoadingScreen from '../../../../components/LoadingScreen';

// hooks
import useAuth from '../../../../hooks/useAuth';
// utils
import { fData } from '../../../../utils/formatNumber';
import axios from '../../../../utils/axios';
// _mock

// components
import { FormProvider, RHFSelect, RHFTextField, RHFUploadAvatar, RHFSwitch } from '../../../../components/hook-form';

// ----------------------------------------------------------------------

export default function DoctorDetail() {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [doc, setDoctor] = useState(null);
  const { enqueueSnackbar } = useSnackbar();

  const UpdateUserSchema = Yup.object().shape({
    educationplace: Yup.string().required('Vui lòng điền nơi tốt nghiệp').max(255),
    workcertificate: Yup.string().required('Vui lòng điền chứng chỉ'),
    level: Yup.string().required('Vui lòng điền cấp bậc').max(255),
    degree: Yup.string().required('Vui lòng điền bằng cấp').max(255),
    description: Yup.string().required('Vui lòng điền mô tả'),
    excellence: Yup.string().required('Vui lòng điền chuyên môn'),
    workhistory: Yup.string().required('Vui lòng điền lịch sử làm việc'),
    education: Yup.string().required('Vui lòng điền quá trình đào tạo'),
  });

  const dispatch = useDispatch();
  const { docdetail } = useSelector((state) => state.doctordetail);

  useEffect(() => {
    dispatch(getDocDetail());
  }, [dispatch]);

  useEffect(() => {
    reset(docdetail);
  }, [docdetail]);

  const methods = useForm({
    resolver: yupResolver(UpdateUserSchema),
  });

  const {
    reset,
    watch,
    setValue,
    control,
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
      await axios.post('/api/doctor/account/signature', {
        pic,
      });
    } catch (err) {
      console.error(err);
      enqueueSnackbar('Có lỗi xảy ra, vui lòng thử lại!');
    }
  };

  const values = watch();

  const onSubmit = async (values) => {
    try {
      await axios.put('/api/doctor/account/detailinfo', {
        educationplace: values.educationplace,
        workcertificate: values.workcertificate,
        level: values.level,
        degree: values.degree,
        description: values.description,
        excellence: values.excellence,
        workhistory: values.workhistory,
        education: values.education,
      });
      enqueueSnackbar('Cập nhật thông tin tài khoản thành công!');
    } catch (error) {
      console.error(error);
      enqueueSnackbar('Có lỗi xảy ra, vui lòng thử lại', { variant: 'error' });
    }
  };

  return (
    <FormProvider onSubmit={handleSubmit(onSubmit)} methods={methods}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card sx={{ py: 10, px: 3, textAlign: 'center' }}>
            <Controller
              control={control}
              render={({ field, fieldState: { error } }) => (
                <RHFUploadAvatar
                  name="signature"
                  accept="image/*"
                  maxSize={3145728}
                  onDrop={handleDrop}
                  type="file"
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
              )}
            />

            {/* <RHFSwitch name="isPublic" labelPlacement="start" label="Thông tin cá nhân" sx={{ mt: 5 }} /> */}
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Card sx={{ p: 3 }}>
            <Stack alignItems="flex-end">
              <Controller
                name="department"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <RHFTextField name="department" label="Chuyên khoa" disabled defaultValue=" " />
                )}
              />
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
              <Controller
                name="educationplace"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <RHFTextField
                    name="educationplace"
                    label="Nơi tốt nghiệp"
                    defaultValue=" "
                    onChange={(event) => setValue('educationplace', event.target.value)}
                  />
                )}
              />

              <Controller
                name="workcertificate"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <RHFTextField
                    name="workcertificate"
                    label="Chứng chỉ"
                    defaultValue=" "
                    onChange={(event) => setValue('workcertificate', event.target.value)}
                  />
                )}
              />

              <Controller
                name="level"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <RHFTextField
                    name="level"
                    label="Cấp bậc"
                    defaultValue=" "
                    onChange={(event) => setValue('level', event.target.value)}
                  />
                )}
              />

              <Controller
                name="degree"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <RHFTextField
                    name="degree"
                    label="Bằng cấp"
                    defaultValue=" "
                    onChange={(event) => setValue('degree', event.target.value)}
                  />
                )}
              />
            </Box>
            <Stack alignItems="flex-end" sx={{ mt: 3 }} />
            <Stack spacing={3} alignItems="flex-end">
              <Controller
                name="description"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <RHFTextField
                    name="description"
                    multiline
                    rows={4}
                    label="Mô tả"
                    defaultValue=" "
                    onChange={(event) => setValue('description', event.target.value)}
                  />
                )}
              />

              <Controller
                name="excellence"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <RHFTextField
                    name="excellence"
                    multiline
                    rows={4}
                    label="Chuyên môn"
                    defaultValue=" "
                    onChange={(event) => setValue('excellence', event.target.value)}
                  />
                )}
              />

              <Controller
                name="workhistory"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <RHFTextField
                    name="workhistory"
                    multiline
                    rows={4}
                    label="Lịch sử làm việc"
                    defaultValue=" "
                    onChange={(event) => setValue('workhistory', event.target.value)}
                  />
                )}
              />

              <Controller
                name="education"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <RHFTextField
                    name="education"
                    multiline
                    rows={4}
                    label="Quá trình đào tạo"
                    defaultValue=" "
                    onChange={(event) => setValue('education', event.target.value)}
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
  );
}

import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
import { useCallback, useEffect, useMemo, useState } from 'react';
// form
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { styled } from '@mui/material/styles';
import { LoadingButton } from '@mui/lab';
import { Card, Chip, Grid, Stack, TextField, Typography, Autocomplete, InputAdornment, Box } from '@mui/material';
import axios from '../../../../utils/axios';

// routes
import { PATH_DASHBOARD } from '../../../../routes/paths';
// components
import {
  FormProvider,
  RHFSwitch,
  RHFSelect,
  RHFEditor,
  RHFTextField,
  RHFRadioGroup,
  RHFUploadMultiFile,
} from '../../../../components/hook-form';

// ----------------------------------------------------------------------

const LabelStyle = styled(Typography)(({ theme }) => ({
  ...theme.typography.subtitle2,
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(1),
}));

// ----------------------------------------------------------------------

EditDoc.propTypes = {
  depa: PropTypes.array,
};

export default function EditDoc({
  id2,
  educationplace2,
  workcertificate2,
  level2,
  degree2,
  description2,
  excellence2,
  workhistory2,
  education2,
  depa,
  department2,
}) {
  const navigate = useNavigate();

  const { enqueueSnackbar } = useSnackbar();

  const [depaa, setDepaa] = useState(null);

  const defaultValues = {
    description: description2 || '',
    educationplace: educationplace2 || '',
    workcertificate: workcertificate2 || '',
    level: level2 || '',
    degree: degree2 || '',
    excellence: excellence2 || '',
    workhistory: workhistory2 || '',
    education: education2 || '',
    departmentne: department2 || '',
  };
  // eslint-disable-next-line react-hooks/exhaustive-deps

  const methods = useForm({
    defaultValues,
  });

  const {
    reset,
    watch,
    control,
    setValue,
    getValues,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  const onSubmit = async (data) => {
    try {
      await axios.put(`/api/admin/doctor/updateDoctor/${id2}`, {
        description: data.description,
        educationplace: data.educationplace,
        workcertificate: data.workcertificate,
        excellence: data.excellence,
        level: data.level,
        workhistory: data.workhistory,
        education: data.education,
        degree: data.degree,
        department: data.departmentne !== '' ? data.departmentne : depa[0].name,
      });
      enqueueSnackbar('Cập nhật thông tin bác sĩ thành công!');
      navigate(PATH_DASHBOARD.user.doclist);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={12}>
          <Card sx={{ p: 3 }}>
            <Stack alignItems="flex-end">
              <Controller
                name="departmentne"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <RHFSelect
                    onChange={(event) => setValue('departmentne', event.target.value)}
                    label="Chuyên khoa"
                    name="departmentne"
                  >
                    <option disabled selected>
                      Vui lòng chọn chuyên khoa
                    </option>
                    {depa.map((option, index) => (
                      <option key={option._id} value={option.name}>
                        {option.name}
                      </option>
                    ))}
                  </RHFSelect>
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

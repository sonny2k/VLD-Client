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

export default function EditDoc({ id, educationplace, workcertificate,level,degree,description,excellence,workhistory,education, depa, department }) {
  const navigate = useNavigate();

  const { enqueueSnackbar } = useSnackbar();

  const [depaa, setDepaa] = useState(null);


  const NewCategorySchema = Yup.object().shape({
  });

  const defaultValues = useMemo(
    () => ({
      description: description || '',
      educationplace: educationplace || '',
      workcertificate: workcertificate || '',
      level: level || '',
      degree: degree || '',
      excellence: excellence || '',
      workhistory: workhistory || '',
      education: education || '',
      department: department || '',
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  );

  const methods = useForm({
    resolver: yupResolver(NewCategorySchema),
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
        await axios.put(`/api/admin/doctor/updateDoctor/${id}`, {
          description: data.description,
          educationplace: data.educationplace,
          workcertificate: data.workcertificate,
          excellence: data.excellence,
          level: data.level,
          workhistory: data.workhistory,
          education: data.education,
          degree: data.degree,
          department: data.department !== '' ? data.department : depa[0].name,
        });
        enqueueSnackbar('Cập nhật thông tin bác sĩ thành công');
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
            <Stack spacing={3}>
            <Box
                sx={{
                  display: 'grid',
                  rowGap: 3,
                  columnGap: 2,
                  gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' },
                }}
              >
            <RHFSelect loading={!depa.length} label="Chuyên khoa" name="department">
                  <option disabled selected>
                    Vui lòng chọn chuyên khoa
                  </option>
                  {depa.map((option, index) => (
                    <option key={index} value={option.name}>
                      {option.name}
                    </option>
                  ))}
              </RHFSelect>              
              <RHFTextField name="educationplace" label="Nơi tốt nghiệp" />
              <RHFTextField name="workcertificate" label="Chứng chỉ " />
              <RHFTextField name="excellence" label="Chuyên môn " />
              <RHFTextField name="level" label="Cấp bậc " />
              <RHFTextField name="description" label="Mô tả" />
              <RHFTextField name="degree" label="Bằng cấp " />
              <RHFTextField name="workhistory" label="Lịch sử làm việc " />
              <RHFTextField name="education" label="Quá trình đào tạo " />
              </Box>
              <div>
                <Stack spacing={3} alignItems="flex-end" sx={{ mt: 3 }}>
                  <LoadingButton type="submit" variant="contained" size="large" loading={isSubmitting}>
                    Lưu thay đổi
                  </LoadingButton>
                </Stack>
              </div>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}

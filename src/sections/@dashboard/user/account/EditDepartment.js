import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
import { useCallback, useEffect, useMemo } from 'react';
// form
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { styled } from '@mui/material/styles';
import { LoadingButton } from '@mui/lab';
import { Card, Chip, Grid, Stack, TextField, Typography, Autocomplete, InputAdornment } from '@mui/material';
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

EditDepartment.propTypes = {
  isEdit: PropTypes.bool,
};

export default function EditDepartment({ isEdit, name, description, id }) {
  const navigate = useNavigate();

  const { enqueueSnackbar } = useSnackbar();



  const NewDepartmentSchema = Yup.object().shape({
    name: Yup.string().required('Cần nhập tên chuyên khoa'),
    // description: Yup.string().required('Description is required'),
  });

  const defaultValues = useMemo(
    () => ({
      name: name || '',
      description: description || '',
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
  );

  const methods = useForm({
    resolver: yupResolver(NewDepartmentSchema),
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
      if ( isEdit === true) {
        await axios.put(`/api/admin/department/updateDepartment/${id}`, {
          name: data.name,
          description: data.description,
        });
        enqueueSnackbar('Cập nhật chuyên khoa thành công');
        navigate(PATH_DASHBOARD.user.department);
      } else {
        await axios.post("/api/admin/department/createDepartment", {
          name: data.name,
          description: data.description,
        })
        enqueueSnackbar('Tạo chuyên khoa thành công');
      navigate(PATH_DASHBOARD.user.department);
      }      
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
              <RHFTextField name="name" label="Tên chuyên khoa" />

              <div>
                <RHFTextField placeholder='Viết gì đó vào đây...' multiline rows={4} name="description" label="Mô tả" />
              </div>

              <div>
              <Stack spacing={3} alignItems="flex-end" sx={{ mt: 3 }}>
                <LoadingButton type="submit" variant="contained" size="large" loading={isSubmitting}>
                  {!isEdit === true ? 'Tạo chuyên khoa' : 'Lưu thay đổi'}
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

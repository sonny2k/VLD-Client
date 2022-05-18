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

EditDoc.propTypes = {
  isEdit: PropTypes.bool,
};

export default function EditDoc({ isEdit, fname, lname, phone, id }) {
  const navigate = useNavigate();

  const { enqueueSnackbar } = useSnackbar();

  const NewCategorySchema = Yup.object().shape({
    // description: Yup.string().required('Description is required'),
  });

  const defaultValues = useMemo(
    () => ({
      lname: lname || '',
      fname: fname || '',
      phone: phone || '',
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
      if (isEdit === true) {
        await axios.put(`/api/admin/product/updateProductCategory/${id}`, {
          fname: data.fname,
          lname: data.lname,
          phone: data.phone,
        });
        enqueueSnackbar('Cập nhật danh mục thành công');
        navigate(PATH_DASHBOARD.user.doclist);
      } else {
        await axios.post('/api/admin/product/createProductCategory', {
          fname: data.fname,
          lname: data.lname,
          phone: data.phone,
        });
        enqueueSnackbar('Tạo danh mục thành công');
        navigate(PATH_DASHBOARD.user.doclist);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={9}>
          <Card sx={{ p: 3 }}>
            <Stack spacing={3}>
              <RHFTextField name="lname" label="Họ " />
              <RHFTextField name="fname" label="Tên" />
              <RHFTextField name="phone" label="Số điện thọai " />
              <div>
                <Stack spacing={3} alignItems="flex-end" sx={{ mt: 3 }}>
                  <LoadingButton type="submit" variant="contained" size="large" loading={isSubmitting}>
                    {!isEdit === true ? 'Tạo danh mục' : 'Lưu thay đổi'}
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

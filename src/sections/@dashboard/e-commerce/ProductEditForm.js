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
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// utils
import axios from '../../../utils/axios';
// components
import {
  FormProvider,
  RHFSwitch,
  RHFSelect,
  RHFEditor,
  RHFTextField,
  RHFRadioGroup,
  RHFUploadMultiFile,
  RHFUploadAvatar,
} from '../../../components/hook-form';

// ----------------------------------------------------------------------

const LabelStyle = styled(Typography)(({ theme }) => ({
  ...theme.typography.subtitle2,
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(1),
}));

// ----------------------------------------------------------------------

ProductNewForm.propTypes = {
  categories: PropTypes.array,
  origins: PropTypes.array,
};

export default function ProductNewForm({
  categories,
  id,
  title,
  description,
  specdes,
  unit,
  components,
  origins,
  image,
}) {
  const navigate = useNavigate();

  const { enqueueSnackbar } = useSnackbar();

  const NewProductSchema = Yup.object().shape({
    title: Yup.string().required('Vui lòng điền tên thuốc'),
    unit: Yup.string().required('Đơn vị tính là cần thiết'),
  });

  const defaultValues = useMemo(
    () => ({
      title: title || '',
      description: description || '',
      specdes: specdes || '',
      unit: unit || '',
      components: components || '',
      origin: origin || '',
      image: image || '',
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  );

  const methods = useForm({
    resolver: yupResolver(NewProductSchema),
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
      await axios.put(`/api/admin/product/updateProduct/${id}`, {
        title: data.title,
        description: data.description,
        specdes: data.specdes,
        unit: data.unit,
        components: data.components,
        origin: data.origin,
        image: data.image,
      });
      enqueueSnackbar('Cập nhật sản phẩm thành công');
      navigate(PATH_DASHBOARD.user.productlist);
    } catch (error) {
      console.error(error);
    }
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
          'image',
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
      await axios.post(`/api/admin/product/image/${id}`, {
        pic,
      });
    } catch (err) {
      console.error(err);
      enqueueSnackbar('Có lỗi xảy ra, vui lòng thử lại!', {
        variant: 'error',
      });
    }
  };

  return (
    <FormProvider methods={methods}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={12}>
          <Card sx={{ p: 3 }}>
            <Stack spacing={3}>
              <RHFTextField name="title" label="Tên sản phẩm" />

              <div>
                <RHFTextField multiline rows={4} name="description" label="Mô tả sản phẩm" />
              </div>

              <div>
                <RHFSelect loading={!categories.length} name="category" label="Loại thuốc">
                  {categories.map((option) => (
                    <option key={option._id}>{option.name}</option>
                  ))}
                </RHFSelect>
              </div>

              <div>
                <RHFTextField name="specdes" label="Quy cách thuốc" />
              </div>

              <div>
                <RHFTextField name="unit" label="Đơn vị tính" />
              </div>

              <div>
                <RHFTextField name="components" label="Thành phần thuốc" />
              </div>

              <div>
              <RHFSelect loading={!origins.length} name="origin" label="Nhà sản xuất">
                  {origins.map((option) => (
                    <option key={option._id}>{option.name}</option>
                  ))}
                </RHFSelect>
              </div>

              <div>
                <LabelStyle>Hình ảnh</LabelStyle>
                <RHFUploadAvatar name="image" accept="image/*" maxSize={3145728} onDrop={handleDrop} type="file" />
              </div>
              <div>
                <Stack spacing={3} alignItems="flex-end" sx={{ mt: 3 }}>
                  <LoadingButton
                    type="submit"
                    variant="contained"
                    size="large"
                    loading={isSubmitting}
                    onClick={handleSubmit(onSubmit)}
                  >
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

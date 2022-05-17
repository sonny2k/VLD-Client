import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useCallback, useState } from 'react';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
// form
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, Controller } from 'react-hook-form';
// @mui
import { LoadingButton } from '@mui/lab';
import { styled } from '@mui/material/styles';
import { Grid, Card, Chip, Stack, Button, TextField, Typography, Autocomplete } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// utils
import axios from '../../../utils/axios';
// components
import { RHFSwitch, RHFEditor, FormProvider, RHFTextField, RHFUploadSingleFile, RHFSelect } from '../../../components/hook-form';
//
import BlogNewPostPreview from './BlogNewPostPreview';

// ----------------------------------------------------------------------
const LabelStyle = styled(Typography)(({ theme }) => ({
  ...theme.typography.subtitle2,
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(1),
}));

// ----------------------------------------------------------------------
BlogNewPostForm.propTypes = {
  artcategories: PropTypes.array,
};

export default function BlogNewPostForm( {artcategories} ) {
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);

  const { enqueueSnackbar } = useSnackbar();

  const handleOpenPreview = () => {
    setOpen(true);
  };

  const handleClosePreview = () => {
    setOpen(false);
  };

  const NewBlogSchema = Yup.object().shape({
    title: Yup.string().required('Tiêu đề là cần thần'),
    briefdescription: Yup.string().required('Hãy điền mô tả ngắn'),
    content: Yup.string().max(1000).required('Nội dung dưới 1000 kí tự'),
  });

  const defaultValues = {
    title: '',
    briefdescription: '',
    content: '',
    articlecategory: '',
    cover: null,
    publish: true,
  };

  const methods = useForm({
    resolver: yupResolver(NewBlogSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    control,
    setValue,
    handleSubmit,
    formState: { isSubmitting, isValid },
  } = methods;

  const values = watch();

  const onSubmit = async (data) => {
    try {
      await axios.post('/api/admin/article/createArticle', {
        title: data.title,
        briefdescription: data.briefdescription,
        content: data.content,
        category: data.categoryne !== '' ? data.categoryne : artcategories[0].name,
        banner: data.banner,
        status: data.status,
        datecreate: data.datecreate,
        relevantarticles: data.relevantarticles,
        publish: data.publish,
        hourofpublish: data.hourofpublish,
      });
      enqueueSnackbar('Tạo tin tức thành công');
      navigate(PATH_DASHBOARD.user.articlelist);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];

      if (file) {
        setValue(
          'banner',
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        );
      }
    },
    [setValue]
  );

  return (
    <>
      <FormProvider methods={methods} >
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Card sx={{ p: 3 }}>
              <Stack spacing={3}>
                <RHFTextField name="title" label="Tiêu đề" />

                <RHFSelect name="articlecategory" label="Loại tin tức">
                  {artcategories.map((option) => (
                    <option key={option._id}>{option.name}</option>
                  ))}
                </RHFSelect>

                <RHFTextField name="briefdescription" label="Mô tả ngắn" multiline rows={3} />

                <div>
                  <LabelStyle>Nội dung tin tức</LabelStyle>
                  <RHFEditor name="content" placeholder="Điền nôi dung cho tin tức" />
                </div>

                <div>
                  <LabelStyle>Hình ảnh</LabelStyle>
                  <RHFUploadSingleFile name="banner" accept="image/*" maxSize={3145728} onDrop={handleDrop} />
                </div>
              </Stack>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card sx={{ p: 3 }}>
              <Stack spacing={3}>
                <div>
                  <RHFSwitch
                    name="publish"
                    label="Công khai"
                    labelPlacement="start"
                    sx={{ mb: 1, mx: 0, width: 1, justifyContent: 'space-between' }}
                  />
                </div>
              </Stack>
            </Card>

            <Stack direction="row" spacing={1.5} sx={{ mt: 3 }}>
              <Button fullWidth color="inherit" variant="outlined" size="large" onClick={handleOpenPreview}>
                Xem trước
              </Button>
              <LoadingButton fullWidth type="submit" variant="contained" size="large" loading={isSubmitting} onClick={handleSubmit(onSubmit)}>
                Đăng tin tức
              </LoadingButton>
            </Stack>
          </Grid>
        </Grid>
      </FormProvider>

      <BlogNewPostPreview
        values={values}
        isOpen={open}
        isValid={isValid}
        isSubmitting={isSubmitting}
        onClose={handleClosePreview}
        onSubmit={handleSubmit(onSubmit)}
      />
    </>
  );
}

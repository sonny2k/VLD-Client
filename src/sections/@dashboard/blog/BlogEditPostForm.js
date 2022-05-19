import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useCallback, useState, useMemo } from 'react';
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
import {
  RHFSwitch,
  RHFEditor,
  FormProvider,
  RHFTextField,
  RHFUploadSingleFile,
  RHFSelect,
} from '../../../components/hook-form';
//
import BlogNewPostPreview from './BlogNewPostPreview';

// ----------------------------------------------------------------------
const LabelStyle = styled(Typography)(({ theme }) => ({
  ...theme.typography.subtitle2,
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(1),
}));

// ----------------------------------------------------------------------
BlogEditPostForm.propTypes = {
  artcategories: PropTypes.array,
};

export default function BlogEditPostForm({ artcategories, id, title, briefdescription, content, banner, articlecategory }) {
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);

  const [btn, setBtn] = useState('Lưu thay đổi');

  const [imageUrl, setimageUrl] = useState('');

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
    content: Yup.string().required('Vui lòng nhập nội dung'),
  });

  const defaultValues = useMemo(
    () => ({
    title: title || '',
    briefdescription: briefdescription || '',
    content: content || '',
    articlecategory: articlecategory || '',
    banner: banner || null,
    publish: true,
    }),
  );

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
    const created = new Date();
    try {
      await axios.put(`/api/admin/article/updateArticle/${id}`, {
        title: data.title,
        briefdescription: data.briefdescription,
        content: data.content,
        articlecategory: data.articlecategory !== '' ? data.articlecategory : artcategories[0]._id,
        banner: imageUrl,
        status: 1,
        createdat: created,
      });
      enqueueSnackbar('Cập nhật tin tức thành công');
      navigate(PATH_DASHBOARD.user.articlelist);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSwitch = (event) => {
    if (event.target.value === false) {
      setBtn('Lưu nháp');
    }
    if (event.target.value === true) {
      setBtn('Lưu thay đổi');
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
          'banner',
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
      const img = await axios.post(`/api/admin/product/image`, {
        pic,
      });
      setimageUrl(img.data);
    } catch (err) {
      console.error(err);
      enqueueSnackbar('Có lỗi xảy ra, vui lòng thử lại!', {
        variant: 'error',
      });
    }
  };

  return (
    <>
      <FormProvider methods={methods}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Card sx={{ p: 3 }}>
              <Stack spacing={3}>
                <RHFTextField name="title" label="Tiêu đề" />

                <RHFSelect name="articlecategory" label="Loại tin tức">
                  {artcategories.map((option) => (
                    <option value={option._id} key={option._id}>
                      {option.name}
                    </option>
                  ))}
                </RHFSelect>

                <RHFTextField name="briefdescription" label="Mô tả ngắn" multiline rows={3} />

                <div>
                  <LabelStyle>Nội dung tin tức</LabelStyle>
                  <RHFEditor name="content" placeholder="Điền nôi dung cho tin tức" />
                </div>

                <div>
                  <LabelStyle>Ảnh bìa</LabelStyle>
                  <RHFUploadSingleFile
                    name="banner"
                    accept="image/*"
                    maxSize={3145728}
                    onDrop={handleDrop}
                    type="file"
                  />
                </div>
              </Stack>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            {/* <Card sx={{ p: 3 }}>
              <Stack spacing={3}>
                <div>
                  <RHFSwitch
                    name="publish"
                    label="Công khai bài đăng"
                    onClick={handleSwitch}
                    labelPlacement="start"
                    sx={{ mb: 1, mx: 0, width: 1, justifyContent: 'space-between' }}
                  />
                </div>
              </Stack>
            </Card> */}

            <Stack direction="row" spacing={1.5} sx={{ mt: 3 }}>
              <Button fullWidth color="inherit" variant="outlined" size="large" onClick={handleOpenPreview}>
                Xem trước
              </Button>
              <LoadingButton
                fullWidth
                type="submit"
                variant="contained"
                size="large"
                loading={isSubmitting}
                onClick={handleSubmit(onSubmit)}
              >
                {btn}
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

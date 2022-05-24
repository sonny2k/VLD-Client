import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useCallback, useState, useMemo, useRef } from 'react';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import { styled, useTheme } from '@mui/material/styles';
// form
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
// @mui
import {
  Grid,
  Card,
  Stack,
  Button,
  Typography,
  Box,
  ButtonGroup,
  Grow,
  Paper,
  Popper,
  MenuItem,
  MenuList,
} from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// utils
import axios from '../../../utils/axios';
// components
import { RHFEditor, FormProvider, RHFTextField, RHFUploadSingleFile, RHFSelect } from '../../../components/hook-form';
import Label from '../../../components/Label';
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

export default function BlogEditPostForm({
  artcategories,
  id,
  title,
  briefdescription,
  content,
  banner,
  articlecategory,
  status,
}) {
  const navigate = useNavigate();

  const theme = useTheme();

  const options = ['Lưu nháp', 'Đăng bài'];

  const [open, setOpen] = useState(false);

  const [selectedIndex, setSelectedIndex] = useState(1);

  const anchorRef = useRef(null);

  const [openbut, setOpenBut] = useState(false);

  const [imageUrl, setimageUrl] = useState(null);

  const { enqueueSnackbar } = useSnackbar();

  const handleMenuItemClick = (event, index) => {
    setSelectedIndex(index);
    setOpenBut(false);
  };

  const handleToggle = () => {
    setOpenBut((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }

    setOpenBut(false);
  };

  const handleOpenPreview = () => {
    setOpen(true);
  };

  const handleClosePreview = () => {
    setOpen(false);
  };

  const NewBlogSchema = Yup.object().shape({
    title: Yup.string().required('Tiêu đề là cần thiết'),
    briefdescription: Yup.string().required('Hãy điền mô tả ngắn'),
    content: Yup.string().required('Vui lòng nhập nội dung'),
  });

  const defaultValues = useMemo(() => ({
    title: title || '',
    briefdescription: briefdescription || '',
    content: content || '',
    articlecategory: articlecategory._id || '',
    banner: banner || null,
    publish: true,
  }));

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
      if (selectedIndex === 1) {
        await axios.put(`/api/admin/article/updateArticle/${id}`, {
          title: data.title,
          briefdescription: data.briefdescription,
          content: data.content,
          articlecategory: data.articlecategory !== '' ? data.articlecategory : artcategories[0]._id,
          banner: imageUrl !== null ? imageUrl : banner,
          status: 1,
          createdat: created,
        });
        enqueueSnackbar('Cập nhật tin tức thành công!');
        navigate(PATH_DASHBOARD.user.articlelist);
      } else if (selectedIndex === 0) {
        await axios.put(`/api/admin/article/updateArticle/${id}`, {
          title: data.title,
          briefdescription: data.briefdescription,
          content: data.content,
          articlecategory: data.articlecategory !== '' ? data.articlecategory : artcategories[0]._id,
          banner: imageUrl !== null ? imageUrl : banner,
          status: 0,
          createdat: created,
        });
        enqueueSnackbar('Cập nhật tin tức thành công!');
        navigate(PATH_DASHBOARD.user.articlelist);
      }
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
        <Grid container spacing={2}>
          <Grid item xs={12} md={7}>
            <Card sx={{ p: 3 }}>
              <Stack spacing={3}>
                <Box sx={{ textAlign: { sm: 'right' } }}>
                  <Label
                    variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
                    color={(status === 1 && 'success') || (status === 0 && 'warning')}
                    sx={{ textTransform: 'uppercase', color: 'Black' }}
                  >
                    <h2>{status === 1 ? 'Công khai' : 'Nháp'}</h2>
                  </Label>
                </Box>
                <RHFTextField name="title" label="Tiêu đề" />

                <RHFSelect name="articlecategory" label="Loại tin tức">
                  {artcategories.map((option) => (
                    <option value={option._id} key={option.name}>
                      {option.name}
                    </option>
                  ))}
                </RHFSelect>

                <RHFTextField name="briefdescription" label="Mô tả ngắn" multiline rows={3} />

                <div>
                  <LabelStyle>Nội dung tin tức</LabelStyle>
                  <RHFEditor name="content" placeholder="Điền nội dung cho tin tức" />
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

          <Grid item xs={12} md={5}>
            <Stack direction="row" spacing={1.5} sx={{ mt: 3 }}>
              <Button color="inherit" variant="outlined" size="large" onClick={handleOpenPreview}>
                Xem trước
              </Button>
              <ButtonGroup variant="contained" ref={anchorRef} aria-label="split button">
                <Button fullWidth size="large" onClick={handleSubmit(onSubmit)}>
                  {options[selectedIndex]}
                </Button>
                <Button
                  size="small"
                  aria-controls={openbut ? 'split-button-menu' : undefined}
                  aria-expanded={openbut ? 'true' : undefined}
                  aria-label="select merge strategy"
                  aria-haspopup="menu"
                  onClick={handleToggle}
                >
                  <ArrowDropDownIcon />
                </Button>
              </ButtonGroup>
              <Popper open={openbut} anchorEl={anchorRef.current} role={undefined} transition disablePortal>
                {({ TransitionProps, placement }) => (
                  <Grow
                    {...TransitionProps}
                    style={{
                      transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom',
                    }}
                  >
                    <Paper>
                      <ClickAwayListener onClickAway={handleClose}>
                        <MenuList id="split-button-menu" autoFocusItem>
                          {options.map((option, index) => (
                            <MenuItem
                              key={option}
                              disabled={index === 2}
                              selected={index === selectedIndex}
                              onClick={(event) => handleMenuItemClick(event, index)}
                            >
                              {option}
                            </MenuItem>
                          ))}
                        </MenuList>
                      </ClickAwayListener>
                    </Paper>
                  </Grow>
                )}
              </Popper>
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

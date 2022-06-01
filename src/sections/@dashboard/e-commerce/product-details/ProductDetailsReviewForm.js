import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useSnackbar } from 'notistack';
// form
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { styled } from '@mui/material/styles';
import { Button, Stack, Rating, Typography, FormHelperText } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import axios from '../../../../utils/axios';
// hook

// components
import { FormProvider, RHFTextField } from '../../../../components/hook-form';

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  margin: theme.spacing(3),
  padding: theme.spacing(3),
  borderRadius: Number(theme.shape.borderRadius) * 2,
  backgroundColor: theme.palette.background.neutral,
}));

// ----------------------------------------------------------------------

ProductDetailsReviewForm.propTypes = {
  onClose: PropTypes.func,
  id: PropTypes.string,
};

export default function ProductDetailsReviewForm({ onClose, id, doctor, ...other }) {
  const { enqueueSnackbar } = useSnackbar();

  const ReviewSchema = Yup.object().shape({
    star: Yup.mixed().required('Vui lòng chọn sao cho đánh giá'),
    content: Yup.string().required('Vui lòng nhập nội dung đánh giá'),
  });

  const defaultValues = {
    star: null,
    content: '',
  };

  const methods = useForm({
    resolver: yupResolver(ReviewSchema),
    defaultValues,
  });

  const {
    reset,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = methods;

  const createdDate = new Date();

  const onSubmit = async (data) => {
    try {
      await axios.post('/api/user/doctor/rating', {
        content: data.content,
        star: data.star,
        date: createdDate,
        doctor,
      });
      reset();
      onClose();
      enqueueSnackbar('Đánh giá sẽ được xem xét bởi đội ngũ Văn Lang Doctor, cảm ơn bạn đã sử dụng dịch vụ!');
    } catch (error) {
      console.error(error);
    }
  };

  const onCancel = () => {
    onClose();
    reset();
  };

  return (
    <RootStyle {...other} id={id}>
      <Typography variant="subtitle1" gutterBottom>
        Thêm nhận xét
      </Typography>

      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={3}>
          <div>
            <Stack direction="row" flexWrap="wrap" alignItems="center" spacing={1.5}>
              <Typography variant="body2">Đánh giá của bạn về bác sĩ:</Typography>

              <Controller
                name="star"
                control={control}
                render={({ field }) => <Rating {...field} value={Number(field.value)} />}
              />
            </Stack>
            {!!errors.rating && <FormHelperText error> {errors.rating?.message}</FormHelperText>}
          </div>

          <RHFTextField name="content" label="Nhận xét của bạn *" multiline rows={4} />

          <Stack direction="row" justifyContent="flex-end" spacing={1.5}>
            <Button color="inherit" variant="outlined" onClick={onCancel}>
              Hủy
            </Button>
            <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
              Đăng nhận xét
            </LoadingButton>
          </Stack>
        </Stack>
      </FormProvider>
    </RootStyle>
  );
}

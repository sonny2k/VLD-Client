// @mui
import { Button, Typography, TextField, Stack } from '@mui/material';
// components
import { useMemo } from 'react';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { varFade } from '../../components/animate';
import axios from '../../utils/axios';
import { FormProvider, RHFTextField } from '../../components/hook-form';
import { PATH_DASHBOARD, PATH_PAGE } from '../../routes/paths';
// ----------------------------------------------------------------------

export default function ContactForm(name, email, subject, text) {
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const newContactSchema = Yup.object().shape({
    name: Yup.string().required('Không được bỏ trống tên'),
    email: Yup.string().required('Không được bỏ trống email'),
    subject: Yup.string().required('Phải ghi chủ đề rõ ràng'),
    text: Yup.string().required('Không được bỏ trống chỗ này'),
    // description: Yup.string().required('Description is required'),
  });
  const methods = useForm({
    resolver: yupResolver(newContactSchema),
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
  const onSubmit = async (data) => {
    try {
      await axios.post('/api/sendEmail/email/send', {
        name: data.name,
        email: data.email,
        subject: data.subject,
        text: data.text,
      });
      enqueueSnackbar('Gửi email thành công');
      // navigate(PATH_PAGE.contact);
      window.location.reload();
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <FormProvider methods={methods}>
      <Stack spacing={5}>
        <Typography variant="h3">
          Hãy liên hệ cho chúng tôi <br />
          Chúng tôi rất vui khi được lắng nghe bạn.
        </Typography>

        <Stack spacing={3}>
          <RHFTextField name="name" fullWidth label="Họ tên" />

          <RHFTextField name="email" fullWidth label="Email" />

          <RHFTextField name="subject" fullWidth label="Chủ đề" />

          <RHFTextField name="text" fullWidth label="Để lại lời nhắn ở đây" multiline rows={4} />
        </Stack>

        <Button size="large" variant="contained" onClick={handleSubmit(onSubmit)}>
          Gửi
        </Button>
      </Stack>
    </FormProvider>
  );
}

// @mui
import { useSnackbar } from 'notistack';
import { Button, Typography, Stack } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import axios from '../../utils/axios';
import { varFade } from '../../components/animate';
import { FormProvider, RHFTextField } from '../../components/hook-form';
import { PATH_DASHBOARD, PATH_PAGE } from '../../routes/paths';
// ----------------------------------------------------------------------

export default function FaqsForm(name, email, subject, text) {
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const newFaqSchema = Yup.object().shape({
    name: Yup.string().required('Không được bỏ trống tên'),
    email: Yup.string().required('Không được bỏ trống email'),
    subject: Yup.string().required('Phải ghi chủ đề rõ ràng'),
    text: Yup.string().required('Không được bỏ trống chỗ này'),
    // description: Yup.string().required('Description is required'),
  });
  const methods = useForm({
    resolver: yupResolver(newFaqSchema),
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
      enqueueSnackbar('Gửi câu hỏi thành công');
      window.location.reload();
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <FormProvider methods={methods}>
      <Stack spacing={3}>
        <Typography variant="h4">Hãy đặt câu hỏi cho chúng tôi.</Typography>

        <RHFTextField name="name" fullWidth label="Họ và tên" />

        <RHFTextField name="email" fullWidth label="Email" />

        <RHFTextField name="subject" fullWidth label="Chủ đề" />

        <RHFTextField name="text" fullWidth label="Nhập câu hỏi vào đây" multiline rows={4} />

        <Button size="large" variant="contained" onClick={handleSubmit(onSubmit)}>
          Gửi
        </Button>
      </Stack>
    </FormProvider>
  );
}

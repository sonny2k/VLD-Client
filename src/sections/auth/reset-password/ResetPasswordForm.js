import PropTypes from 'prop-types';
import * as Yup from 'yup';
import 'yup-phone';
import { useSnackbar } from 'notistack';
import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";

// form
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
// @mui
import { Stack, IconButton, InputAdornment, Alert, Divider } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// hooks
import useAuth from '../../../hooks/useAuth';
import useIsMountedRef from '../../../hooks/useIsMountedRef';
// components
import Iconify from '../../../components/Iconify';
import { FormProvider, RHFTextField } from '../../../components/hook-form';
// utils
import axios from '../../../utils/axios';
// ----------------------------------------------------------------------

ResetPasswordForm.propTypes = {
  onSent: PropTypes.func,
  onGetPhone: PropTypes.func,
};

export default function ResetPasswordForm() {
  const navigate = useNavigate();

  const { enqueueSnackbar } = useSnackbar();

  const { resetpassword } = useAuth();

  const isMountedRef = useIsMountedRef();

  const [showPassword2, setShowPassword2] = useState(false);

  const [showPassword, setShowPassword] = useState(false);

  const ResetPasswordSchema = Yup.object().shape({
    phone: Yup.string().phone('VN', true, 'Số điện thoại không hợp lệ'),
    password: Yup.string().min(8, "Vui lòng nhập mật khẩu từ 8 ký tự trở lên và chứa ít nhất 1 số")
    .matches(/(?=.*[0-9])/, "Mật khẩu phải chứa ít nhất một số.").required('Mật khẩu là bắt buộc'),
    passwordConfirmation: Yup.string().oneOf([Yup.ref('password'), null], 'Mật khẩu không khớp').required('Nhập lại mật khẩu là bắt buộc'),
  });

  const defaultValues = {
    phone: '',
    password: '',
    passwordConfirmation: '',
  };

  const methods = useForm({
    resolver: yupResolver(ResetPasswordSchema),
    defaultValues,
  });

  const [ message, setMessage ] = useState('')

  const {
    reset, 

    setError,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = methods;

  const sendcode = async (phone) => {
    await axios.post('api/user/auth/sendcode', {
      phone,
    });
  }

  const verifycode = async (phone, code) => {
    const res = await axios.post('api/user/auth/verifycode', {
      phone,
      code,
    });
    const mes = res.data;
    setMessage(mes);
  };

  useEffect(() => {
    const ver = async () => {
      if (message) {
        if (message.message === 'pending') {
          enqueueSnackbar('Sai mã xác minh, xin thử lại');
        }
        if (message.message === "approved") {
          handleSubmit(resetp)();
        }
      }
    };
    
    ver();
  }, [message]);

  const resetp = async (data) => {
    try {
      const phone = `+84${data.phone.slice(1)}`;
      await resetpassword(phone, data.password);
      enqueueSnackbar('Cập nhật mật khẩu thành công, vui lòng đăng nhập lại!');
      navigate('/auth/login');
    } catch (error) {
      console.error(error);
      if (isMountedRef.current) {
        setError('afterSubmit', error);
      } 
    }
  };

  const onSubmit = async (data) => {
    try {
      const phone = `+84${data.phone.slice(1)}`
      await verifycode(phone, data.code);
    } catch (error) {
      console.error(error);
      if (isMountedRef.current) {
        setError('afterSubmit', error);
      } 
    }
  };

  const sc = async (data) => {
    try {
      const phonenum = `+84${data.phone.slice(1)}` 
      await sendcode(phonenum)
      enqueueSnackbar('Mã đã được gửi vào số điện thoại của bạn!');
    } catch (error) {
      console.error(error);
      reset();
      if (isMountedRef.current) {
        setError('afterSubmit', error);
      }
    }
  }

  return (
    <FormProvider methods={methods} >
      <Stack spacing={3}>
        {!!errors.afterSubmit && <Alert severity="error">{errors.afterSubmit.message}</Alert>}

        <RHFTextField name="phone" label="Số điện thoại" />

        <RHFTextField
          name="password"
          label="Mật khẩu mới"
          type={showPassword ? 'text' : 'password'}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton edge="end" onClick={() => setShowPassword(!showPassword)}>
                  <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <RHFTextField
          name="passwordConfirmation"
          label="Nhập lại mật khẩu mới"
          type={showPassword2 ? 'text' : 'password'}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton edge="end" onClick={() => setShowPassword2(!showPassword2)}>
                  <Iconify icon={showPassword2 ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <Stack 
          direction={{ xs: 'column', sm: 'row' }} 
          divider={<Divider orientation="vertical" flexItem />}
          spacing={2}
        >
          <RHFTextField name="code" label="Mã xác minh" />
          <LoadingButton fullWidth size="medium" variant="text" onClick={handleSubmit(sc)}>
            Gửi mã xác minh
          </LoadingButton>
        </Stack>

        <LoadingButton id='dk' fullWidth size="large" type="submit" variant="contained" loading={isSubmitting} onClick={handleSubmit(onSubmit)}>
          Khôi phục mật khẩu
        </LoadingButton>
      </Stack>
    </FormProvider>
  );
}

import PropTypes from 'prop-types';
import * as Yup from 'yup';
import 'yup-phone';
import { useState } from 'react';

// form
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
// @mui
import { Stack, IconButton, InputAdornment, Alert, Divider } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// hooks
import useIsMountedRef from '../../../hooks/useIsMountedRef';
// components
import Iconify from '../../../components/Iconify';
import { FormProvider, RHFTextField } from '../../../components/hook-form';

// ----------------------------------------------------------------------

ResetPasswordForm.propTypes = {
  onSent: PropTypes.func,
  onGetPhone: PropTypes.func,
};

export default function ResetPasswordForm({ onSent, onGetPhone }) {
  const isMountedRef = useIsMountedRef();

  const [showPassword2, setShowPassword2] = useState(false);

  const [showPassword, setShowPassword] = useState(false);

  const ResetPasswordSchema = Yup.object().shape({
    phone: Yup.string().phone('VN', true, 'Số điện thoại không hợp lệ'),
  });

  const methods = useForm({
    resolver: yupResolver(ResetPasswordSchema),
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (data) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      if (isMountedRef.current) {
        onSent();
        onGetPhone(data.phone);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={3}>
        <RHFTextField name="phone" label="Số điện thoại" />

        <RHFTextField
          name="password"
          label="Mật khẩu"
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
          label="Nhập lại mật khẩu"
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
          <LoadingButton fullWidth size="medium" variant="text" onClick={handleSubmit()}>
            Gửi mã xác minh
          </LoadingButton>
        </Stack>

        <LoadingButton fullWidth size="large" type="submit" variant="contained" loading={isSubmitting}>
          Khôi phục mật khẩu
        </LoadingButton>
      </Stack>
    </FormProvider>
  );
}

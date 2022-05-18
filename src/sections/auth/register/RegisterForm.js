import * as Yup from 'yup';
import 'yup-phone';
import { useSnackbar } from 'notistack';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Stack, IconButton, InputAdornment, Alert, Divider } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { PATH_DASHBOARD } from '../../../routes/paths';
// hooks
import useAuth from '../../../hooks/useAuth';
import useIsMountedRef from '../../../hooks/useIsMountedRef';
// components
import Iconify from '../../../components/Iconify';
import { FormProvider, RHFTextField } from '../../../components/hook-form';
// utils
import axios from '../../../utils/axios';

// ----------------------------------------------------------------------

export default function RegisterForm() {
  const { enqueueSnackbar } = useSnackbar();

  const { register } = useAuth();

  const navigate = useNavigate();

  const isMountedRef = useIsMountedRef();

  const [showPassword2, setShowPassword2] = useState(false);

  const [showPassword, setShowPassword] = useState(false);

  const RegisterSchema = Yup.object().shape({
    firstName: Yup.string().matches(
      /^[a-zA-Z_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ]+$/,
      'Vui lòng điền tên chính xác'
    ),
    lastName: Yup.string().matches(
      /^[a-zA-Z_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ]+$/,
      'Vui lòng điền họ chính xác'
    ),
    phone: Yup.string()
      .min(10, 'Vui lòng nhập số điện thoại có 10 chữ số')
      .max(10, 'Vui lòng nhập số điện thoại có 10 chữ số')
      .phone('VN', true, 'Số điện thoại không hợp lệ'),
    password: Yup.string()
      .min(8, 'Vui lòng nhập mật khẩu từ 8 ký tự trở lên và chứa ít nhất 1 số')
      .matches(/(?=.*[0-9])/, 'Mật khẩu phải chứa ít nhất một số.')
      .required('Mật khẩu là bắt buộc'),
    passwordConfirmation: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Mật khẩu không khớp')
      .required('Nhập lại mật khẩu là bắt buộc'),
    // code: Yup.string()
    // .required('Vui lòng nhập mã xác minh')
    // .matches(/^[0-9]+$/, "Mã xác minh phải là số")
    // .min(6, 'Vui lòng nhập chính xác 6 ký tự của mã xác minh')
    // .max(6, 'Vui lòng nhập chính xác 6 ký tự của mã xác minh')
  });

  const defaultValues = {
    profilepic: '',
    firstName: '',
    lastName: '',
    birthday: new Date('2015-01-01'),
    gender: '',
    phone: '',
    password: '',
    passwordConfirmation: '',
    code: '',
    city: '',
    district: '',
    ward: '',
    street: '',
    role: 'Người dùng',
  };

  const methods = useForm({
    resolver: yupResolver(RegisterSchema),
    defaultValues,
  });

  const {
    reset,

    setError,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = methods;

  const [message, setMessage] = useState('');

  const sendcode = async (phone) => {
    await axios.post('api/user/auth/sendcode', {
      phone,
    });
  };

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
        if (message.message === 'Lỗi máy chủ') {
          enqueueSnackbar('Bạn chưa gửi mã xác minh hoặc mã xác minh không đúng định dạng, xin thử lại');
        }
        if (message.message === 'Số điện thoại đã được đăng ký ở tài khoản khác') {
          enqueueSnackbar('Số điện thoại đã được đăng ký ở tài khoản khác');
        }
        if (message.message === 'approved') {
          await handleSubmit(regis)();
        }
      }
    };

    ver();
  }, [message]);

  const regis = async (data) => {
    try {
      const phone = `+84${data.phone.slice(1)}`;
      await register(
        data.profilepic,
        data.birthday,
        data.gender,
        data.email,
        phone,
        data.password,
        data.firstName,
        data.lastName,
        data.city,
        data.district,
        data.ward,
        data.street,
        data.role
      );
      enqueueSnackbar('Tạo tài khoản thành công');
      navigate(PATH_DASHBOARD.user.account);
    } catch (error) {
      console.error(error);
      if (isMountedRef.current) {
        setError('afterSubmit', error);
      }
    }
  };

  const onSubmit = async (data) => {
    try {
      const phone = `+84${data.phone.slice(1)}`;
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
      setDisable(true);
      countDownBtn();
      const phonenum = `+84${data.phone.slice(1)}`;
      await sendcode(phonenum);
      enqueueSnackbar('Mã đã được gửi vào số điện thoại của bạn!');
    } catch (error) {
      console.error(error);
      if (isMountedRef.current) {
        setError('afterSubmit', error);
      }
    }
  };

  const [disable, setDisable] = useState(false);

  function countDownBtn() {
    let timeLeft = 7;
    const countDown = setInterval(() => {
      let text = document.getElementById('sco').text;
      if (timeLeft === 0) {
        clearInterval(countDown);
        text = 'Gửi mã xác minh';
        setDisable(false);
      } else {
        text = timeLeft;
      }
      timeLeft -= 1;
    }, 1000);
  }

  return (
    <FormProvider methods={methods}>
      <Stack spacing={3}>
        {!!errors.afterSubmit && <Alert severity="error">{errors.afterSubmit.message}</Alert>}

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <RHFTextField name="lastName" label="Họ" />
          <RHFTextField name="firstName" label="Tên" />
        </Stack>

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
          <LoadingButton
            disabled={disable}
            id="sco"
            fullWidth
            size="medium"
            variant="text"
            loading={isSubmitting}
            onClick={handleSubmit(sc)}
          >
            Gửi mã xác minh
          </LoadingButton>
        </Stack>

        <LoadingButton
          id="dk"
          fullWidth
          size="large"
          type="submit"
          variant="contained"
          loading={isSubmitting}
          onClick={handleSubmit(onSubmit)}
        >
          Đăng ký
        </LoadingButton>
      </Stack>
    </FormProvider>
  );
}

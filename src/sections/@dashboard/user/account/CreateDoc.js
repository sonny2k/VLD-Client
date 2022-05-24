import PropTypes from 'prop-types';

import * as Yup from 'yup';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
import { useCallback, useEffect, useMemo, useState } from 'react';
// form
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { styled } from '@mui/material/styles';
import { LoadingButton } from '@mui/lab';
import {
  Card,
  Chip,
  Grid,
  Stack,
  TextField,
  Typography,
  Autocomplete,
  InputAdornment,
  Box,
  Button,
} from '@mui/material';
import axios from '../../../../utils/axios';
// hooks
import useIsMountedRef from '../../../../hooks/useIsMountedRef';
// routes
import { PATH_DASHBOARD } from '../../../../routes/paths';
// components
import {
  FormProvider,
  RHFSwitch,
  RHFSelect,
  RHFEditor,
  RHFTextField,
  RHFRadioGroup,
  RHFUploadMultiFile,
} from '../../../../components/hook-form';

// ----------------------------------------------------------------------

const LabelStyle = styled(Typography)(({ theme }) => ({
  ...theme.typography.subtitle2,
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(1),
}));

// ----------------------------------------------------------------------

CreateDoc.propTypes = {
  isEdit: PropTypes.bool,
};

export default function CreateDoc({ fname, lname, id, phone, depa }) {
  const navigate = useNavigate();

  const { enqueueSnackbar } = useSnackbar();

  const [depaa, setDepaa] = useState(null);

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

  const isMountedRef = useIsMountedRef();

  const [disable, setDisable] = useState(false);

  const [message, setMessage] = useState('');

  const [createmessage, setCreateMessage] = useState(null);

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
      if (depaa === null || depaa === 'Vui lòng chọn chuyên khoa') {
        enqueueSnackbar('Vui lòng chọn chuyên khoa cho bác sĩ!', { variant: 'warning' });
      }
      if (depaa !== null && depaa !== 'Vui lòng chọn chuyên khoa') {
        if (message) {
          if (message.message === 'pending') {
            enqueueSnackbar('Sai mã xác minh, xin thử lại', { variant: 'error' });
          }
          if (message.message === 'Lỗi máy chủ') {
            enqueueSnackbar('Bạn chưa gửi mã xác minh hoặc mã xác minh không đúng định dạng, xin thử lại', {
              variant: 'error',
            });
          }
          if (message.message === 'Số điện thoại đã được đăng ký ở tài khoản khác') {
            enqueueSnackbar('Số điện thoại đã được đăng ký ở tài khoản khác', { variant: 'error' });
          }
          if (message.message === 'approved') {
            if (createmessage === null) {
              await handleSubmit(createDoc)();
            }

            if (createmessage !== null) {
              if (
                createmessage.success === false &&
                createmessage.message === 'Số điện thoại đã được đăng ký ở tài khoản khác'
              ) {
                enqueueSnackbar('Số điện thoại đã tồn tại', { variant: 'error' });
                reset({ phone: '' });
                setCreateMessage(null);
              }
              if (createmessage.success === true) {
                enqueueSnackbar('Tạo bác sĩ thành công!');
                navigate(PATH_DASHBOARD.user.doclist);
              }
              if (createmessage.success === false && createmessage.message === 'Lỗi tải dữ liệu') {
                enqueueSnackbar('Có lỗi xảy ra, vui lòng thử lại');
                reset();
                setCreateMessage(null);
              }
            }
          }
        }
      }
    };

    ver();
  }, [message, createmessage]);

  const createDoc = async (data) => {
    try {
      const phone = `+84${data.phone.slice(1)}`;
      const res = await axios.post('/api/admin/doctor/createDoctor', {
        fname: data.fname,
        lname: data.lname,
        phone,
        department: depaa,
      });
      const mes = res.data;
      setCreateMessage(mes);
    } catch (error) {
      console.error(error);
      if (isMountedRef.current) {
        setError('afterSubmit', error);
      }
    }
  };

  const defaultValues = {
    phone: '',
    lname: '',
    fname: '',
  };

  const NewDocSchema = Yup.object().shape({
    lname: Yup.string()
      .matches(
        /^[a-zA-Z_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ]+$/,
        'Vui lòng điền họ chính xác'
      )
      .max(255),
    fname: Yup.string().matches(
      /^[a-zA-Z_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ ,.'-]+$/u,
      'Vui lòng điền tên chính xác'
    ),
    phone: Yup.string()
      .min(10, 'Vui lòng nhập số điện thoại có 10 chữ số')
      .max(10, 'Vui lòng nhập số điện thoại có 10 chữ số')
      .phone('VN', true, 'Số điện thoại không hợp lệ'),
  });

  const methods = useForm({
    resolver: yupResolver(NewDocSchema),
    defaultValues,
  });

  const {
    reset,
    setError,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

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
      <Grid container spacing={3}>
        <Grid item xs={12} md={12}>
          <Card sx={{ p: 3 }}>
            <Stack spacing={3}>
              <Box
                sx={{
                  display: 'grid',
                  rowGap: 3,
                  columnGap: 2,
                  gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(3, 1fr)' },
                }}
              >
                <RHFTextField name="lname" label="Họ " />
                <RHFTextField name="fname" label="Tên" />
                <RHFTextField name="phone" label="Số điện thoại " />
              </Box>
              <Box
                sx={{
                  display: 'grid',
                  rowGap: 3,
                  columnGap: 2,
                  gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: '2fr 1fr' },
                }}
              >
                <RHFSelect onChange={(e) => setDepaa(e.target.value)} label="Chuyên khoa" name="department">
                  <option disabled selected>
                    Vui lòng chọn chuyên khoa
                  </option>
                  {depa.map((option, index) => (
                    <option key={index} value={option.name}>
                      {option.name}
                    </option>
                  ))}
                </RHFSelect>
                <RHFTextField name="code" label="Mã xác minh" />
              </Box>

              <div>
                <Stack justifyContent="flex-end" spacing={2} direction="row" sx={{ mt: 3 }}>
                  <Button
                    disabled={disable}
                    id="sco"
                    variant="outlined"
                    loading={isSubmitting}
                    onClick={handleSubmit(sc)}
                  >
                    Gửi mã xác minh
                  </Button>

                  <LoadingButton
                    type="submit"
                    variant="contained"
                    size="large"
                    loading={isSubmitting}
                    onClick={handleSubmit(onSubmit)}
                  >
                    Tạo bác sĩ
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

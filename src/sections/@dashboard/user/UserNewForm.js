import PropTypes from 'prop-types';
import * as React from 'react';
import * as Yup from 'yup';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
// form
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { LoadingButton, DesktopDatePicker } from '@mui/lab';
import {
  Box,
  Card,
  Grid,
  Stack,
  Switch,
  Typography,
  FormControlLabel,
  TextField,
  InputAdornment,
  IconButton,
} from '@mui/material';
// utils
import { fData } from '../../../utils/formatNumber';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// _mock
import { genders } from '../../../_mock/_gender';
// hooks
import useAuth from '../../../hooks/useAuth';
import useIsMountedRef from '../../../hooks/useIsMountedRef';
import useLocationForm from '../../../hooks/useLocationForm';

// components
import Label from '../../../components/Label';
import Iconify from '../../../components/Iconify';
import { FormProvider, RHFSelect, RHFSwitch, RHFTextField, RHFUploadAvatar } from '../../../components/hook-form';

// ----------------------------------------------------------------------

UserNewForm.propTypes = {
  isEdit: PropTypes.bool,
  currentUser: PropTypes.object,
};

export default function UserNewForm({ isEdit, currentUser }) {
  const { state, onCitySelect, onDistrictSelect, onWardSelect } = useLocationForm();

  const { cityOptions, districtOptions, wardOptions, selectedCity, selectedDistrict, selectedWard } = state;

  const [showPassword2, setShowPassword2] = useState(false);

  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const { enqueueSnackbar } = useSnackbar();

  const { register, res } = useAuth();

  const isMountedRef = useIsMountedRef();

  const NewUserSchema = Yup.object().shape({
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
    // gender: Yup.string().required('Gender is required'),
    // birthday: Yup.string().required('Birthday í required'),
    // street: Yup.string().required('Address is required'),
    // cityId: Yup.string().required('City is required'),
    // districtId: Yup.string().required('City is required'),
    // wardId: Yup.string().required('City is required'),
  });

  const defaultValues = useMemo(
    () => ({
      profilepic: '',
      firstName: '',
      lastName: '',
      birthdate: '',
      gender: '',
      phone: '',
      password: '',
      passwordConfirmation: '',
      city: '',
      district: '',
      ward: '',
      street: '',
      role: 'doctor',
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentUser]
  );

  const methods = useForm({
    resolver: yupResolver(NewUserSchema),
    defaultValues,
  });

  const [birth, setBirth] = React.useState();

  const handleChange = (newDate) => {
    setBirth(newDate);
  };

  const {
    reset,
    watch,
    control,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  useEffect(() => {
    if (isEdit && currentUser) {
      reset(defaultValues);
    }
    if (!isEdit) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, currentUser]);

  const onSubmit = async (data) => {
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
    } catch (error) {
      console.error(error);
    }
  };

  const handleDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];

      if (file) {
        setValue(
          'avatarUrl',
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        );
      }
    },
    [setValue]
  );

  return (
    <FormProvider methods={methods} >
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card sx={{ py: 10, px: 3 }}>
            {isEdit && (
              <Label
                color={values.status !== 'active' ? 'error' : 'success'}
                sx={{ textTransform: 'uppercase', position: 'absolute', top: 24, right: 24 }}
              >
                {values.status}
              </Label>
            )}

            <Box sx={{ mb: 5 }}>
              <RHFUploadAvatar
                name="avatarUrl"
                accept="image/*"
                maxSize={3145728}
                onDrop={handleDrop}
                helperText={
                  <Typography
                    variant="caption"
                    sx={{
                      mt: 2,
                      mx: 'auto',
                      display: 'block',
                      textAlign: 'center',
                      color: 'text.secondary',
                    }}
                  >
                    Allowed *.jpeg, *.jpg, *.png, *.gif
                    <br /> max size of {fData(3145728)}
                  </Typography>
                }
              />
            </Box>

            {isEdit && (
              <FormControlLabel
                labelPlacement="start"
                control={
                  <Controller
                    name="status"
                    control={control}
                    render={({ field }) => (
                      <Switch
                        {...field}
                        checked={field.value !== 'active'}
                        onChange={(event) => field.onChange(event.target.checked ? 'banned' : 'active')}
                      />
                    )}
                  />
                }
                label={
                  <>
                    <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                      Banned
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      Apply disable account
                    </Typography>
                  </>
                }
                sx={{ mx: 0, mb: 3, width: 1, justifyContent: 'space-between' }}
              />
            )}

           
          </Card>
        </Grid>
        <Grid item xs={12} md={8}>
          <Card sx={{ p: 3 }}>
            <Box
              sx={{
                display: 'grid',
                columnGap: 2,
                rowGap: 3,
                gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' },
              }}
            >
              <RHFTextField name="lastname" label="Họ" />
              <RHFTextField name="firstname" label="Tên" />
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
              {/* <DesktopDatePicker
                name="birthday"
                label="Ngày sinh"
                inputFormat="dd/MM/yyyy"
                value={birth}
                onChange={handleChange}
                renderInput={(params) => <TextField {...params} />}
              />
              <RHFSelect name="gender" label="Giới tính">
                {genders.map((option) => (
                  <option key={option.code}>{option.label}</option>
                ))}
              </RHFSelect>

              <RHFSelect
                id="cityId"
                label="Tỉnh/Thành phố"
                onChange={(e) => onCitySelect(e.target.value)}
                value={selectedCity}
              >
                {cityOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </RHFSelect>

              <RHFSelect
                id="districtId"
                label="Quận/Huyện"
                disabled={districtOptions.length === 0}
                onChange={(e) => onDistrictSelect(e.target.value)}
                value={selectedDistrict}
              >
                {districtOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </RHFSelect>

              <RHFSelect
                id="wardId"
                label="Phường/Xã"
                disabled={wardOptions.length === 0}
                onChange={(e) => onWardSelect(e.target.value)}
                value={selectedWard}
              >
                {wardOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </RHFSelect>

              <RHFTextField name="street" label="Địa chỉ" /> */}
            </Box>

            <Stack alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting} onSubmit={handleSubmit(onSubmit)}>
                {!isEdit ? 'Tạo mới bác sĩ' : 'Save Changes'}
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}

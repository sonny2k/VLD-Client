import * as Yup from 'yup';
import * as React from 'react';
import Select from 'react-select';
import { useSnackbar } from 'notistack';
import { useCallback } from 'react';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Box, Grid, Card, Stack, Typography, TextField } from '@mui/material';
import { LoadingButton, DesktopDatePicker } from '@mui/lab';
// hooks
import useAuth from '../../../../hooks/useAuth';
import useLocationForm from '../../../../hooks/useLocationForm'
// utils
import { fData } from '../../../../utils/formatNumber';
// _mock
import { genders } from '../../../../_mock/_gender';
// components
import { FormProvider, RHFSwitch, RHFSelect, RHFTextField, RHFUploadAvatar } from '../../../../components/hook-form';

// ----------------------------------------------------------------------

export default function EditAddress() {
  
  const { state, onCitySelect, onDistrictSelect, onWardSelect } = useLocationForm();

  const {
    cityOptions,
    districtOptions,
    wardOptions,
    selectedCity,
    selectedDistrict,
    selectedWard,
  } = state;
  
  const { enqueueSnackbar } = useSnackbar();

  const { account, updateinfo } = useAuth();

  const UpdateUserSchema = Yup.object().shape({
    fname: Yup.string().required('Vui lòng điền tên chính xác'),
    lname: Yup.string().matches(/^[a-zA-Z_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ]+$/, 'Vui lòng điền họ chính xác'),
    email: Yup.string().email('Vui lòng nhập đúng định dạng Email').max(255),
  });

  const gender = account.gender;
  let genderview = "";
  if (gender === 1) {
    genderview = "Nam"
  } 
  if (gender === 2) {
    genderview = "Nữ"
  } 
  if (gender === 3) {
    genderview = "Không xác định"
  } 

  const name = `${account?.fname} ${account?.lname}`;

  const defaultValues = {
    fname: account?.fname || '',
    lname: account?.lname || '',
    phone: account?.phone || '',
    photoURL: account?.profilepic || '',
    email: account?.email || '',
    gender: genderview || '',
    street: account?.address.street || '',
    birthday: new Date(account?.birthday) || '',
  };

  state.selectedCity = account?.address.city;
  state.selectedDistrict = account?.address.district;
  state.selectedWard = account?.address.ward;

  const methods = useForm({
    resolver: yupResolver(UpdateUserSchema),
    defaultValues,
  });

  let birthcheck;
  if (account?.birthday === null) {
    birthcheck = null
  }
  
  if (account?.birthday != null) {
    birthcheck = new Date(account?.birthday)
  }

  const [birth, setBirth] = React.useState(birthcheck);

  const handleChange = (newDate) => {
    setBirth(newDate);
  };

  const {
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (data) => {
    try {
      let newgender;
      if (data.gender === "Nam") {
        newgender = 1;
      }
      if (data.gender === "Nữ") {
        newgender = 2;
      }
      if (data.gender === "Không xác định") {
        newgender = 3;
      }
      await updateinfo(data.fname, data.lname, data.email, birth, newgender, selectedCity, selectedDistrict, selectedWard, data.street);
      enqueueSnackbar('Cập nhật tài khoản thành công!');
    } catch (error) {
      console.error(error);
    }
  };

  const handleDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];

      if (file) {
        setValue(
          'photoURL',
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        );
      }
    },
    [setValue]
  );

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card sx={{ p: 3 }}>
            <Box
              sx={{
                display: 'grid',
                rowGap: 3,
                columnGap: 2,
                gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' },
              }}
            >
              {/* <RHFTextField name="lname" label="Họ" />
              <RHFTextField name="fname" label="Tên" />
              <RHFTextField name="email" label="Địa chỉ email"/>
              <RHFTextField name="phone" label="Số điện thoại" disabled/>
              <DesktopDatePicker
                name="birthday"
                label="Ngày sinh"
                inputFormat="dd/MM/yyyy"
                value={birth}
                onChange={handleChange}
                renderInput={(params) => <TextField {...params} />}
              />

              <RHFSelect name="gender" label="Giới tính">
                {genders.map((option) => (
                  <option key={option.code}>
                    {option.label}
                  </option>
                ))}
              </RHFSelect> */}

              <RHFSelect name="cityId" label="Tỉnh/Thành phố" onChange={e => onCitySelect(e.target.value)} value={state.selectedCity}>
                {cityOptions.map((option) => (
                  <option key={selectedCity?.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </RHFSelect>

              <RHFSelect name="districtId" label="Quận/Huyện" disabled={districtOptions.length === 0} onChange={e => onDistrictSelect(e.target.value)} value={state.selectedDistrict}>
                {districtOptions.map((option) => (
                  <option key={selectedDistrict?.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </RHFSelect>

              <RHFSelect name="wardId" label="Phường/Xã" disabled={wardOptions.length === 0} onChange={e => onWardSelect(e.target.value)} value={state.selectedWard}>
                {wardOptions.map((option) => (
                  <option key={selectedWard?.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </RHFSelect>

              <RHFTextField name="street" label="Địa chỉ" />
            </Box>

            <Stack spacing={3} alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting} >
                Lưu thay đổi
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}

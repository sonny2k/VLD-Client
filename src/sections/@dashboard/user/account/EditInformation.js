import { useSnackbar } from 'notistack';
import * as Yup from 'yup';
import { useCallback, useState } from 'react';
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
// utils
import axios from '../../../../utils/axios';
// components
import { FormProvider, RHFSwitch, RHFSelect, RHFTextField, RHFUploadAvatar } from '../../../../components/hook-form';


// ----------------------------------------------------------------------

export default function ModalEditInformation() {
  
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

  const [birth, setBirth] = useState(birthcheck);

  const handleChange = (newDate) => {
    setBirth(newDate);
  };

  const {
    setValue,
    getValues,
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
      const cityId = document.getElementById("cityId");
      const districtId = document.getElementById("districtId");
      const wardId = document.getElementById("wardId");
      if (cityId.options[cityId.selectedIndex] != null && districtId.options[districtId.selectedIndex] != null && wardId.options[wardId.selectedIndex] != null)  {
        const city = cityId.options[cityId.selectedIndex].value;
        const district = districtId.options[districtId.selectedIndex].value;
        const ward = wardId.options[wardId.selectedIndex].value;
        await updateinfo(data.fname, data.lname, data.email, birth, newgender, city, district, ward, data.street);
      }
      // if (districtId.options[districtId.selectedIndex] != null && wardId.options[wardId.selectedIndex] != null)  {
      //   const district = districtId.options[districtId.selectedIndex].value;
      //   const ward = wardId.options[wardId.selectedIndex].value;
      //   await updateinfo(data.fname, data.lname, data.email, birth, newgender, data.city, district, ward, data.street);
      // }
      // if (wardId.options[wardId.selectedIndex] != null)  {
      //   const ward = wardId.options[wardId.selectedIndex].value;
      //   await updateinfo(data.fname, data.lname, data.email, birth, newgender, data.city, data.district, ward, data.street);
      // }
      if (cityId.options[cityId.selectedIndex] == null || districtId.options[districtId.selectedIndex] == null || wardId.options[wardId.selectedIndex] == null) {
        const c = account?.address.city;
        const d = account?.address.district;
        const w = account?.address.ward;
        await updateinfo(data.fname, data.lname, data.email, birth, newgender, c, d, w, data.street);
      }
      enqueueSnackbar('Cập nhật thông tin tài khoản thành công!');
      window.location.reload();
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
          'photoURL',
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
      await axios.post('/api/user/account/profilepic', {
        pic
      });
    } catch (err) {
      console.error(err);
      enqueueSnackbar('Có lỗi xảy ra, vui lòng thử lại!');
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card sx={{ py: 10, px: 3, textAlign: 'center' }}>
          <RHFUploadAvatar 
              name="photoURL"
              accept="image/*"
              maxSize={3145728}
              onDrop={handleDrop}
              type='file'
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
                  disabled>
                  Chỉ cho phép *.jpeg, *.jpg, *.png, *.gif
                  <br /> Dung lượng tối đa {fData(3145728)}
                </Typography>
              }
            />

            {/* <RHFSwitch name="isPublic" labelPlacement="start" label="Thông tin cá nhân" sx={{ mt: 5 }} /> */}
          </Card>
        </Grid>
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
              <RHFTextField name="lname" label="Họ" />
              <RHFTextField name="fname" label="Tên" />
              <RHFTextField name="email" label="Địa chỉ email" />
              <RHFTextField name="phone" label="Số điện thoại" disabled/>
              <DesktopDatePicker
                name="birthday"
                label="Ngày sinh"
                inputFormat="dd/MM/yyyy"
                value={birth}
                onChange={handleChange}
                renderInput={(params) => <TextField {...params} />}
              />

              <RHFSelect name="gender" label="Giới tính" >
                {genders.map((option) => (
                  <option key={option.code}>
                    {option.label}
                  </option>
                ))}
              </RHFSelect>   

              <RHFSelect name="city" id="cityId" label="Tỉnh/Thành phố" onChange={e => onCitySelect(e.target.value)} value={selectedCity}>
                {cityOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </RHFSelect>

              <RHFSelect name="district" id="districtId" label="Quận/Huyện" disabled={districtOptions.length === 0} onChange={e => onDistrictSelect(e.target.value)} value={selectedDistrict}>
                {districtOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </RHFSelect>

              <RHFSelect name="ward" id="wardId" label="Phường/Xã" disabled={!wardOptions.length === 0} onChange={e => onWardSelect(e.target.value)} value={selectedWard}>
                {wardOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </RHFSelect>

              <RHFTextField name="street" label="Địa chỉ" />
            </Box>

            <Stack spacing={3} alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting} >
                Lưu thay đổi
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}

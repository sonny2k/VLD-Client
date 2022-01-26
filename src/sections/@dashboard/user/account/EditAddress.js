import * as React from 'react';
import { useSnackbar } from 'notistack';
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

  const { account, updateaddress } = useAuth();

  const {
    cityRef,
    districtRef,
    wardRef,
  } = React.createRef();

  const defaultValues = {
    street: account?.address.street || '',
  };

  const methods = useForm({
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (data) => {
    try {
      const cityId = document.getElementById("cityId");
      const districtId = document.getElementById("districtId");
      const wardId = document.getElementById("wardId");
      const city = cityId.options[cityId.selectedIndex].text;
      const district = districtId.options[districtId.selectedIndex].text;
      const ward = wardId.options[wardId.selectedIndex].text;
      await updateaddress(city, district, ward, data.street);
      enqueueSnackbar('Cập nhật địa chỉ thành công!');
    } catch (error) {
      console.error(error);
    }
  };

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

              <RHFSelect id="cityId" label="Tỉnh/Thành phố" onChange={e => onCitySelect(e.target.value)} value={selectedCity} ref={cityRef => selectedCity.label = cityRef}>
                {cityOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </RHFSelect>

              <RHFSelect id="districtId" label="Quận/Huyện" disabled={districtOptions.length === 0} onChange={e => onDistrictSelect(e.target.value)} value={selectedDistrict} ref={districtRef}>
                {districtOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </RHFSelect>

              <RHFSelect id="wardId" label="Phường/Xã" disabled={wardOptions.length === 0} onChange={e => onWardSelect(e.target.value)} value={selectedWard} ref={wardRef}>
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
                Lưu thay đổi
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}

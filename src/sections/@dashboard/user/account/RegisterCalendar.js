import * as React from 'react';
import { useState, useEffect } from 'react';
import { format } from 'date-fns';
// form
import { useForm } from 'react-hook-form';
// @mui
import { Box, Grid, Card, Stack, Button, TextField, Checkbox, Autocomplete } from '@mui/material';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import { LoadingButton, DesktopDatePicker } from '@mui/lab';
// hooks
import useAuth from '../../../../hooks/useAuth';
// _mock
import { genders } from '../../../../_mock/_gender';
// components
import { FormProvider, RHFSelect, RHFTextField } from '../../../../components/hook-form';
import MyAvatar from '../../../../components/MyAvatar';

// ----------------------------------------------------------------------

export default function RegisterCalendar() {
  const { account } = useAuth();

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
  const checkedIcon = <CheckBoxIcon fontSize="small" />;

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 800,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };

  const defaultValues = {
    birthday: format(new Date(account?.birthday), 'dd/MM/yyyy') || '',
  };

  const methods = useForm({
    defaultValues,
  });

  let birthcheck;
  if (account?.birthday === null) {
    birthcheck = null;
  }

  if (account?.birthday != null) {
    birthcheck = new Date(account?.birthday);
  }

  const [birth, setBirth] = React.useState(birthcheck);

  const handleChange = (newDate) => {
    setBirth(newDate);
  };

  const top100Films = [
    { label: '08:00' },
    { label: '09:00' },
    { label: '10:00' },
    { label: '11:00' },
    { label: '13:00' },
    { label: '14:00' },
    { label: '15:00' },
    { label: '16:00' },
    { label: '17:00' },
  ];
  return (
    <FormProvider methods={methods}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card sx={{ py: 10, px: 3, textAlign: 'center' }}>
            <MyAvatar
              sx={{
                mx: 'auto',
                borderWidth: 2,
                borderStyle: 'solid',
                borderColor: 'common.white',
                width: { xs: 80, md: 128 },
                height: { xs: 80, md: 128 },
              }}
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
              <DesktopDatePicker
                name="birthday"
                label="Ngày 1"
                inputFormat="dd/MM/yyyy"
                value={birth}
                onChange={handleChange}
                renderInput={(params) => <TextField {...params} />}
              />
              <Autocomplete
                multiple
                id="checkboxes-tags-demo"
                options={top100Films}
                disableCloseOnSelect
                getOptionLabel={(option) => option.label}
                renderOption={(props, option, { selected }) => (
                  <li {...props}>
                    <Checkbox icon={icon} checkedIcon={checkedIcon} style={{ marginRight: 8 }} checked={selected} />
                    {option.label}
                  </li>
                )}
                style={{ width: 500 }}
                renderInput={(params) => <TextField {...params} label="Giờ" placeholder="Chọn giờ" />}
              />
              <DesktopDatePicker
                name="birthday"
                label="Ngày 2"
                inputFormat="dd/MM/yyyy"
                value={birth}
                onChange={handleChange}
                renderInput={(params) => <TextField {...params} />}
              />
              <Autocomplete
                multiple
                id="checkboxes-tags-demo"
                options={top100Films}
                disableCloseOnSelect
                getOptionLabel={(option) => option.label}
                renderOption={(props, option, { selected }) => (
                  <li {...props}>
                    <Checkbox icon={icon} checkedIcon={checkedIcon} style={{ marginRight: 8 }} checked={selected} />
                    {option.label}
                  </li>
                )}
                style={{ width: 500 }}
                renderInput={(params) => <TextField {...params} label="Giờ" placeholder="Chọn giờ" />}
              />              
              <DesktopDatePicker
                name="birthday"
                label="Ngày 3"
                inputFormat="dd/MM/yyyy"
                value={birth}
                onChange={handleChange}
                renderInput={(params) => <TextField {...params} />}
              />
              <Autocomplete
                multiple
                id="checkboxes-tags-demo"
                options={top100Films}
                disableCloseOnSelect
                getOptionLabel={(option) => option.label}
                renderOption={(props, option, { selected }) => (
                  <li {...props}>
                    <Checkbox icon={icon} checkedIcon={checkedIcon} style={{ marginRight: 8 }} checked={selected} />
                    {option.label}
                  </li>
                )}
                style={{ width: 500 }}
                renderInput={(params) => <TextField {...params} label="Giờ" placeholder="Chọn giờ" />}
              />
              <DesktopDatePicker
                name="birthday"
                label="Ngày 3"
                inputFormat="dd/MM/yyyy"
                value={birth}
                onChange={handleChange}
                renderInput={(params) => <TextField {...params} />}
              />
              <Autocomplete
                multiple
                id="checkboxes-tags-demo"
                options={top100Films}
                disableCloseOnSelect
                getOptionLabel={(option) => option.label}
                renderOption={(props, option, { selected }) => (
                  <li {...props}>
                    <Checkbox icon={icon} checkedIcon={checkedIcon} style={{ marginRight: 8 }} checked={selected} />
                    {option.label}
                  </li>
                )}
                style={{ width: 500 }}
                renderInput={(params) => <TextField {...params} label="Giờ" placeholder="Chọn giờ" />}
              />
              <DesktopDatePicker
                name="birthday"
                label="Ngày 3"
                inputFormat="dd/MM/yyyy"
                value={birth}
                onChange={handleChange}
                renderInput={(params) => <TextField {...params} />}
              />
              <Autocomplete
                multiple
                id="checkboxes-tags-demo"
                options={top100Films}
                disableCloseOnSelect
                getOptionLabel={(option) => option.label}
                renderOption={(props, option, { selected }) => (
                  <li {...props}>
                    <Checkbox icon={icon} checkedIcon={checkedIcon} style={{ marginRight: 8 }} checked={selected} />
                    {option.label}
                  </li>
                )}
                style={{ width: 500 }}
                renderInput={(params) => <TextField {...params} label="Giờ" placeholder="Chọn giờ" />}
              />
              <DesktopDatePicker
                name="birthday"
                label="Ngày 3"
                inputFormat="dd/MM/yyyy"
                value={birth}
                onChange={handleChange}
                renderInput={(params) => <TextField {...params} />}
              />
              <Autocomplete
                multiple
                id="checkboxes-tags-demo"
                options={top100Films}
                disableCloseOnSelect
                getOptionLabel={(option) => option.label}
                renderOption={(props, option, { selected }) => (
                  <li {...props}>
                    <Checkbox icon={icon} checkedIcon={checkedIcon} style={{ marginRight: 8 }} checked={selected} />
                    {option.label}
                  </li>
                )}
                style={{ width: 500 }}
                renderInput={(params) => <TextField {...params} label="Giờ" placeholder="Chọn giờ" />}
              />
              <DesktopDatePicker
                name="birthday"
                label="Ngày 3"
                inputFormat="dd/MM/yyyy"
                value={birth}
                onChange={handleChange}
                renderInput={(params) => <TextField {...params} />}
              />
              <Autocomplete
                multiple
                id="checkboxes-tags-demo"
                options={top100Films}
                disableCloseOnSelect
                getOptionLabel={(option) => option.label}
                renderOption={(props, option, { selected }) => (
                  <li {...props}>
                    <Checkbox icon={icon} checkedIcon={checkedIcon} style={{ marginRight: 8 }} checked={selected} />
                    {option.label}
                  </li>
                )}
                style={{ width: 500 }}
                renderInput={(params) => <TextField {...params} label="Giờ" placeholder="Chọn giờ" />}
              />
            </Box>
            <Stack spacing={3} alignItems="flex-end" sx={{ mt: 3 }}>
              <Button variant="contained" className="openModalBtn" onClick={handleOpen}>
                Lưu thay đổi
              </Button>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
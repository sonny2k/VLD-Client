import * as React from 'react';
import { useState, useEffect } from 'react';
import { format, getDate } from 'date-fns';
// form
import { useForm } from 'react-hook-form';
// @mui
import { Box, Grid, Card, Stack, Button, TextField, Checkbox, Autocomplete } from '@mui/material';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import { LoadingButton, DesktopDatePicker } from '@mui/lab';
import LoadingScreen from '../../../../components/LoadingScreen';
// hooks
import useAuth from '../../../../hooks/useAuth';
// utils
import axios from '../../../../utils/axios';
// _mock
import { genders } from '../../../../_mock/_gender';
// components
import { FormProvider, RHFSelect, RHFTextField } from '../../../../components/hook-form';


// ----------------------------------------------------------------------

export default function RegisterCalendar() {
  const { account } = useAuth();

  const [doc, setDoctor] = useState(null);

  const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
  const checkedIcon = <CheckBoxIcon fontSize="small" />;

  const md1 = new Date();
  md1.setDate(md1.getDate() + 1);

  const [d1, setD1] = React.useState(null);
  const [d2, setD2] = React.useState(null);
  const [d3, setD3] = React.useState(null);
  const [d4, setD4] = React.useState(null);
  const [d5, setD5] = React.useState(null);
  const [d6, setD6] = React.useState(null);
  const [d7, setD7] = React.useState(null);

  useEffect(() => {
    async function getInfo() {
      const URL = '/api/doctor/account/info';
      try {
        const res = await axios.get(URL);
        setDoctor(res.data);
      } catch (error) {
        console.log(error);
      }
    }
    getInfo();
  }, []);

  useEffect(() => {
    if (doc !== null) {
      setD1(doc.availables[0].date);
      setD2(doc.availables[1].date);
      setD3(doc.availables[2].date);
      setD4(doc.availables[3].date);
      setD5(doc.availables[4].date);
      setD6(doc.availables[5].date);
      setD7(doc.availables[6].date);
    }
  }, [doc]);

  const md2 = new Date(d1);
  md2.setDate(md2.getDate() + 1);

  const md3 = new Date(d2);
  md3.setDate(md3.getDate() + 1);

  const md4 = new Date(d3);
  md4.setDate(md4.getDate() + 1);

  const md5 = new Date(d4);
  md5.setDate(md5.getDate() + 1);

  const md6 = new Date(d5);
  md6.setDate(md6.getDate() + 1);

  const md7 = new Date(d6);
  md7.setDate(md7.getDate() + 1);

  const defaultValues = {
  };

  const methods = useForm({
    defaultValues,
  });

  const handleChange1 = (newDate) => {
    setD1(newDate);
  };

  const handleChange2 = (newDate) => {
    setD2(newDate);
  };

  const handleChange3 = (newDate) => {
    setD3(newDate);
  };

  const handleChange4 = (newDate) => {
    setD4(newDate);
  };

  const handleChange5 = (newDate) => {
    setD5(newDate);
  };

  const handleChange6 = (newDate) => {
    setD6(newDate);
  };

  const handleChange7 = (newDate) => {
    setD7(newDate);
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
  if (doc !== null) {
    return (
      <FormProvider methods={methods}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={10}>
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
                  name="day1"
                  label="Ngày 1"
                  inputFormat="dd/MM/yyyy"
                  minDate={md1}
                  value={d1}
                  onChange={handleChange1}
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
                      <Checkbox icon={icon} checkedIcon={checkedIcon} checked={selected} />
                      {option.label}
                    </li>
                  )}
                  renderInput={(params) => <TextField {...params} label="Giờ làm việc ngày 1" placeholder="Chọn giờ" />}
                />
                <DesktopDatePicker
                  name="day2"
                  label="Ngày 2"
                  inputFormat="dd/MM/yyyy"
                  minDate={md2}
                  value={d2}
                  onChange={handleChange2}
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
                      <Checkbox icon={icon} checkedIcon={checkedIcon} checked={selected} />
                      {option.label}
                    </li>
                  )}
                  renderInput={(params) => <TextField {...params} label="Giờ làm việc ngày 2" placeholder="Chọn giờ" />}
                />              
                <DesktopDatePicker
                  name="day3"
                  label="Ngày 3"
                  inputFormat="dd/MM/yyyy"
                  minDate={md3}
                  value={d3}
                  onChange={handleChange3}
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
                      <Checkbox icon={icon} checkedIcon={checkedIcon} checked={selected} />
                      {option.label}
                    </li>
                  )}
                  renderInput={(params) => <TextField {...params} label="Giờ làm việc ngày 3" placeholder="Chọn giờ" />}
                />
                <DesktopDatePicker
                  name="day4"
                  label="Ngày 4"
                  inputFormat="dd/MM/yyyy"
                  minDate={md4}
                  value={d4}
                  onChange={handleChange4}
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
                      <Checkbox icon={icon} checkedIcon={checkedIcon} checked={selected} />
                      {option.label}
                    </li>
                  )}
                  renderInput={(params) => <TextField {...params} label="Giờ làm việc ngày 4" placeholder="Chọn giờ" />}
                />
                <DesktopDatePicker
                  name="day5"
                  label="Ngày 5"
                  inputFormat="dd/MM/yyyy"
                  minDate={md5}
                  value={d5}
                  onChange={handleChange5}
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
                      <Checkbox icon={icon} checkedIcon={checkedIcon} checked={selected} />
                      {option.label}
                    </li>
                  )}
                  renderInput={(params) => <TextField {...params} label="Giờ làm việc ngày 5" placeholder="Chọn giờ" />}
                />
                <DesktopDatePicker
                  name="day6"
                  label="Ngày 6"
                  inputFormat="dd/MM/yyyy"
                  minDate={md6}
                  value={d6}
                  onChange={handleChange6}
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
                      <Checkbox icon={icon} checkedIcon={checkedIcon} checked={selected} />
                      {option.label}
                    </li>
                  )}
                  renderInput={(params) => <TextField {...params} label="Giờ làm việc ngày 6" placeholder="Chọn giờ" />}
                />
                <DesktopDatePicker
                  name="day7"
                  label="Ngày 7"
                  inputFormat="dd/MM/yyyy"
                  minDate={md7}
                  value={d7}
                  onChange={handleChange7}
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
                      <Checkbox icon={icon} checkedIcon={checkedIcon} checked={selected} />
                      {option.label}
                    </li>
                  )}
                  renderInput={(params) => <TextField {...params} label="Giờ làm việc ngày 7" placeholder="Chọn giờ" />}
                />
              </Box>
              <Stack spacing={3} alignItems="flex-end" sx={{ mt: 3 }}>
                <LoadingButton variant="contained">
                  Lưu thay đổi
                </LoadingButton>
              </Stack>
            </Card>
          </Grid>
        </Grid>
      </FormProvider>
    );
  }
  return (
    <LoadingScreen />
  );
  
}
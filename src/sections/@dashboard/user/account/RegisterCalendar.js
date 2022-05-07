import * as React from 'react';
import { useSnackbar } from 'notistack';
import { useState, useEffect, useCallback } from 'react';
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
import PickerDate from './PickerDate';

// ----------------------------------------------------------------------

export default function RegisterCalendar() {
  const [disableInput, setDisableInput] = useState(false);

  const [doc, setDoctor] = useState(null);

  const { enqueueSnackbar } = useSnackbar();

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

  const defaultValues = {};

  const methods = useForm({
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

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

  const workinghours = [
    { time: '07:00' },
    { time: '08:00' },
    { time: '09:00' },
    { time: '10:00' },
    { time: '11:00' },
    { time: '13:00' },
    { time: '14:00' },
    { time: '15:00' },
    { time: '16:00' },
    { time: '17:00' },
    { time: '18:00' },
    { time: '19:00' },
    { time: '20:00' },
    { time: '21:00' },
    { time: '22:00' },
    { time: '23:00' },
  ];

  if (doc !== null) {
    const hourswork = [{ time: doc.availables[0].hours[0].time }];
    const onSubmit = async (data) => {
      try {
        await axios.post('/api/doctor/account/workingtime', {
          // date1: data.day1,
          // date2: data.day1,
          // date3: data.day1,
          // date4: data.day1,
          // date5: data.day1,
          // date6: data.day1,
          // date7: data.day1,
          // hour11: data.day1,
          // hour12: data.day1,
          // hour13: data.day1,
          // hour21: data.day1,
          // hour22: data.day1,
          // hour23: data.day1,
          // hour31: data.day1,
          // hour32: data.day1,
          // hour33: data.day1,
          // hour41: data.day1,
          // hour42: data.day1,
          // hour43: data.day1,
          // hour51: data.day1,
          // hour52: data.day1,
          // hour53: data.day1,
          // hour61: data.day1,
          // hour62: data.day1,
          // hour63: data.day1,
          // hour71: data.day1,
          // hour72: data.day1,
          // hour73: data.day1,
        });
        enqueueSnackbar('Lưu thời gian làm việc thành công');
      } catch (error) {
        console.error(error);
        enqueueSnackbar('Đã xảy ra lỗi, vui lòng thử lại', { variant: 'error' });
      }
    };

    const handleOnSelect = (value) => {};

    return (
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={10}>
            <Card sx={{ p: 3 }}>
              {/* <Box
                sx={{
                  display: 'grid',
                  rowGap: 3,
                  columnGap: 2,
                  gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' },
                }}
              > */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {doc?.availables?.map((avaiableDate, index) => (
                  <PickerDate avaiableDates={avaiableDate} workinghours={workinghours} numOfDay={index + 1} />
                ))}
                {/* <DesktopDatePicker
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
                  options={workinghours}
                  defaultValue={hourswork1}
                  onSelect={(value) => console.log(value)}
                  disableCloseOnSelect
                  getOptionLabel={(option) => option.time}
                  renderOption={(props, option, { selected }) => (
                    <li {...props}>
                      <Checkbox icon={icon} checkedIcon={checkedIcon} checked={selected} />
                      {option.time}
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
                  onChange={(event, value) => console.log(value)}
                  multiple
                  id="checkboxes-tags-demo"
                  options={workinghours}
                  defaultValue={hourswork2}
                  disableCloseOnSelect
                  getOptionLabel={(option) => option.time}
                  renderOption={(props, option, { selected }) => (
                    <li {...props}>
                      <Checkbox icon={icon} checkedIcon={checkedIcon} checked={selected} />
                      {option.time}
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
                  options={workinghours}
                  defaultValue={hourswork3}
                  disableCloseOnSelect
                  getOptionLabel={(option) => option.time}
                  renderOption={(props, option, { selected }) => (
                    <li {...props}>
                      <Checkbox icon={icon} checkedIcon={checkedIcon} checked={selected} />
                      {option.time}
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
                  options={workinghours}
                  defaultValue={hourswork4}
                  disableCloseOnSelect
                  getOptionLabel={(option) => option.time}
                  renderOption={(props, option, { selected }) => (
                    <li {...props}>
                      <Checkbox icon={icon} checkedIcon={checkedIcon} checked={selected} />
                      {option.time}
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
                  options={workinghours}
                  defaultValue={hourswork5}
                  disableCloseOnSelect
                  getOptionLabel={(option) => option.time}
                  renderOption={(props, option, { selected }) => (
                    <li {...props}>
                      <Checkbox icon={icon} checkedIcon={checkedIcon} checked={selected} />
                      {option.time}
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
                  options={workinghours}
                  defaultValue={hourswork6}
                  disableCloseOnSelect
                  getOptionLabel={(option) => option.time}
                  renderOption={(props, option, { selected }) => (
                    <li {...props}>
                      <Checkbox icon={icon} checkedIcon={checkedIcon} checked={selected} />
                      {option.time}
                    </li>
                  )}
                  renderInput={(params) => <TextField {...params} label="Giờ làm việc ngày 7" placeholder="Chọn giờ" />}
                /> */}
              </div>
              {/* </Box> */}
              {/* <Stack spacing={3} alignItems="flex-end" sx={{ mt: 3 }}>
                <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                  Lưu thay đổi
                </LoadingButton>
              </Stack> */}
            </Card>
          </Grid>
        </Grid>
      </FormProvider>
    );
  }
  return <LoadingScreen />;
}

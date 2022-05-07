import React, { useEffect } from 'react';
import { useSnackbar } from 'notistack';
import _ from 'lodash';
import { LoadingButton, DesktopDatePicker } from '@mui/lab';
import { Box, Grid, Card, Stack, Button, TextField, Checkbox, Autocomplete } from '@mui/material';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import axios from '../../../../utils/axios';

export default function PickerDate({ avaiableDates, workinghours, numOfDay }) {
  const [date, setDate] = React.useState(avaiableDates);
  const [hoursWork, setHoursWork] = React.useState([]);
  const [isDisable, setIsDisable] = React.useState(hoursWork?.length >= 0);
  const [isChange, setIsChange] = React.useState(false);
  const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
  const checkedIcon = <CheckBoxIcon fontSize="small" />;
  let minDate = new Date(date).setDate(new Date(date).getDate() + 1);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    setDate(avaiableDates);
    setHoursWork([{ time: avaiableDates?.hours[0]?.time }]);
  }, [avaiableDates]);

  useEffect(() => {
    setIsDisable(hoursWork?.length >= 0);
    minDate = new Date(date).setDate(new Date(date).getDate() + 1);
  }, [hoursWork, date]);

  const submitChange = async () => {
    try {
      await axios.post('/api/doctor/account/workingtime', {
        numOfDay: numOfDay - 1,
        data: {
          date: date?.date,
          hours: date?.hours,
        },
      });
      setIsChange(false);
      enqueueSnackbar('Lưu thời gian làm việc thành công');
    } catch (error) {
      console.error(error);
      enqueueSnackbar('Đã xảy ra lỗi, vui lòng thử lại', { variant: 'error' });
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'row', gap: '10px' }}>
      <DesktopDatePicker
        style={{ flex: '4' }}
        name={numOfDay}
        label={`Ngày ${numOfDay}`}
        inputFormat="dd/MM/yyyy"
        minDate={minDate}
        value={date?.date}
        onChange={(value) => {
          console.log(value);
          setIsChange(!_?.isEqual(value, avaiableDates?.date));
          setDate({ ...date, date: value });
        }}
        renderInput={(params) => <TextField {...params} />}
      />
      <Autocomplete
        style={{ flex: '4' }}
        multiple
        id="checkboxes-tags-demo"
        options={workinghours}
        defaultValue={date?.hours.map((x) => ({ time: x.time }))}
        disableCloseOnSelect
        disabled={false}
        getOptionLabel={(option) => option.time}
        renderOption={(props, option, { selected }) => (
          <li {...props}>
            <Checkbox icon={icon} checkedIcon={checkedIcon} checked={selected} />
            {option.time}
          </li>
        )}
        renderInput={(params) => (
          <TextField {...params} label={`Giờ làm việc ngày ${numOfDay}`} placeholder="Chọn giờ" />
        )}
        onChange={(e, value) => {
          setIsChange(
            !_?.isEqual(
              value,
              avaiableDates?.hours?.map((x) => ({ time: x.time }))
            )
          );
          setDate({ ...date, hours: value });
        }}
      />
      <LoadingButton
        style={{ flex: '1', visibility: isChange ? 'visible' : 'hidden' }}
        onClick={submitChange}
        type="submit"
        variant="contained"
      >
        Lưu thay đổi
      </LoadingButton>
    </div>
  );
}
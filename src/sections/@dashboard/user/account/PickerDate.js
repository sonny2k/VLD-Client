import React, { useEffect } from 'react';
import { useSnackbar } from 'notistack';
import _ from 'lodash';
import { LoadingButton, DesktopDatePicker } from '@mui/lab';
import { Box, Grid, Card, Stack, Button, TextField, Checkbox, Autocomplete } from '@mui/material';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import { format, getDate } from 'date-fns';
import axios from '../../../../utils/axios';

export default function PickerDate({ avaiableDates, workinghours, numOfDay }) {
  const [date, setDate] = React.useState(avaiableDates);
  const [hoursWork, setHoursWork] = React.useState([]);
  const [isDisable, setIsDisable] = React.useState(hoursWork?.length >= 0);
  const [isChange, setIsChange] = React.useState(false);
  const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
  const checkedIcon = <CheckBoxIcon fontSize="small" />;

  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    setIsDisable(hoursWork?.length >= 0);
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
    <div style={{ display: 'flex', flexDirection: 'row', gap: '15px' }}>
      <DesktopDatePicker
        style={{ flex: '4' }}
        name={numOfDay}
        label={`Ngày ${numOfDay}`}
        inputFormat="dd/MM/yyyy"
        value={date?.date}
        onChange={(value) => {
          console.log(`${format(new Date(value), 'yyyy-MM-dd')}T00:00:00.000+00:00`);
          setIsChange(!_?.isEqual(value, avaiableDates?.date));
          setDate({ ...date, date: `${format(new Date(value), 'yyyy-MM-dd')}T00:00:00.000+00:00` });
        }}
        renderInput={(params) => <TextField {...params} />}
      />
      <Autocomplete
        style={{ flex: '4' }}
        multiple
        id="checkboxes-tags-demo"
        options={workinghours}
        defaultValue={date?.hours.map((x) => x.time)}
        disableCloseOnSelect
        disabled={false}
        getOptionLabel={(option) => option}
        renderOption={(props, option, { selected }) => (
          <li {...props}>
            <Checkbox icon={icon} checkedIcon={checkedIcon} checked={selected} />
            {option}
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
          const rawhours = value.map((x) => ({
            time: x,
            status: false,
          }));
          console.log(rawhours);
          setDate({ ...date, hours: rawhours });
        }}
      />
      <Stack alignItems={'flex-end'} justifyContent={'center'}>
        <LoadingButton
          style={{ visibility: isChange ? 'visible' : 'hidden' }}
          onClick={submitChange}
          type="submit"
          variant="contained"
        >
          Lưu thay đổi
        </LoadingButton>
      </Stack>
    </div>
  );
}

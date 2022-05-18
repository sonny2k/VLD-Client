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
  const [doc, setDoctor] = useState(null);

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

  const workinghours = [
    '07:00',
    '08:00',
    '09:00',
    '10:00',
    '11:00',
    '13:00',
    '14:00',
    '15:00',
    '16:00',
    '17:00',
    '18:00',
    '19:00',
    '20:00',
    '21:00',
    '22:00',
    '23:00',
  ];

  return (
    doc !== null && (
      <Grid container spacing={3}>
        <Grid item xs={12} md={12}>
          <Card sx={{ p: 3 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
              {doc?.availables?.map((avaiableDate, index) => (
                <PickerDate
                  avaiableDates={avaiableDate}
                  workinghours={workinghours}
                  numOfDay={index + 1}
                  index={index}
                />
              ))}
            </div>
          </Card>
        </Grid>
      </Grid>
    )
  );
}

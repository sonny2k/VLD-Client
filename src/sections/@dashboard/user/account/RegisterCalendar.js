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

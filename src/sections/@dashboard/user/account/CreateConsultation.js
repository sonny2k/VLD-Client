import * as Yup from 'yup';
import * as React from 'react';
import 'yup-phone';
import { useSnackbar } from 'notistack';
import { useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Box, Grid, Card, Stack, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { format } from 'date-fns';
// hooks
import { PATH_DASHBOARD } from '../../../../routes/paths';
import useAuth from '../../../../hooks/useAuth';
// utils
import createAvatar from '../../../../utils/createAvatar';
import axios from '../../../../utils/axios';
// _mock
import { hours } from '../../../../_mock/_hour';
import { datearray } from '../../../../_mock/_date';
// components
import { FormProvider, RHFSelect, RHFTextField } from '../../../../components/hook-form';
import Avatar from '../../../../components/Avatar';

// ----------------------------------------------------------------------

export default function ModalCreateConsultation({ doctor, ...other }) {
  const { enqueueSnackbar } = useSnackbar();

  const { lname, fname, profilepic } = doctor.account;

  const { level, department, availables, workcertificate } = doctor;

  const { account } = useAuth();

  const checkDay = new Date();

  const navigate = useNavigate();

  ModalCreateConsultation.propTypes = {
    doctor: PropTypes.object,
  };

  const sorted = availables.sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return dateA - dateB;
  });

  const [datec, setDateC] = useState(null);

  const [position, setPosition] = useState(null);

  console.log(position);

  const [hourc, setHourC] = useState(null);

  const [datetext, setDateText] = useState('Vui lòng chọn ngày');

  const createConsultSchema = Yup.object().shape({
    name: Yup.string().min(2, 'Tối thiểu 2 kí tự').max(30, 'Tối đa 30 kí tự').required('Vui lòng nhập họ tên hợp lệ!'),
    phone: Yup.string()
      .min(10, 'Vui lòng nhập số điện thoại có 10 chữ số')
      .max(10, 'Vui lòng nhập số điện thoại có 10 chữ số')
      .phone('VN', true, 'Số điện thoại không hợp lệ'),
  });

  const defaultValues = {
    name: `${account?.lname} ${account?.fname}` || '',
    phone: `0${account?.phone.slice(3)}` || '',
    photoURL: account?.profilepic || '',
  };

  const methods = useForm({
    resolver: yupResolver(createConsultSchema),
    defaultValues,
  });

  const {
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (data) => {
    try {
      if (datec !== null && hourc !== null) {
        await axios.post('/api/user/consultation/createconsult', {
          symptom: data.symptom,
          name: data.name,
          phone: data.phone,
          dateconsult: datec,
          hour: hourc,
          doctor: doctor._id,
        });
        enqueueSnackbar('Bạn đã đăng kí lịch thăm khám thành công!');
        navigate(PATH_DASHBOARD.user.list);
      }

      if (datec === null && hourc === null) {
        enqueueSnackbar('Vui lòng chọn ngày hẹn', { variant: 'error' });
      }

      if (datec !== null && hourc === null) {
        enqueueSnackbar('Vui lòng chọn giờ hẹn', { variant: 'error' });
      }
    } catch (err) {
      console.error(err);
      enqueueSnackbar('Các giờ trong ngày đã được đặt trước, vui lòng chọn ngày khác', { variant: 'error' });
    }
  };

  const handleChooseDate = (e) => {
    const index = sorted.map((item) => format(new Date(item.date), 'yyyy-MM-dd')).indexOf(e.target.value);
    setPosition(index);
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card sx={{ py: 10, px: 3, textAlign: 'center' }}>
            <Avatar
              src={profilepic}
              alt={`${lname} ${fname}`}
              color={profilepic ? 'default' : createAvatar(`${lname} ${fname}`).color}
              {...other}
              sx={{
                mx: 'auto',
                borderWidth: 2,
                borderStyle: 'solid',
                borderColor: 'common.white',
                width: { xs: 80, md: 128 },
                height: { xs: 80, md: 128 },
              }}
            >
              {createAvatar(`${lname} ${fname}`).name}
            </Avatar>

            <Typography
              variant="caption"
              sx={{
                mt: 2,
                mx: 'auto',
                display: 'block',
                textAlign: 'center',
                color: 'text.secondary',
              }}
            >
              {level} {lname} {fname}
              <br /> {department}
              <br /> {workcertificate}
            </Typography>

            {/* <RHFSwitch name="isPublic" labelPlacement="start" label="Hồ sơ bệnh án" sx={{ mt: 5 }} /> */}
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
              <RHFTextField name="name" label="Họ và tên" />

              <RHFTextField name="phone" label="Số điện thoại" />

              <RHFSelect
                id="dateid"
                name="date"
                label="Ngày"
                placeholder="Ngày"
                onChange={(e) => {
                  handleChooseDate(e);
                  setDateC(e.target.value);
                }}
              >
                <option disabled selected>
                  {datetext}
                </option>
                {sorted.map(
                  (option, index) =>
                    new Date(option.date) >= checkDay && (
                      <option key={index} value={format(new Date(option.date), 'yyyy-MM-dd')}>
                        {format(new Date(option.date), 'dd-MM-yyyy')}
                      </option>
                    )
                )}
              </RHFSelect>

              {position !== null && (
                <RHFSelect
                  id="hourid"
                  name="hour"
                  label="Giờ"
                  placeholder="Giờ"
                  onChange={(e) => setHourC(e.target.value)}
                >
                  <option disabled selected>
                    Vui lòng chọn giờ
                  </option>
                  {availables[position].hours.map((option, index) =>
                    option.status === false ? (
                      <option key={index} value={option.time}>
                        {option.time}
                      </option>
                    ) : (
                      <option disabled>khung giờ {option.time} đã được đặt</option>
                    )
                  )}
                </RHFSelect>
              )}
            </Box>

            <Stack spacing={3} alignItems="flex-end" sx={{ mt: 3 }}>
              <RHFTextField name="symptom" multiline rows={4} label="Triệu chứng" />

              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                Hẹn Tư Vấn
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}

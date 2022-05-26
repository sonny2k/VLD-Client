import * as Yup from 'yup';
import * as React from 'react';
import 'yup-phone';
import { useSnackbar } from 'notistack';
import { useState } from 'react';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Box, Grid, Card, Stack, Typography, Button } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// hooks
import useAuth from '../../../../hooks/useAuth';
import { PATH_DASHBOARD } from '../../../../routes/paths';
// utils
import axios from '../../../../utils/axios';
// _mock
import { hours } from '../../../../_mock/_hour';
import { datearray } from '../../../../_mock/_date';
// components
import { FormProvider, RHFSelect, RHFTextField } from '../../../../components/hook-form';

// ----------------------------------------------------------------------

export default function ModalCreateConsultation({ doctor }) {
  const { enqueueSnackbar } = useSnackbar();

  const { account } = useAuth();

  const checkDay = new Date();

  const { availables } = doctor;

  const sorted = availables.sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return dateA - dateB;
  });

  const navigate = useNavigate();

  const [datec, setDateC] = useState(null);

  const [position, setPosition] = useState(null);

  const [hourc, setHourC] = useState(null);

  const createConsultSchema = Yup.object().shape({
    name: Yup.string().min(2, 'Tối thiểu 2 kí tự').max(30, 'Tối đa 30 kí tự').required('Vui lòng nhập họ tên hợp lệ!'),
    phone: Yup.string()
      .min(10, 'Vui lòng nhập số điện thoại có 10 chữ số')
      .max(10, 'Vui lòng nhập số điện thoại có 10 chữ số')
      .phone('VN', true, 'Số điện thoại không hợp lệ'),
  });

  const d = new Date();

  d.setDate(d.getDate() + 1);

  const dd = format(new Date(d), 'yyyy-MM-dd');

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

      if (datec !== null && hourc === null) {
        enqueueSnackbar('Vui lòng chọn giờ hẹn', { variant: 'error' });
      }

      if (datec === null && hourc === null) {
        enqueueSnackbar('Vui lòng chọn ngày', { variant: 'error' });
      }
    } catch (err) {
      console.error(err);
      enqueueSnackbar('Các giờ trong ngày đã được đặt trước, vui lòng chọn ngày khác', { variant: 'error' });
    }
  };

  const back = async () => {
    navigate(PATH_DASHBOARD.user.cards);
  };

  const handleChooseDate = (e) => {
    const index = sorted.map((item) => format(new Date(item.date), 'yyyy-MM-dd')).indexOf(e.target.value);
    setPosition(index);
  };

  return (
    <FormProvider methods={methods}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={12}>
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
                  Vui lòng chọn ngày
                </option>
                {sorted.map(
                  (option, index) =>
                    new Date(option.date) >= checkDay && (
                      <option key={index} pos={index} value={format(new Date(option.date), 'yyyy-MM-dd')}>
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
              <Box
                sx={{
                  display: 'grid',
                  columnGap: 1,
                  rowGap: 1,
                  gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(2, 1fr)' },
                }}
              >
                <Button variant="outlined" onClick={handleSubmit(back)}>
                  Trở về
                </Button>

                <LoadingButton
                  type="submit"
                  variant="contained"
                  onClick={handleSubmit(onSubmit)}
                  loading={isSubmitting}
                >
                  Hẹn Tư Vấn
                </LoadingButton>
              </Box>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}

import * as Yup from 'yup';
import * as React from 'react';
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

  const { available } = doctor

  const navigate = useNavigate();

  const [ datec, setDateC ] = useState(null);

  const [ hourc, setHourC ] = useState(null);

  const UpdateUserSchema = Yup.object().shape({
    displayName: Yup.string().required('Họ tên là bắt buộc'),
  });

  const d = new Date();

  d.setDate(d.getDate() + 1);

  const dd = format(new Date(d), 'yyyy-MM-dd');

  const defaultValues = {
    displayName: account?.lname + account?.fname || '',
    phoneNumber: account?.phone || '',
    photoURL: account?.profilepic || '',
    date: dd,
    hour: '08:00',
  };

  const methods = useForm({
    resolver: yupResolver(UpdateUserSchema),
    defaultValues,
  });

  const {
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (data) => {
    try {
      await axios.post('/api/user/consultation/createconsult', {
        symptom: data.symptom,
        dateconsult: datec !== null ? datec : data.date,
        hour: hourc !== null ? hourc : data.hour,
        doctor: doctor._id,
      });
      enqueueSnackbar('Đặt hẹn thành công');
      navigate(PATH_DASHBOARD.user.list);
    } catch (err) {
      console.error(err);
      enqueueSnackbar('Có lỗi xảy ra, vui lòng thử lại!');
    }
  };
  
  const back = async () => {
    navigate(PATH_DASHBOARD.user.cards);
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
                <RHFSelect name="date" label="Ngày" placeholder="Ngày" onChange={(e) => setDateC(e.target.value)} value={datec}>
                  {datearray.map((option, index) => (
                    <option key={index}>
                      {option.value}
                    </option>
                  ))}
                </RHFSelect>

                <RHFSelect name="hour" label="Giờ" placeholder="Giờ" onChange={(e) => setHourC(e.target.value)} value={hourc}>
                  {hours.map((option, index) => (
                    <option key={index}>
                      {option.label}
                    </option>
                  ))}
                </RHFSelect>
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
              
                <LoadingButton type="submit" variant="contained" onClick={handleSubmit(onSubmit)} loading={isSubmitting}>
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

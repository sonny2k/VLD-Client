import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useState, useEffect, useMemo } from 'react';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
// form
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { LoadingButton } from '@mui/lab';
import { styled } from '@mui/material/styles';
import { Box, Card, Grid, Stack, Typography, Button, Tooltip, Link, CardHeader } from '@mui/material';
// utils
import createAvatar from '../../../utils/createAvatar';
import axios from '../../../utils/axios';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// components
import Label from '../../../components/Label';
import { FormProvider, RHFTextField } from '../../../components/hook-form';
import Avatar from '../../../components/Avatar';
import Iconify from '../../../components/Iconify';

// ----------------------------------------------------------------------

UserNewForm.propTypes = {
  consultation: PropTypes.array,
};

export default function UserNewForm({ consultation }) {
  const IconStyle = styled(Iconify)(({ theme }) => ({
    width: 20,
    height: 20,
    marginTop: 1,
    flexShrink: 0,
    marginRight: theme.spacing(2),
  }));

  const navigate = useNavigate();

  const { date, hour, status, symptom, roomname } = consultation[0];

  const { fname, lname, profilepic } = consultation[0].doctor.account;

  const { department, description, workcertificate, level, educationplace } = consultation[0].doctor;

  const name = `${lname} ${fname}`;

  const { enqueueSnackbar } = useSnackbar();  

  const defaultValues = useMemo(
    () => ({
      name: name|| '',
      date: format(new Date(date), 'dd/MM/yyyy') || '',
      hour: hour || '',
      symptom: symptom || '',
      profilepic: profilepic || '',
      status: status || ''
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [consultation]
  );

  const methods = useForm({
    defaultValues,
  });

  const {
    reset,
    watch,
    control,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const back = async () => {
    navigate(PATH_DASHBOARD.user.list);
  };

  const cancel = async () => {
    try {
      await axios.post('/api/user/consultation/cancelconsult', {
        _id: consultation[0]._id
      });
      enqueueSnackbar('Hủy lịch thành công');
      window.location.replace('http://localhost:2542/dashboard/user/list')
    } catch (err) {
      console.error(err);
      enqueueSnackbar('Có lỗi xảy ra, vui lòng thử lại!');
    }
  };

  const changesymptom = async (data) => {
    try {
      await axios.put('/api/user/consultation/consultsymptom', {
        _id: consultation[0]._id,
        symptom: data.symptom
      });
      enqueueSnackbar('Thay đổi triệu chứng thành công');
    } catch (err) {
      console.error(err);
      enqueueSnackbar('Có lỗi xảy ra, vui lòng thử lại!');
    }
  };

  return (
    <FormProvider methods={methods}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card sx={{ py: 10, px: 3 }}>
            <Label
              color={(status === "chờ xác nhận" && 'warning') || (status === "chờ khám" && 'info') || (status === 'đã hủy' && 'error') || (status === 'đã hoàn thành' && 'success')}
              sx={{ textTransform: 'uppercase', position: 'absolute', top: 24, right: 24 }}
            >
              {status}
            </Label>

            <Box sx={{ mb: 5 }}>
              <Avatar
                src={profilepic}
                alt={`${lname} ${fname}`}
                color={profilepic ? 'default' : createAvatar(`${lname} ${fname}`).color}
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
            </Box>

            <CardHeader title="Thông tin chung" />

            <Stack spacing={2} sx={{ p: 3 }}>
        <Typography variant="body2">{description}</Typography>

        <Stack direction="row">
          <IconStyle icon={'eva:pin-fill'} />
          <Typography variant="body2">
            Chứng chỉ hành nghề:&nbsp;
            <Link component="span" variant="subtitle2" color="text.primary">
              {workcertificate}
            </Link>
          </Typography>
        </Stack>

        <Stack direction="row">
          <IconStyle icon={'eva:email-fill'} />
          <Typography variant="body2">{level}</Typography>
        </Stack>

        <Stack direction="row">
          <IconStyle icon={'ic:round-business-center'} />
          <Typography variant="body2">
            {department} tại&nbsp;
            <Link component="span" variant="subtitle2" color="text.primary">
              Văn Lang Doctor
            </Link>
          </Typography>
        </Stack>

        <Stack direction="row">
          <IconStyle icon={'ic:round-business-center'} />
          <Typography variant="body2">
            Tốt nghiệp&nbsp;
            <Link component="span" variant="subtitle2" color="text.primary">
              {educationplace}
            </Link>
          </Typography>
        </Stack>
      </Stack>
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Card sx={{ p: 3 }}>
            <Box
              sx={{
                display: 'grid',
                columnGap: 2,
                rowGap: 3,
                gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' },
              }}
            >
              <RHFTextField name="date" label="Ngày hẹn" disabled/>
              <RHFTextField name="hour" label="Giờ hẹn" disabled/>
            </Box>

            <Stack sx={{ mt: 3 }}>
              <Box 
                sx={{
                  display: 'grid',
                  columnGap: 2,
                  rowGap: 3,
                  gridTemplateColumns: { xs: 'repeat(1, 2fr)', sm: 'repeat(1, 2fr)' },
                }}
              >
                { status === 'chờ xác nhận' ? 
                  <RHFTextField name="symptom" multiline rows={4} label="Triệu chứng"/>
                  :
                  <RHFTextField name="symptom" multiline rows={4} label="Triệu chứng" disabled/>
                }
                
              </Box>
            </Stack>
            
            {status === 'đã hủy' || status === 'đã hoàn thành' ?
            <Stack alignItems="flex-end"  sx={{ mt: 3 }}>
              <Box
                sx={{
                  display: 'grid',
                  columnGap: 1,
                  rowGap: 1,
                  gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(1, 1fr)' },
                }}
              >
                <Button onClick={handleSubmit(back)} variant="contained">
                  Trở về
                </Button>
              </Box> 
            </Stack>
            :
            <Stack alignItems="flex-end" sx={{ mt: 3 }}>
              <Box
                sx={{
                  display: 'grid',
                  columnGap: 1,
                  rowGap: 1,
                  gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' },
                }}
              >
                {status === 'chờ xác nhận' ? 
                  <Tooltip title="Lưu lại triệu chứng mới">
                    <LoadingButton type="submit" variant="text" loading={isSubmitting} onClick={handleSubmit(changesymptom)} sx={{ position: 'absolute', low: 12, left: 24 }}>
                      Lưu thay đổi
                    </LoadingButton>
                  </Tooltip>
                  :
                  <Label
                    variant='contained'
                    sx={{ position: 'absolute', low: 12, left: 24, width: "auto" }}
                  >
                    Ghi chú: {roomname}
                  </Label>
                } 

                <Button onClick={handleSubmit(back)} variant="outlined">
                  Trở về
                </Button>                

                {status === 'chờ xác nhận' ?
                  <LoadingButton type="submit" variant="contained" loading={isSubmitting} onClick={handleSubmit(cancel)}>
                    Hủy lịch hẹn
                  </LoadingButton>        
                  :
                  <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                    Tham gia buổi tư vấn
                  </LoadingButton>  
                }
              </Box> 
            </Stack>
            }
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}

import PropTypes from 'prop-types';
import * as Yup from 'yup';
import merge from 'lodash/merge';
import { isBefore, format } from 'date-fns';
import { useSnackbar } from 'notistack';
import { useCallback, useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// form
import { useForm, Controller } from 'react-hook-form';
import { styled } from '@mui/material/styles';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import {  Box,
  Card,
  Grid,
  Stack,
  Typography,
  Button,
  Tooltip,
  Link,
  CardHeader,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  IconButton,} from '@mui/material';
import { LoadingButton, MobileDateTimePicker } from '@mui/lab';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import CancelIcon from '@mui/icons-material/Cancel';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import DuoIcon from '@mui/icons-material/Duo';
import CheckIcon from '@mui/icons-material/Check';
import { getAwaitConsultation } from '../../../redux/slices/calendar';
import createAvatar from '../../../utils/createAvatar';

import axios from '../../../utils/axios';
import useAuth from '../../../hooks/useAuth';

// components
import Label from '../../../components/Label';
import Avatar from '../../../components/Avatar';
import Iconify from '../../../components/Iconify';
import { ColorSinglePicker } from '../../../components/color-utils';
import { FormProvider, RHFTextField, RHFSwitch } from '../../../components/hook-form';

// ----------------------------------------------------------------------

const COLOR_OPTIONS = [
  '#00AB55', // theme.palette.primary.main,
  '#1890FF', // theme.palette.info.main,
  '#54D62C', // theme.palette.success.main,
  '#FFC107', // theme.palette.warning.main,
  '#FF4842', // theme.palette.error.main
  '#04297A', // theme.palette.info.darker
  '#7A0C2E', // theme.palette.error.darker
];

// ----------------------------------------------------------------------

CalendarForm.propTypes = {
  event: PropTypes.object,
  range: PropTypes.object,
  consultation: PropTypes.object,
};

export default function CalendarForm({ consultation }) {
  const IconStyle = styled(Iconify)(({ theme }) => ({
    width: 20,
    height: 20,
    marginTop: 1,
    flexShrink: 0,
    marginRight: theme.spacing(2),
  }));

  const { enqueueSnackbar } = useSnackbar();

  const { date, hour, status, symptom, name, phone, _id, roomname, excuse } = consultation;

  const dispatch = useDispatch();

  const requestname = `${lname} ${fname}`;

  const { bloodtype, height, weight, pastmedicalhistory, drughistory, familyhistory } = consultation.user;

  const { fname, lname, profilepic, gender } = consultation.user.account;
  
  const { account } = useAuth();

  const identity = `Bác sĩ ${account.lname} ${account.fname}`;

  const { events } = useSelector((state) => state.events);

  useEffect(() => {
    dispatch(getAwaitConsultation());
  }, [dispatch]);

  useEffect(() => {
    reset(events);
  }, [events]);

  const EventSchema = Yup.object().shape({});

  const defaultValues = useMemo(
    () => ({
      username: name || requestname,
      phone: phone || '',
      date: format(new Date(date), 'dd/MM/yyyy') || '',
      hour: hour || '',
      symptom: symptom || '',
      profilepic: profilepic || '',
      status: status || '',
      excusetext: excuse || '',
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [consultation]
  );

  const methods = useForm({
    resolver: yupResolver(EventSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  const isDateError = isBefore(new Date(values.end), new Date(values.start));

  const handleCreateNameAndRoomName = async () => {
    window.open(`https://vldchatroom.herokuapp.com/room/${_id}/${identity}`);
    try {
      await axios.post('/api/doctor/consultation/createRoomName', {
        _id: consultation._id,
      });
    } catch (err) {
      console.error(err);
      enqueueSnackbar('Có lỗi xảy ra, vui lòng thử lại!', { variant: 'error' });
    }
    try {
      await axios.post('/api/doctor/consultation/joinRoomNoti', {
        _id: consultation._id,
        doctor: consultation.doctor,
        user: consultation.user,
        date: consultation.date,
        hour: consultation.hour,
      });
    } catch (err) {
      console.error(err);
      enqueueSnackbar('Có lỗi xảy ra, vui lòng thử lại!', { variant: 'error' });
    }
  };

  let noRoomName = false;

  if (!roomname) {
    noRoomName = true;
  }

  return (
    <FormProvider methods={methods}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card sx={{ py: 10, px: 3 }}>
            <Label
              color={
                (status === 'chờ khám' && 'info')
              }
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

            <Stack spacing={2} sx={{ p: 3 }}>
              <Stack direction="row">
                <IconStyle icon={'ic:outline-bloodtype'} />
                <Typography variant="body2">
                  Nhóm máu:&nbsp;
                  <Link component="span" variant="subtitle2" color="text.primary">
                    {bloodtype}
                  </Link>
                </Typography>
              </Stack>

              <Stack direction="row">
                <IconStyle icon={'mdi:human-male-height'} />
                <Typography variant="body2">
                  Chiều cao:&nbsp;
                  <Link component="span" variant="subtitle2" color="text.primary">
                    {height}cm
                  </Link>
                </Typography>
              </Stack>

              <Stack direction="row">
                <IconStyle icon={'icon-park-outline:weight'} />
                <Typography variant="body2">
                  Cân nặng:&nbsp;
                  <Link component="span" variant="subtitle2" color="text.primary">
                    {weight} kg
                  </Link>
                </Typography>
              </Stack>

              <Stack direction="row">
                <IconStyle icon={'bi:file-earmark-medical'} />
                <Typography variant="body2">
                  Tiền sử bệnh lý:&nbsp;
                  <Link component="span" variant="subtitle2" color="text.primary">
                    {pastmedicalhistory}
                  </Link>
                </Typography>
              </Stack>

              <Stack direction="row">
                <IconStyle icon={'healthicons:medicines'} />
                <Typography variant="body2">
                  Tiền sử dị ứng:&nbsp;
                  <Link component="span" variant="subtitle2" color="text.primary">
                    {drughistory}
                  </Link>
                </Typography>
              </Stack>

              <Stack direction="row">
                <IconStyle icon={'carbon:pedestrian-family'} />
                <Typography variant="body2">
                  Tiền sử gia đình:&nbsp;
                  <Link component="span" variant="subtitle2" color="text.primary">
                    {familyhistory}
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
              <RHFTextField name="username" label="Họ tên người hẹn" disabled />
              <RHFTextField name="phone" label="Số điện thoại người hẹn" disabled />
              <RHFTextField name="date" label="Ngày hẹn" disabled />
              <RHFTextField name="hour" label="Giờ hẹn" disabled />
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
                <RHFTextField name="symptom" multiline rows={3} label="Triệu chứng" disabled />
                {status === 'bị từ chối' && <RHFTextField name="excusetext" label="Lý do từ chối" disabled />}
                {status === 'đã hủy' && <RHFTextField name="excusetext" label="Lý do hủy" disabled />}
              </Box>
            </Stack>

            {status === 'bị từ chối' || status === 'đã hủy' || status === 'đã hoàn thành' ? (
              <Stack alignItems="flex-end" sx={{ mt: 3 }}>
                <Box
                  sx={{
                    display: 'grid',
                    columnGap: 1,
                    rowGap: 1,
                    gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(1, 1fr)' },
                  }}
                >
                  <Tooltip title="Trở về">
                    <IconButton >
                      <ArrowBackIosNewIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Stack>
            ) : (
              <Stack alignItems="flex-end" sx={{ mt: 3 }}>
                {status === 'chờ xác nhận' ? (
                  <Box
                    sx={{
                      display: 'grid',
                      columnGap: 1,
                      rowGap: 1,
                      gridTemplateColumns: { xs: 'repeat(3, 1fr)', sm: 'repeat(3, 1fr)' },
                    }}
                  >
                    <Tooltip title="Trở về">
                      <IconButton >
                        <ArrowBackIosNewIcon />
                      </IconButton>
                    </Tooltip>

                    {status === 'chờ xác nhận' ? (
                      <Tooltip title="Từ chối lịch hẹn">
                        <IconButton color="error" >
                          <CancelIcon />
                        </IconButton>
                      </Tooltip>
                    ) : (
                      <Tooltip title="Tham gia buổi tư vấn">
                        <IconButton color="info" onClick={handleCreateNameAndRoomName}>
                          <DuoIcon />
                        </IconButton>
                      </Tooltip>
                    )}

                    {status === 'chờ xác nhận' && (
                      <Tooltip title="Xác nhận lịch hẹn">
                        <IconButton color="success" >
                          <CheckIcon />
                        </IconButton>
                      </Tooltip>
                    )}
                  </Box>
                ) : (
                  <Box
                    sx={{
                      display: 'grid',
                      columnGap: 1,
                      rowGap: 0.5,
                      gridTemplateColumns: { xs: 'repeat(4, 1fr)', sm: 'repeat(4, 1fr)' },
                    }}
                  >
                    <Tooltip title="Trở về">
                      <IconButton onClick>
                        <ArrowBackIosNewIcon />
                      </IconButton>
                    </Tooltip>

                    

                   

                    {status === 'chờ xác nhận' ? (
                      <Tooltip title="Từ chối lịch hẹn">
                        <IconButton color="error" onClick>
                          <CancelIcon />
                        </IconButton>
                      </Tooltip>
                    ) : (
                      <Tooltip title="Tham gia buổi tư vấn">
                        <IconButton color="info" onClick={handleCreateNameAndRoomName}>
                          <DuoIcon />
                        </IconButton>
                      </Tooltip>
                    )}
                  </Box>
                )}
              </Stack>
            )}
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}

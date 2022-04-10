import PropTypes from 'prop-types';
import { useMemo, useState } from 'react';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
// form
import { useForm } from 'react-hook-form';
// @mui
import { LoadingButton } from '@mui/lab';
import { styled } from '@mui/material/styles';
import { Box, Card, Grid, Stack, Typography, Button, Tooltip, Link, CardHeader, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
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

DoctorConsultationDetail.propTypes = {
  consultation: PropTypes.array,
};

export default function DoctorConsultationDetail({ consultation }) {
  const IconStyle = styled(Iconify)(({ theme }) => ({
    width: 20,
    height: 20,
    marginTop: 1,
    flexShrink: 0,
    marginRight: theme.spacing(2),
  }));

  const navigate = useNavigate();

  const { date, hour, status, symptom, name, phone } = consultation[0];

  const { fname, lname, profilepic } = consultation[0].user.account;

  const { bloodtype, height, weight, pastmedicalhistory, drughistory, familyhistory } = consultation[0].user;

  const requestname = `${lname} ${fname}`;

  const { enqueueSnackbar } = useSnackbar();  

  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const cancelAndClose = () => {
    cancel();
    handleClose();
  }

  const defaultValues = useMemo(
    () => ({
      username: name|| requestname,
      phone: phone || '',
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
    navigate(PATH_DASHBOARD.user.doctorlist);
  };

  const cancel = async () => {
    try {
      await axios.post('/api/doctor/consultation/cancelconsultation', {
        _id: consultation[0]._id,
      });
      enqueueSnackbar('Từ chối lịch hẹn thành công');
      navigate(PATH_DASHBOARD.user.doctorlist);
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

  const confirm = async () => {
    try {
      await axios.post('/api/doctor/consultation/confirmconsultation', {
        _id: consultation[0]._id,
      });
      enqueueSnackbar('Xác nhận buổi hẹn thành công');
      navigate(PATH_DASHBOARD.user.doctorlist);
    } catch (err) {
      console.error(err);
      enqueueSnackbar('Có lỗi xảy ra, vui lòng thử lại!', { variant: 'error' });
    }
  };

  return (
    <FormProvider methods={methods}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card sx={{ py: 10, px: 3 }}>
            <Label
              color={(status === "chờ xác nhận" && 'warning') || (status === "chờ khám" && 'info') || (status === 'bị từ chối' && 'error') || (status === 'đã hoàn thành' && 'success')}
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
              {height}
            </Link>
          </Typography>
        </Stack>

        <Stack direction="row">
          <IconStyle icon={'icon-park-outline:weight'} />
          <Typography variant="body2">
            Cân nặng:&nbsp;
            <Link component="span" variant="subtitle2" color="text.primary">
              {weight}
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
              <RHFTextField name="username" label="Họ tên người hẹn" disabled/>
              <RHFTextField name="phone" label="Số điện thoại người hẹn" disabled/>
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
            
            {status === 'bị từ chối' || status === 'đã hoàn thành' ?
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
              {status === 'chờ xác nhận' ? 
                <Box
                sx={{
                  display: 'grid',
                  columnGap: 1,
                  rowGap: 1,
                  gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(3, 1fr)' },
                }}
              >
                {status === 'chờ xác nhận' ? 
                  <Tooltip title="Lưu lại triệu chứng mới">
                    <Button variant="text" onClick={handleSubmit(changesymptom)} sx={{ position: 'absolute', low: 12, left: 24 }}>
                      Lưu thay đổi
                    </Button>
                  </Tooltip>
                  :
                  <LoadingButton variant="text" loading={isSubmitting} onClick={handleClickOpen} sx={{ position: 'absolute', low: 12, left: 24 }}>
                    Từ chối lịch hẹn
                  </LoadingButton>
                } 

                <Button onClick={handleSubmit(back)} variant="outlined">
                  Trở về
                </Button>                

                {status === 'chờ xác nhận' ?
                  <LoadingButton variant="contained" color='error' loading={isSubmitting} onClick={handleClickOpen}>
                    Từ chối lịch hẹn
                  </LoadingButton>        
                  :
                  <LoadingButton variant="contained" loading={isSubmitting}>
                    Tham gia buổi tư vấn
                  </LoadingButton>  
                }
                
                {status === 'chờ xác nhận' &&
                  <LoadingButton variant="contained" color='info' loading={isSubmitting} onClick={handleSubmit(confirm)}>
                    Xác nhận lịch hẹn
                  </LoadingButton>        
                } 
              </Box>
              :
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
                    <Button variant="text" onClick={handleSubmit(changesymptom)} sx={{ position: 'absolute', low: 12, left: 24 }}>
                      Lưu thay đổi
                    </Button>
                  </Tooltip>
                  :
                  <LoadingButton variant="text" color='error' loading={isSubmitting} onClick={handleClickOpen} sx={{ position: 'absolute', low: 12, left: 24 }}>
                    Từ chối lịch hẹn
                  </LoadingButton>
                } 

                <Button onClick={handleSubmit(back)} variant="outlined">
                  Trở về
                </Button>                

                {status === 'chờ xác nhận' ?
                  <LoadingButton variant="contained" color='error' loading={isSubmitting} onClick={handleClickOpen}>
                    Từ chối lịch hẹn
                  </LoadingButton>        
                  :
                  <LoadingButton variant="contained" color='info' loading={isSubmitting}>
                    Tham gia buổi tư vấn
                  </LoadingButton>  
                }
          
              </Box>
              
              }
            </Stack>
            }
            <Dialog
              open={open}
              onClose={handleClose}
            >
            <DialogTitle sx={{ m: 1, p: 2 }}>
              {"Bạn muốn từ chối lịch hẹn?"}
            </DialogTitle>
            <DialogContent>
              <DialogContentText>
                Buổi hẹn sẽ hiển thị ở trạng thái bị từ chối ở phía người dùng sau khi nhấp đồng ý, bạn có muốn tiếp tục?
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>Trở về</Button>
              <Button variant='contained' onClick={cancelAndClose} autoFocus>
                Đồng ý
              </Button>
            </DialogActions>
            </Dialog>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}

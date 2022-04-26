import { useParams, useLocation, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { format } from 'date-fns';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { LoadingButton } from '@mui/lab';
import {
  Card,
  Grid,
  Stack,
  Typography,
  Container,
  Table,
  TableBody,
  TableContainer,
  Button,
  Divider,
  Avatar
} from '@mui/material';// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// hooks
import useSettings from '../../hooks/useSettings';
// _mock_
import { _invoices } from '../../_mock/_invoice';
// components
import { FormProvider, RHFTextField } from '../../components/hook-form';
import Page from '../../components/Page';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
// sections
import InvoiceNewEditForm from '../../sections/@dashboard/invoice/new-edit-form';

// ----------------------------------------------------------------------

export default function InvoiceEdit() {
  const { themeStretch } = useSettings();

  const methods = useForm({
    resolver: yupResolver()
  });

  const {
    reset,
    watch,
    control,
    setValue,
    getValues,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const location = useLocation();

  const cursor = true;

  return (
    <Page title="Toa thuốc: Cập nhật">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Cập nhật toa thuốc"
          links={[
            { name: 'Bảng điều khiển', href: PATH_DASHBOARD.root },
            { name: `Chi tiết lịch hẹn ngày ${format(new Date(location.state.date1), 'dd/MM/yyyy')} lúc ${location.state.hour1}`, href: PATH_DASHBOARD.prescription.view(location.state.id) },
            { name: 'Cập nhật toa thuốc' },
          ]}
        />
      <FormProvider methods={methods} onSubmit={handleSubmit()} >
          <Card sx={{ pt: 5, px: 5 }}>
            <Grid container>
              <Grid item xs={4} sm={4} sx={{ mb: 4 }}>
                <Typography paragraph variant="overline" sx={{ color: 'text.disabled' }}>
                  Thông tin cơ bản
                </Typography>
                <Typography variant="body2">Triệu chứng: {location.state.symptom1}</Typography>
                <Typography variant="body2">Tiền sử bệnh: {location.state.pastmedicalhistory1}</Typography>
                <Typography variant="body2">Tiền sử dị ứng thuốc: {location.state.drughistory1}</Typography>
                <Typography variant="body2">Tiền sử gia đình: {location.state.familyhistory1}</Typography>
              </Grid>

              <Grid item xs={4} sm={4} sx={{ mb: 4 }}>
                <Typography paragraph variant="overline" sx={{ color: 'text.disabled' }}>
                  Thông tin bệnh nhân
                </Typography>
                <Typography variant="body2">Họ và tên: {location.state.name1}</Typography>
                <Typography variant="body2">Giới tính: {location.state.gender1 === 1 && 'Nam' || location.state.gender1 === 2 && 'Nữ' || location.state.gender1 === 3 && 'Không xác định' || location.state.gender1 === null && 'Không xác định'}</Typography>
                <Typography variant="body2">Cân nặng: {location.state.weight1}</Typography>
                <Typography variant="body2">Chiều cao: {location.state.height1}</Typography>
              </Grid>
            </Grid>
            <Grid container>
              <Grid item xs={12} md={12}>
                <Card sx={{ p: 3 }}>
                  <Stack spacing={3}>
                    <RHFTextField autoFocus={cursor} name="pname" label="Tên toa thuốc" defaultValue={location.state.pname1} />

                    <div>
                      <RHFTextField name="diagnosis" multiline rows={4} label="Chuẩn đoán" defaultValue={location.state.diagnosis1} />
                    </div>

                    <div>
                      <RHFTextField name="note" label="Ghi chú" defaultValue={location.state.note1} />
                    </div>

                    <Divider sx={{ borderStyle: 'dashed' }} />

                    <div>
                    
                      <Stack alignItems="flex-end" spacing={3} sx={{ mt: 3 }}>
                        <LoadingButton type="submit" variant="contained" size="large" loading={isSubmitting} >
                          Cập nhật toa thuốc
                        </LoadingButton>
                      </Stack>
                    </div>
                  </Stack>
                </Card>
              </Grid>
              <Grid item xs={12} md={12}>
                <Stack alignItems="flex-end" spacing={3} sx={{ mt: 3 }}/>
              </Grid>
            </Grid>
          </Card>
        </FormProvider>
      </Container>
    </Page>
  );
}

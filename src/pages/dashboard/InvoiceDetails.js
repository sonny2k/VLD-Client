import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import unorm from 'unorm';
// @mui
import { Container } from '@mui/material';
// utils
import axios from '../../utils/axios';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// _mock_
import { _invoices } from '../../_mock/_invoice';
// hooks
import useSettings from '../../hooks/useSettings';
import useAuth from '../../hooks/useAuth';
// components
import Page from '../../components/Page';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
// sections
import Invoice from '../../sections/@dashboard/invoice/details';
import LoadingScreen from '../../components/LoadingScreen';

// ----------------------------------------------------------------------

export default function InvoiceDetails() {
  const { themeStretch } = useSettings();

  const { account } = useAuth();

  const { idne } = useParams();

  const [pre, setPre] = useState(null);

  useEffect(() => {
    getPrescription();
  }, [pre]);

  const getPrescription = async () => {
    try {
      const res = await axios.get(`/api/user/prescription/viewPrescription/${idne}`);
      setPre(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    pre !== null && (
      <Page title="Toa thuốc: Xem chi tiết">
        <Container maxWidth={themeStretch ? false : 'lg'}>
          {unorm.nfkd(account.role).toLowerCase().indexOf(unorm.nfkd('Người dùng').toLowerCase()) !== -1 ? (
            <HeaderBreadcrumbs
              heading="Chi tiết toa thuốc"
              links={[
                { name: 'Bảng điều khiển', href: PATH_DASHBOARD.root },
                {
                  name: 'Danh sách lịch hẹn',
                  href: PATH_DASHBOARD.user.list,
                },
                { name: `Toa thuốc của buổi hẹn ngày ${pre.consultation.consultation.date}` || '' },
              ]}
            />
          ) : (
            <HeaderBreadcrumbs
              heading="Chi tiết toa thuốc"
              links={[
                { name: 'Bảng điều khiển', href: PATH_DASHBOARD.root },
                {
                  name: 'Danh sách lịch hẹn',
                  href: PATH_DASHBOARD.user.doctorlist,
                },
                { name: `Toa thuốc của buổi hẹn ngày ${pre.consultation.consultation.date}` || '' },
              ]}
            />
          )}

          <Invoice pre={pre} />
        </Container>
      </Page>
    )
  );
}

import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
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
// components
import Page from '../../components/Page';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
// sections
import Invoice from '../../sections/@dashboard/invoice/details';
import LoadingScreen from '../../components/LoadingScreen';

// ----------------------------------------------------------------------

export default function InvoiceDetails() {
  const { themeStretch } = useSettings();

  const { idne } = useParams();

  console.log(idne);

  const [pre, setPre] = useState(null);

  useEffect(() => {
    getPrescription();
  }, []);

  const getPrescription = async () => {
    try {
      const res = await axios.get(`/api/user/prescription/viewPrescription/${idne}`)
      setPre(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  return pre !== null ? (
    <Page title="Toa thuốc: Xem chi tiết">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Chi tiết toa thuốc"
          links={[
            { name: 'Bảng điều khiển', href: PATH_DASHBOARD.root },
            {
              name: 'Toa thuốc',
              href: PATH_DASHBOARD.prescription.root,
            },
            { name: `Toa thuốc của buổi hẹn ngày ${pre.consultation.consultation.date}` || '' },
          ]}
        />

        <Invoice pre={pre} />
      </Container>
    </Page>
  ) : (
    <LoadingScreen />
  );
}

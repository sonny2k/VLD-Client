import { useEffect,useState } from 'react';

// @mui
import { Container } from '@mui/material';
// utils
import axios from '../../utils/axios';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// hooks
import useSettings from '../../hooks/useSettings';
// components
import Page from '../../components/Page';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
// sections
import InvoiceNewEditForm from '../../sections/@dashboard/invoice/new-edit-form';
import LoadingScreen from '../../components/LoadingScreen';

// ----------------------------------------------------------------------

export default function InvoiceCreate() {
  const { themeStretch } = useSettings();

  const [prod, setProd] = useState(null);
  useEffect(() => {
    getProd();
  }, []);
  const getProd = async () => {
    try {
      const res = await axios.get(`/api/admin/product/viewProduct`)
      setProd(res.data);
    } catch (err) {
      console.error(err);
    }
  };
  return prod !== null ? (
    <Page title="Toa thuốc: Tạo toa thuốc mới">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Tạo toa thuốc mới"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Toa thuốc', href: PATH_DASHBOARD.prescription.list },
            { name: 'Toa thuốc mới' },
          ]}
        />

        <InvoiceNewEditForm prod = {prod} />
      </Container>
    </Page>
  ) : (
    <LoadingScreen />
  );
}

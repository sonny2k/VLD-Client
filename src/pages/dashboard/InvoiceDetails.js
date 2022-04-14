import { useParams } from 'react-router-dom';
// @mui
import { Container } from '@mui/material';
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

// ----------------------------------------------------------------------

export default function InvoiceDetails() {
  const { themeStretch } = useSettings();

  const { id } = useParams();

  const invoice = _invoices.find((invoice) => invoice.id === id);

  return (
    <Page title="Toa thuốc: Xem chi tiết">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Chi tiết toa thuốc"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            {
              name: 'Toa thuốc',
              href: PATH_DASHBOARD.invoice.root,
            },
            { name: invoice?.invoiceNumber || '' },
          ]}
        />

        <Invoice invoice={invoice} />
      </Container>
    </Page>
  );
}

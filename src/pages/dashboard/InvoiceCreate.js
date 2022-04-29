// @mui
import { Container } from '@mui/material';
import { format } from 'date-fns';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState, useCallback } from 'react';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// hooks
import useSettings from '../../hooks/useSettings';
// utils
import { getMedicines } from '../../redux/slices/medicine';
// components
import Page from '../../components/Page';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
// sections
import InvoiceNewEditForm from '../../sections/@dashboard/invoice/new-edit-form';

// ----------------------------------------------------------------------

export default function InvoiceCreate() {
  const { themeStretch } = useSettings();

  const location = useLocation();

  const date = location.state.date1;
  const hour = location.state.hour1;
  const name = location.state.name;
  const id = location.state.id;
  const gender = location.state.gender1;
  const weight = location.state.weight1;
  const height = location.state.height1;
  const symptom = location.state.symptom1;
  const pastmedicalhistory = location.state.pastmedicalhistory1;
  const drughistory = location.state.drughistory1;
  const familyhistory = location.state.familyhistory1;

  const dispatch = useDispatch();
  const { medicines } = useSelector((state) => state.medicine);

  useEffect(() => {
    dispatch(getMedicines());
  }, [dispatch]);

  return (
    <Page title="Tạo toa thuốc">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Tạo toa thuốc mới"
          links={[
            { name: 'Bảng điều khiển', href: PATH_DASHBOARD.root },
            {
              name: `Chi tiết lịch hẹn ngày ${format(new Date(date), 'dd/MM/yyyy')} lúc ${hour}`,
              href: PATH_DASHBOARD.user.edit(location.state.id),
            },
            { name: 'Toa thuốc mới' },
          ]}
        />

        <InvoiceNewEditForm
          products={medicines}
          name={name}
          id={id}
          gender={gender}
          weight={weight}
          height={height}
          symptom={symptom}
          pastmedicalhistory={pastmedicalhistory}
          drughistory={drughistory}
          familyhistory={familyhistory}
        />
      </Container>
    </Page>
  );
}

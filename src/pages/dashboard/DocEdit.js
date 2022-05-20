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
import axios from '../../utils/axios';
// components
import Page from '../../components/Page';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
// sections
import { EditDoc } from '../../sections/@dashboard/user/account';

// ----------------------------------------------------------------------

export default function DocEdit() {
  const { themeStretch } = useSettings();

  const Location = useLocation();

  const [depas, setDepas] = useState(null);

  useEffect(() => {
    getDepas();
  }, [depas]);

  const getDepas = async () => {
    try {
      const res = await axios.get('/api/admin/department/viewListDepartment');
      setDepas(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    depas !== null && (
      <Page title="Cập nhật bác sĩ ">
        <Container maxWidth={themeStretch ? false : 'lg'}>
          <HeaderBreadcrumbs
            heading="Cập nhật bác sĩ "
            links={[
              { name: 'Bảng điều khiển', href: PATH_DASHBOARD.root },
              {
                name: 'Danh sách',
                href: PATH_DASHBOARD.user.doclist,
              },
              { name: `Cập nhật bác sĩ ${Location.state.fname1}` },
            ]}
          />

          <EditDoc
            depa={depas}
            id2={Location.state.id1}
            educationplace2={Location.state.educationplace1}
            workcertificate2={Location.state.workcertificate1}
            level2={Location.state.level1}
            description2={Location.state.description1}
            excellence2={Location.state.excellence1}
            workhistory2={Location.state.workhistory1}
            education2={Location.state.education1}
            degree2={Location.state.degree1}
            department2={Location.state.department1}
          />
        </Container>
      </Page>
    )
  );
}

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
      <Page title="Sửa chi tiết bác sĩ ">
        <Container maxWidth={themeStretch ? false : 'lg'}>
          <HeaderBreadcrumbs
            heading="Sửa chi tiết bác sĩ "
            links={[
              { name: 'Bảng điều khiển', href: PATH_DASHBOARD.root },
              {
                name: 'Danh sách',
                href: PATH_DASHBOARD.user.doclist,
              },
              { name: 'Sửa chi tiết bác sĩ' },
            ]}
          />

          <EditDoc 
          depa={depas}
          id={Location.state.id1}
          educationplace={Location.state.educationplace1}
          workcertificate={Location.state.workcertificate1}
          level={Location.state.level1}
          description={Location.state.description1}
          excellence={Location.state.excellence1}
          workhistory={Location.state.workhistory1}
          education={Location.state.education1}
          degree={Location.state.degreee1}
          department={Location.state.department1}

           />
        </Container>
      </Page>
    )
  );
}

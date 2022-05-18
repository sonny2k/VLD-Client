import { useEffect, useState } from 'react';
import { paramCase } from 'change-case';
import { useParams, useLocation } from 'react-router-dom';

// @mui
import { Container } from '@mui/material';
// utils
import axios from '../../utils/axios';
// redux
import { useDispatch, useSelector } from '../../redux/store';
import { getProducts } from '../../redux/slices/product';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// hooks
import useSettings from '../../hooks/useSettings';
// components
import Page from '../../components/Page';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';

import { CreateDoc } from '../../sections/@dashboard/user/account';

// ----------------------------------------------------------------------

export default function DocCreate() {
  const { themeStretch } = useSettings();
  const isEdit = false;

  const [deps, setDeps] = useState([]);

  useEffect(() => {
    async function getDepartments() {
      const URL = '/api/admin/department/viewListDepartment';
      try {
        const res = await axios.get(URL);
        setDeps(res.data);
      } catch (error) {
        console.log(error);
      }
    }
    getDepartments();
  }, []);

  return (
    <Page title="Bác sĩ: Thêm mới bác sĩ">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={!isEdit ? 'Thêm mới bác sĩ' : 'Sửa bác sĩ'}
          links={[
            { name: 'Bảng điều khiển', href: PATH_DASHBOARD.root },
            {
              name: 'Danh sách',
              href: PATH_DASHBOARD.user.doclist,
            },
            { name: !isEdit ? 'Thêm bác sĩ' : 'Chỉnh sửa bác sĩ' },
          ]}
        />
        <CreateDoc depa={deps} />
      </Container>
    </Page>
  );
}

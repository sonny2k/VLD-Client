import { useEffect,useState } from 'react';
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
import ProductNewForm from '../../sections/@dashboard/e-commerce/ProductNewForm';
import { CreateDepartment } from '../../sections/@dashboard/user/account';

// ----------------------------------------------------------------------

export default function DepartmentEdit() {
  const { themeStretch } = useSettings();
  const Location = useLocation();
  let isEdit = false
  if ( Location.state.id1 && Location.state.name1 && Location.state.description1 !== null) {
    isEdit=true
  }

  return (
    <Page title="Chuyên khoa: Thêm mới chuyên khoa">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={!isEdit ? 'Thêm mới chuyên khoa' : 'Sửa chuyên khoa'}
          links={[
            { name: 'Bảng điều khiển', href: PATH_DASHBOARD.root },
            {
              name: 'Danh sách',
              href: PATH_DASHBOARD.user.department,
            },
            { name: !isEdit ? 'Thêm chuyên khoa' : 'Chỉnh sửa chuyên khoa' },
          ]}
        />
        {isEdit === true &&
        <CreateDepartment id={Location.state.id1} name={Location.state.name1} description={Location.state.description1}  isEdit={isEdit}  /> }
        {isEdit === false &&
         <CreateDepartment id={"name"} name={"name"} description={"name"}  isEdit={isEdit}  />
        }
        
      </Container>
    </Page>
  );
}

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
import { CreateSupplier } from '../../sections/@dashboard/user/account';

// ----------------------------------------------------------------------

export default function SupplierEdit() {
  const { themeStretch } = useSettings();
  const Location = useLocation();
  let isEdit = false
  if ( Location.state.id1 && Location.state.name1 && Location.state.description1 !== null) {
    isEdit=true
  }

  return (
    <Page title="Nhà cung cấp: Thêm mới nhà cung cấp">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={!isEdit ? 'Thêm mới nhà cung cấp' : 'Sửa nhà cung cấp'}
          links={[
            { name: 'Bảng điều khiển', href: PATH_DASHBOARD.root },
            {
              name: 'Danh sách',
              href: PATH_DASHBOARD.user.supplierlist,
            },
            { name: !isEdit ? 'Thêm nhà cung cấp' : 'Chỉnh sửa nhà cung cấp' },
          ]}
        />
        {isEdit === true &&
        <CreateSupplier id={Location.state.id1} name={Location.state.name1} description={Location.state.description1}  isEdit={isEdit}  /> }
        {isEdit === false &&
         <CreateSupplier id={"name"} name={"name"} description={"name"}  isEdit={isEdit}  />
        }
        
      </Container>
    </Page>
  );
}

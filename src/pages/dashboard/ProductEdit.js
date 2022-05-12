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
import ProductEditForm from '../../sections/@dashboard/e-commerce/ProductEditForm';

// ----------------------------------------------------------------------

export default function ProductCreate() {
  const { themeStretch } = useSettings();

  const Location = useLocation();
  let isEdit = false
  if ( Location.state.id1 && Location.state.title1 && Location.state.description1 && Location.state.specdes1 && Location.state.unit1 && Location.state.components1 && Location.state.origin1 && Location.state.image1 !== null) {
    isEdit=true
  }

  const [medCate, setMedCate] = useState(null);

  useEffect(() => {
    getMedCates();
  }, [medCate]);

  const getMedCates = async () => {
    try {
      const res = await axios.get('/api/admin/product/viewProductCategory');
      setMedCate(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    medCate !== null && (
      <Page title="Sửa sản phẩm ">
        <Container maxWidth={themeStretch ? false : 'lg'}>
          <HeaderBreadcrumbs
            heading="Sửa sản phẩm "
            links={[
              { name: 'Bảng điều khiển', href: PATH_DASHBOARD.root },
              {
                name: 'Danh sách',
                href: PATH_DASHBOARD.user.productlist,
              },
              { name: 'Sửa sản phẩm' },
            ]}
          />
            {isEdit === true &&
          <ProductEditForm id={Location.state.id1} title={Location.state.title1} description={Location.state.description1} specdes={Location.state.specdes1} unit={Location.state.unit1} components={Location.state.components1} origin={Location.state.origin1} image={Location.state.image1} categories={medCate} isEdit={isEdit}  /> }
        </Container>
      </Page>
    )
  );
}

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

  const [medCate, setMedCate] = useState(null);

  const [medOrigin, setMedOrigin] = useState(null);

  useEffect(() => {
    getMedCates();
  }, [medCate]);

  useEffect(() => {
    getMedOrigins();
  }, [medOrigin]);

  const getMedCates = async () => {
    try {
      const res = await axios.get('/api/admin/product/viewProductCategory');
      setMedCate(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const getMedOrigins = async () => {
    try {
      const res = await axios.get('/api/admin/supplier/viewSupplier');
      setMedOrigin(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    medCate !== null &&
    medOrigin !== null && (
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

          <ProductEditForm
            id={Location.state.id1}
            title={Location.state.title1}
            description={Location.state.description1}
            specdes={Location.state.specdes1}
            unit={Location.state.unit1}
            components={Location.state.components1}
            origin={Location.state.origin1}
            image={Location.state.image1}
            categories={medCate}
            origins={medOrigin}
            category={Location.state.category1}
          />
        </Container>
      </Page>
    )
  );
}

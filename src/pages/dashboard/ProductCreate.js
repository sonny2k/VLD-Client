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
import ProductNewForm from '../../sections/@dashboard/e-commerce/ProductNewForm';

// ----------------------------------------------------------------------

export default function ProductCreate() {
  const { themeStretch } = useSettings();

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
      <Page title="Tạo sản phẩm ">
        <Container maxWidth={themeStretch ? false : 'lg'}>
          <HeaderBreadcrumbs
            heading="Tạo sản phẩm mới"
            links={[
              { name: 'Bảng điều khiển', href: PATH_DASHBOARD.root },
              {
                name: 'Danh sách',
                href: PATH_DASHBOARD.user.productlist,
              },
              { name: 'Sản phẩm mới' },
            ]}
          />

          <ProductNewForm categories={medCate}  />
        </Container>
      </Page>
    )
  );
}

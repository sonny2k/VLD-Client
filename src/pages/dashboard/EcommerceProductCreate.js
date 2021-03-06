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

// ----------------------------------------------------------------------

export default function EcommerceProductCreate() {
  const { themeStretch } = useSettings();
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const { name } = useParams();
  const { products } = useSelector((state) => state.product);
  const isEdit = pathname.includes('edit');
  const currentProduct = products.find((product) => paramCase(product.name) === name);
  const [prod, setProd] = useState(null);
  useEffect(() => {
    getProd();
  }, []);
  const getProd = async () => {
    try {
      const res = await axios.get(`/api/admin/product/viewProduct`)
      setProd(res.data);
    } catch (err) {
      console.error(err);
    }
  };


  useEffect(() => {
    dispatch(getProducts());
  }, [dispatch]);

  return (
    <Page title="Sản phẩm: Thêm sản phẩm mới">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={!isEdit ? 'Thêm sản phẩm' : 'Cập nhật sản phẩm'}
          links={[
            { name: 'Bảng điều khiển', href: PATH_DASHBOARD.root },
            {
              name: 'Danh sách sản phẩm',
              href: PATH_DASHBOARD.user.productlist,
            },
            { name: !isEdit ? 'Thêm sản phẩm' : name },
          ]}
        />

        <ProductNewForm isEdit={isEdit} currentProduct={currentProduct} />
      </Container>
    </Page>
  );
}

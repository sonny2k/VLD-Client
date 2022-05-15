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
import { EditArticleCategory } from '../../sections/@dashboard/user/account';

// ----------------------------------------------------------------------

export default function CategoryArticleCreate() {
  const { themeStretch } = useSettings();
  const isEdit = false
 
  return (
    <Page title="Danh mục tin tức: Thêm mới danh mục tin tức">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={!isEdit ? 'Thêm mới danh mục' : 'Sửa danh mục'}
          links={[
            { name: 'Bảng điều khiển', href: PATH_DASHBOARD.root },
            {
              name: 'Danh sách',
              href: PATH_DASHBOARD.user.categoryarticlelist,
            },
            { name: !isEdit ? 'Thêm danh mục' : 'Chỉnh sửa danh mục' },
          ]}
        />
        <EditArticleCategory  isEdit={isEdit}  />
        
      </Container>
    </Page>
  );
}

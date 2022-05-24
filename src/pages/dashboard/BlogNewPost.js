import { useEffect, useState, useCallback } from 'react';
// @mui
import { Container } from '@mui/material';
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
import { BlogNewPostForm } from '../../sections/@dashboard/blog';

// ----------------------------------------------------------------------

export default function BlogNewPost() {
  const { themeStretch } = useSettings();

  const [artCate, setArtCate] = useState([]);
  useEffect(() => {
    getArtCates();
  }, []);

  const getArtCates = async () => {
    try {
      const res = await axios.get('/api/admin/article/viewArticleCategory');
      setArtCate(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    artCate.length > 0 && (
      <Page title="Tin tức: Tin tức mới">
        <Container maxWidth={themeStretch ? false : 'lg'}>
          <HeaderBreadcrumbs
            heading="Tạo tin tức mới"
            links={[
              { name: 'Bảng điều khiển', href: PATH_DASHBOARD.root },
              { name: 'Tin tức', href: PATH_DASHBOARD.user.articlelist },
              { name: 'Tin tức mới' },
            ]}
          />

          <BlogNewPostForm artcategories={artCate} />
        </Container>
      </Page>
    )
  );
}

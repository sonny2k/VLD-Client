import { useEffect, useState, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
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
import { BlogEditPostForm } from '../../sections/@dashboard/blog';

// ----------------------------------------------------------------------

export default function BlogEditPost() {
  const { themeStretch } = useSettings();

  const Location = useLocation();

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
      <Page title="Tin tức: Sửa tin tức ">
        <Container maxWidth={themeStretch ? false : 'lg'}>
          <HeaderBreadcrumbs
            heading="Sửa tin tức"
            links={[
              { name: 'Bảng điều khiển', href: PATH_DASHBOARD.root },
              { name: 'Tin tức', href: PATH_DASHBOARD.user.articlelist },
              { name: 'Sửa tin tức' },
            ]}
          />

          <BlogEditPostForm
            artcategories={artCate}
            id={Location.state.id1}
            title={Location.state.title1}
            briefdescription={Location.state.briefdescription1}
            content={Location.state.content1}
            articlecategory={Location.state.articlecategory1}
            banner={Location.state.banner1}
          />
        </Container>
      </Page>
    )
  );
}

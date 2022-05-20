import orderBy from 'lodash/orderBy';
import { Link as RouterLink } from 'react-router-dom';
import { useEffect, useCallback, useState } from 'react';
import unorm from 'unorm';
// @mui
import { Grid, Button, Container, Stack } from '@mui/material';
import { styled } from '@mui/material/styles';
// hooks
import useSettings from '../../hooks/useSettings';
import useIsMountedRef from '../../hooks/useIsMountedRef';
// utils
import axios from '../../utils/axios';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// components
import Page from '../../components/Page';
import Iconify from '../../components/Iconify';
import { SkeletonPostItem } from '../../components/skeleton';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
// sections
import { BlogPostCard, BlogPostsSort, BlogPostsSearch } from '../../sections/@dashboard/blog';

// ----------------------------------------------------------------------
const RootStyle = styled('div')(({ theme }) => ({
  paddingTop: theme.spacing(8),
  paddingBottom: theme.spacing(8),
  [theme.breakpoints.up('md')]: {
    paddingTop: theme.spacing(11),
    paddingBottom: theme.spacing(11),
  },
}));

// ----------------------------------------------------------------------

const applySort = (posts, sortBy) => {
  if (sortBy === 'latest') {
    return orderBy(posts, ['createdat'], ['desc']);
  }
  if (sortBy === 'oldest') {
    return orderBy(posts, ['createdat'], ['asc']);
  }
  if (sortBy !== 'latest') {
    posts = posts.filter(
      (item) => unorm.nfkd(item.articlecategory.name).toLowerCase().indexOf(unorm.nfkd(sortBy).toLowerCase()) !== -1
    );
  }
  if (sortBy !== 'oldest') {
    posts = posts.filter(
      (item) => unorm.nfkd(item.articlecategory.name).toLowerCase().indexOf(unorm.nfkd(sortBy).toLowerCase()) !== -1
    );
  }
  return posts;
};

export default function BlogPosts() {
  const { themeStretch } = useSettings();

  const isMountedRef = useIsMountedRef();

  const [posts, setPosts] = useState([]);

  const [articlecategories, setArticleCategories] = useState([]);

  const [filters, setFilters] = useState('latest');

  const SORT_OPTIONS = [
    { value: 'latest', label: 'Mới nhất' },
    { value: 'oldest', label: 'Cũ nhất' },
  ];

  const sortedPosts = applySort(posts, filters);

  const getAllPosts = useCallback(async () => {
    try {
      const response = await axios.get('/api/user/article/viewListArticle');

      if (isMountedRef.current) {
        setPosts(response.data);
      }
    } catch (error) {
      console.error(error);
    }
  }, [isMountedRef]);

  const getAllCategories = useCallback(async () => {
    try {
      const response = await axios.get('/api/admin/article/viewArticleCategory');

      if (isMountedRef.current) {
        setArticleCategories(response.data);
      }
    } catch (error) {
      console.error(error);
    }
  }, [isMountedRef]);

  useEffect(() => {
    getAllPosts();
    getAllCategories();
  }, [getAllPosts, getAllCategories]);

  const handleChangeSort = (value) => {
    if (value) {
      setFilters(value);
    }
  };

  return (
    <Page title="Tin tức VLD">
      <RootStyle>
        <Container maxWidth={themeStretch ? false : 'lg'}>
          <Stack mb={5} direction="row" alignItems="center" justifyContent="space-between">
            <BlogPostsSearch />
            {articlecategories.length > 0 &&
              articlecategories.map((item) => SORT_OPTIONS.push({ value: item.name, label: item.name })) && (
                <BlogPostsSort query={filters} options={SORT_OPTIONS} onSort={handleChangeSort} />
              )}
          </Stack>

          <Grid container spacing={3}>
            {(!posts.length ? [...Array(12)] : sortedPosts).map((post, index) =>
              post ? (
                <Grid key={post._id} item xs={12} sm={6} md={(index === 0 && 6) || 3}>
                  <BlogPostCard post={post} index={index} />
                </Grid>
              ) : (
                <SkeletonPostItem key={index} />
              )
            )}
          </Grid>
          <Stack alignItems='center' mt={3}>
            <Button variant='contained' size='large' >
              Tải thêm
            </Button>
          </Stack>
        </Container>
      </RootStyle>
    </Page>
  );
}

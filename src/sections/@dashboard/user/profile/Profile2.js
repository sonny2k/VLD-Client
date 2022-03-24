import PropTypes from 'prop-types';
// @mui
import { Grid, Stack } from '@mui/material';
//
// import ProfileAbout from './ProfileAbout';
// import CreateConsultation from '../account/CreateConsultationInDetailPage'
import ProfilePostCard from './ProfilePostCard';
// import ProfilePostInput from './ProfilePostInput';
// import ProfileFollowInfo from './ProfileFollowInfo';
// import ProfileSocialInfo from './ProfileSocialInfo';

// ----------------------------------------------------------------------

Profile2.propTypes = {
  posts: PropTypes.array,
};

export default function Profile2({ posts }) {
  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={12}>
        <Stack spacing={3}>
          {/* <ProfilePostInput /> */}
          {posts.map((post) => (
            <ProfilePostCard key={post.id} post={post} />
          ))}
          {/* <CreateConsultation doctor={ doctor } /> */}
        </Stack>
      </Grid>
    </Grid>
  );
}

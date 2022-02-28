import PropTypes from 'prop-types';
// @mui
import { Grid, Stack } from '@mui/material';
//
import ProfileAbout from './ProfileAbout';
import CreateConsultation from '../account/CreateConsultationInDetailPage'
// import ProfilePostCard from './ProfilePostCard';
// import ProfilePostInput from './ProfilePostInput';
// import ProfileFollowInfo from './ProfileFollowInfo';
// import ProfileSocialInfo from './ProfileSocialInfo';

// ----------------------------------------------------------------------

Profile.propTypes = {
  doctor: PropTypes.object,
  posts: PropTypes.array,
};

export default function Profile({ doctor, posts }) {
  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={4}>
        <Stack spacing={3}>
          {/* <ProfileFollowInfo doctor={doctor} /> */}
          <ProfileAbout doctor={ doctor } />
          {/* <ProfileSocialInfo doctor={doctor} /> */}
        </Stack>
      </Grid>

      <Grid item xs={12} md={8}>
        <Stack spacing={3}>
          {/* <ProfilePostInput />
          {posts.map((post) => (
            <ProfilePostCard key={post.id} post={post} />
          ))} */}
          <CreateConsultation doctor={ doctor } />
        </Stack>
      </Grid>
    </Grid>
  );
}

import PropTypes from 'prop-types';
// @mui
import { styled } from '@mui/material/styles';
import { Box, Typography } from '@mui/material';
// utils
import cssStyles from '../../../../utils/cssStyles';
import createAvatar from '../../../../utils/createAvatar';
// hooks
import useAuth from '../../../../hooks/useAuth';
// components
import Image from '../../../../components/Image';
import Avatar from '../../../../components/Avatar';

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  '&:before': {
    ...cssStyles().bgBlur({ blur: 2, color: theme.palette.primary.darker }),
    top: 0,
    zIndex: 9,
    content: "''",
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
}));

const InfoStyle = styled('div')(({ theme }) => ({
  left: 0,
  right: 0,
  zIndex: 99,
  position: 'absolute',
  marginTop: theme.spacing(5),
  [theme.breakpoints.up('md')]: {
    right: 'auto',
    display: 'flex',
    alignItems: 'center',
    left: theme.spacing(3),
    bottom: theme.spacing(3),
  },
}));

// ----------------------------------------------------------------------

ProfileCover.propTypes = {
  doctor: PropTypes.object,
};

export default function ProfileCover({ doctor, ...other }) {

  const { lname, fname, department, profilepic } = doctor.account;

  const { level } = doctor;

  const name = `${level} ${lname} ${fname}`;

  return (
    <RootStyle>
      <InfoStyle>
        <Avatar
          src={profilepic}
          alt={`${lname} ${fname}`}
          color={profilepic ? 'default' : createAvatar(`${lname} ${fname}`).color}
          {...other}
          sx={{
            mx: 'auto',
            borderWidth: 2,
            borderStyle: 'solid',
            borderColor: 'common.white',
            width: { xs: 80, md: 128 },
            height: { xs: 80, md: 128 },
          }}
        >
          {createAvatar(`${lname} ${fname}`).name}
        </Avatar>
        <Box
          sx={{
            ml: { md: 3 },
            mt: { xs: 1, md: 0 },
            color: 'common.white',
            textAlign: { xs: 'center', md: 'left' },
          }}
        >
          <Typography variant="h4">{name}</Typography>
          <Typography sx={{ opacity: 0.72 }}>{department}</Typography>
        </Box>
      </InfoStyle>
      <Image alt="profile cover" src={'https://i.imgur.com/ubQBnT3.jpg'} sx={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} />
    </RootStyle>
  );
}

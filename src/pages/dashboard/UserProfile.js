import { capitalCase } from 'change-case';
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
// @mui
import { styled } from '@mui/material/styles';
import { Tab, Box, Card, Tabs, Container } from '@mui/material';
import LoadingScreen from '../../components/LoadingScreen';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
import useSettings from '../../hooks/useSettings';
// utils
import axios from '../../utils/axios';
// _mock_
import { _userAbout, _userFeeds, _userFriends, _userGallery, _userFollowers } from '../../_mock';
// components
import Page from '../../components/Page';
import Iconify from '../../components/Iconify';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
// sections
import {
  Profile,
  ProfileCover,
  ProfileFriends,
  ProfileGallery,
  ProfileFollowers,
} from '../../sections/@dashboard/user/profile';

// ----------------------------------------------------------------------

const TabsWrapperStyle = styled('div')(({ theme }) => ({
  zIndex: 9,
  bottom: 0,
  width: '100%',
  display: 'flex',
  position: 'absolute',
  backgroundColor: theme.palette.background.paper,
  [theme.breakpoints.up('sm')]: {
    justifyContent: 'center',
  },
  [theme.breakpoints.up('md')]: {
    justifyContent: 'flex-end',
    paddingRight: theme.spacing(3),
  },
}));

// ----------------------------------------------------------------------

export default function UserProfile() {
  const { themeStretch } = useSettings();

  const { id } = useParams();

  const [doctor, setDoctor] = useState(null);

  useEffect(() => {
    async function fetchDoctor() {
      const URL = `/api/home/doctor/${id}`
      try {
        const res = await axios.get(URL)
        setDoctor(res.data)
      } catch (error) {
        console.log(error)
      }
    }
    fetchDoctor()
  }, [id])

  const [currentTab, setCurrentTab] = useState('profile');
  const [findFriends, setFindFriends] = useState('');

  const handleChangeTab = (newValue) => {
    setCurrentTab(newValue);
  };

  const handleFindFriends = (value) => {
    setFindFriends(value);
  };

  let PROFILE_TABS;

  if (doctor) {
    PROFILE_TABS = [
      {
        value: 'profile',
        icon: <Iconify icon={'ic:round-account-box'} width={20} height={20} />,
        component: <Profile doctor={doctor} posts={_userFeeds} />,
      },
      {
        value: 'followers',
        icon: <Iconify icon={'eva:heart-fill'} width={20} height={20} />,
        component: <ProfileFollowers followers={_userFollowers} />,
      },
      {
        value: 'friends',
        icon: <Iconify icon={'eva:people-fill'} width={20} height={20} />,
        component: <ProfileFriends friends={_userFriends} findFriends={findFriends} onFindFriends={handleFindFriends} />,
      },
      {
        value: 'gallery',
        icon: <Iconify icon={'ic:round-perm-media'} width={20} height={20} />,
        component: <ProfileGallery gallery={_userGallery} />,
      },
    ];
  }
  

  return (
    doctor ?
    <Page title="Chi tiết bác sĩ">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Chi tiết bác sĩ"
          links={[
            { name: 'Bảng điều khiển', href: PATH_DASHBOARD.root },
            { name: 'Danh sách bác sĩ', href: PATH_DASHBOARD.user.cards },
            { name: `${doctor.level} ${doctor.account.lname} ${doctor.account.fname}` || '' },
          ]}
        />
        <Card
          sx={{
            mb: 3,
            height: 280,
            position: 'relative',
          }}
        >
          <ProfileCover doctor={ doctor } />

          <TabsWrapperStyle>
            <Tabs
              value={currentTab}
              scrollButtons="auto"
              variant="scrollable"
              allowScrollButtonsMobile
              onChange={(e, value) => handleChangeTab(value)}
            >
              {PROFILE_TABS.map((tab) => (
                <Tab disableRipple key={tab.value} value={tab.value} icon={tab.icon} label={capitalCase(tab.value)} />
              ))}
            </Tabs>
          </TabsWrapperStyle>
        </Card>

        {PROFILE_TABS.map((tab) => {
          const isMatched = tab.value === currentTab;
          return isMatched && <Box key={tab.value}>{tab.component}</Box>;
        })}
      </Container>
    </Page>
    :
    <LoadingScreen />
  );
}

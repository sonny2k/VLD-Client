import { useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import unorm from 'unorm';
// @mui
import { styled, useTheme } from '@mui/material/styles';
import { Box, Button, AppBar, Toolbar, Container, Stack } from '@mui/material';
// path_auth
import { PATH_AUTH } from '../../routes/paths';
// hooks
import useOffSetTop from '../../hooks/useOffSetTop';
import useResponsive from '../../hooks/useResponsive';
import useAuth from '../../hooks/useAuth';
// utils
import cssStyles from '../../utils/cssStyles';
import axios from '../../utils/axios';
// config
import { HEADER } from '../../config';
// components
import Logo from '../../components/Logo';
import Label from '../../components/Label';
//
import MenuDesktop from './MenuDesktop';
import MenuMobile from './MenuMobile';
import navConfig from './MenuConfig';
import AccountPopover from '../dashboard/header/AccountPopover';
import NotificationsPopover from '../dashboard/header/NotificationsPopover';

// ----------------------------------------------------------------------

const ToolbarStyle = styled(Toolbar)(({ theme }) => ({
  height: HEADER.MOBILE_HEIGHT,
  transition: theme.transitions.create(['height', 'background-color'], {
    easing: theme.transitions.easing.easeInOut,
    duration: theme.transitions.duration.shorter,
  }),
  [theme.breakpoints.up('md')]: {
    height: HEADER.MAIN_DESKTOP_HEIGHT,
  },
}));

const ToolbarShadowStyle = styled('div')(({ theme }) => ({
  left: 0,
  right: 0,
  bottom: 0,
  height: 24,
  zIndex: -1,
  margin: 'auto',
  borderRadius: '50%',
  position: 'absolute',
  width: `calc(100% - 48px)`,
  boxShadow: theme.customShadows.z8,
}));

// ----------------------------------------------------------------------

export default function MainHeader() {
  const isOffset = useOffSetTop(HEADER.MAIN_DESKTOP_HEIGHT);

  const theme = useTheme();

  const { account } = useAuth();

  const [notis, setNotifications] = useState([null]);

  const { pathname } = useLocation();

  const isDesktop = useResponsive('up', 'md');

  const isHome = pathname === '/';

  useEffect(() => {
    if (
      unorm
        .nfkd(account !== null && account.role)
        .toLowerCase()
        .indexOf(unorm.nfkd('Người dùng').toLowerCase()) !== -1
    ) {
      const role = 'user';
      getNoti(role);
    } else if (
      unorm
        .nfkd(account !== null && account.role)
        .toLowerCase()
        .indexOf(unorm.nfkd('Bác sĩ').toLowerCase()) !== -1
    ) {
      const role = 'doctor';
      getNoti(role);
    }
    async function getNoti(role) {
      const URL = `/api/admin/notification/notice/${role}`;
      try {
        const res = await axios.get(URL);
        setNotifications(res.data);
      } catch (error) {
        console.log(error);
      }
    }
  }, [notis]);

  if (account && notis !== null) {
    return (
      <AppBar sx={{ boxShadow: 0, bgcolor: 'transparent' }}>
        <ToolbarStyle
          disableGutters
          sx={{
            ...(isOffset && {
              ...cssStyles(theme).bgBlur(),
              height: { md: HEADER.MAIN_DESKTOP_HEIGHT - 16 },
            }),
          }}
        >
          <Container
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Logo />

            <Label color="info" sx={{ ml: 1 }}>
              v2.0
            </Label>
            <Box sx={{ flexGrow: 1 }} />

            {isDesktop && <MenuDesktop isOffset={isOffset} isHome={isHome} navConfig={navConfig} />}

            {unorm.nfkd(account.role).toLowerCase().indexOf(unorm.nfkd('Admin').toLowerCase()) !== -1 ? (
              <Stack direction="row" alignItems="center" spacing={{ xs: 0.5, sm: 1.5 }}>
                <AccountPopover />
              </Stack>
            ) : (
              <Stack direction="row" alignItems="center" spacing={{ xs: 0.5, sm: 1.5 }}>
                <NotificationsPopover notis={notis} />
                <AccountPopover />
              </Stack>
            )}

            {!isDesktop && <MenuMobile isOffset={isOffset} isHome={isHome} navConfig={navConfig} />}
          </Container>
        </ToolbarStyle>

        {isOffset && <ToolbarShadowStyle />}
      </AppBar>
    );
  }

  if (!account) {
    return (
      <AppBar sx={{ boxShadow: 0, bgcolor: 'transparent' }}>
        <ToolbarStyle
          disableGutters
          sx={{
            ...(isOffset && {
              ...cssStyles(theme).bgBlur(),
              height: { md: HEADER.MAIN_DESKTOP_HEIGHT - 16 },
            }),
          }}
        >
          <Container
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Logo />

            <Label color="info" sx={{ ml: 1 }}>
              v2.0
            </Label>
            <Box sx={{ flexGrow: 1 }} />

            {isDesktop && <MenuDesktop isOffset={isOffset} isHome={isHome} navConfig={navConfig} />}

            <Stack direction={{ xs: 'row' }} spacing={2}>
              <Button variant="outlined" rel="noopener" href={PATH_AUTH.register}>
                Đăng ký
              </Button>

              <Button variant="contained" rel="noopener" href={PATH_AUTH.login}>
                Đăng nhập
              </Button>
            </Stack>

            {!isDesktop && <MenuMobile isOffset={isOffset} isHome={isHome} navConfig={navConfig} />}
          </Container>
        </ToolbarStyle>

        {isOffset && <ToolbarShadowStyle />}
      </AppBar>
    );
  }
}

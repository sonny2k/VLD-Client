import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import unorm from 'unorm';
// @mui
import { styled } from '@mui/material/styles';
import { Box, Stack, AppBar, Toolbar } from '@mui/material';
// hooks
import useOffSetTop from '../../../hooks/useOffSetTop';
import useResponsive from '../../../hooks/useResponsive';
import useAuth from '../../../hooks/useAuth';
// utils
import cssStyles from '../../../utils/cssStyles';
import axios from '../../../utils/axios';
// config
import { HEADER, NAVBAR } from '../../../config';
// components
import Logo from '../../../components/Logo';
import Iconify from '../../../components/Iconify';
import { IconButtonAnimate } from '../../../components/animate';
//
import AccountPopover from './AccountPopover';
import NotificationsPopover from './NotificationsPopover';

// ----------------------------------------------------------------------

const RootStyle = styled(AppBar, {
  shouldForwardProp: (prop) => prop !== 'isCollapse' && prop !== 'isOffset' && prop !== 'verticalLayout',
})(({ isCollapse, isOffset, verticalLayout, theme }) => ({
  ...cssStyles(theme).bgBlur(),
  boxShadow: 'none',
  height: HEADER.MOBILE_HEIGHT,
  zIndex: theme.zIndex.appBar + 1,
  transition: theme.transitions.create(['width', 'height'], {
    duration: theme.transitions.duration.shorter,
  }),
  [theme.breakpoints.up('lg')]: {
    height: HEADER.DASHBOARD_DESKTOP_HEIGHT,
    width: `calc(100% - ${NAVBAR.DASHBOARD_WIDTH + 1}px)`,
    ...(isCollapse && {
      width: `calc(100% - ${NAVBAR.DASHBOARD_COLLAPSE_WIDTH}px)`,
    }),
    ...(isOffset && {
      height: HEADER.DASHBOARD_DESKTOP_OFFSET_HEIGHT,
    }),
    ...(verticalLayout && {
      width: '100%',
      height: HEADER.DASHBOARD_DESKTOP_OFFSET_HEIGHT,
      backgroundColor: theme.palette.background.default,
    }),
  },
}));

// ----------------------------------------------------------------------

DashboardHeader.propTypes = {
  onOpenSidebar: PropTypes.func,
  isCollapse: PropTypes.bool,
  verticalLayout: PropTypes.bool,
};

export default function DashboardHeader({ onOpenSidebar, isCollapse = false, verticalLayout = false }) {
  const isOffset = useOffSetTop(HEADER.DASHBOARD_DESKTOP_HEIGHT) && !verticalLayout;

  const isDesktop = useResponsive('up', 'lg');

  const [notis, setNotifications] = useState([null]);

  const { account } = useAuth();

  useEffect(() => {
    if (unorm.nfkd(account.role).toLowerCase().indexOf(unorm.nfkd('Người dùng').toLowerCase()) !== -1) {
      const role = 'user';
      getNoti(role);
    } else if (unorm.nfkd(account.role).toLowerCase().indexOf(unorm.nfkd('Bác sĩ').toLowerCase()) !== -1) {
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

  return (
    notis !== null && (
      <RootStyle isCollapse={isCollapse} isOffset={isOffset} verticalLayout={verticalLayout}>
        <Toolbar
          sx={{
            minHeight: '100% !important',
            px: { lg: 5 },
          }}
        >
          {isDesktop && verticalLayout && <Logo sx={{ mr: 2.5 }} />}

          {!isDesktop && (
            <IconButtonAnimate onClick={onOpenSidebar} sx={{ mr: 1, color: 'text.primary' }}>
              <Iconify icon="eva:menu-2-fill" />
            </IconButtonAnimate>
          )}

          <Box sx={{ flexGrow: 1 }} />

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
        </Toolbar>
      </RootStyle>
    )
  );
}

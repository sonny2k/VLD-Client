import { useState } from 'react';
import unorm from 'unorm';
// @mui
import { Container, Tab, Box, Tabs } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// hooks
import useSettings from '../../hooks/useSettings';
import useAuth from '../../hooks/useAuth';
// _mock_
import { _userPayment, _userAddressBook, _userInvoices, _userAbout } from '../../_mock';
// components
import Page from '../../components/Page';
import Iconify from '../../components/Iconify';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
// sections
import {
  AccountGeneral,
  AccountNotifications,
  AccountChangePassword,
  RegisterCalendar,
  AccountUser,
  DoctorDetail,
} from '../../sections/@dashboard/user/account/index';

// ----------------------------------------------------------------------

export default function UserAccount() {
  const { themeStretch } = useSettings();

  const [currentTab, setCurrentTab] = useState('Tài khoản');

  const { account } = useAuth();

  if (unorm.nfkd(account.role).toLowerCase().indexOf(unorm.nfkd('Bác sĩ').toLowerCase()) !== -1) {
    const ACCOUNT_TABS = [
      {
        value: 'Tài khoản',
        icon: <Iconify icon={'ic:round-account-box'} width={20} height={20} />,
        component: <AccountGeneral />,
      },
      {
        value: 'Đăng ký lịch làm việc',
        icon: <Iconify icon={'akar-icons:calendar'} width={20} height={20} />,
        component: <RegisterCalendar />,
      },
      {
        value: 'Thông tin chi tiết',
        icon: <Iconify icon={'bx:bx-edit-alt'} width={20} height={20} />,
        component: <DoctorDetail />,
      },
      {
        value: 'Đổi mật khẩu',
        icon: <Iconify icon={'ic:round-vpn-key'} width={20} height={20} />,
        component: <AccountChangePassword />,
      },
    ];
    return (
      <Page title="Người dùng: Cài đặt tài khoản">
        <Container maxWidth={themeStretch ? false : 'lg'}>
          <HeaderBreadcrumbs
            heading="Tài khoản"
            links={[
              { name: 'Bảng điều khiển', href: PATH_DASHBOARD.root },
              { name: 'Người dùng', href: PATH_DASHBOARD.user.root },
              { name: 'Cài đặt tài khoản' },
            ]}
          />
  
          <Tabs
            value={currentTab}
            scrollButtons="auto"
            variant="scrollable"
            allowScrollButtonsMobile
            onChange={(e, value) => setCurrentTab(value)}
          >
            {ACCOUNT_TABS.map((tab) => (
              tab.value !== null ?
              <Tab disableRipple key={tab.value} label={tab.value} icon={tab.icon} value={tab.value} />
              :
              null
            ))}
          </Tabs>
  
          <Box sx={{ mb: 5 }} />
  
          {ACCOUNT_TABS.map((tab) => {
            const isMatched = tab.value === currentTab;
            return isMatched && <Box key={tab.value}>{tab.component}</Box>;
          })}
        </Container>
      </Page>
    );
  }

  if (unorm.nfkd(account.role).toLowerCase().indexOf(unorm.nfkd('Admin').toLowerCase()) !== -1) {
    const ACCOUNT_TABS = [
      {
        value: 'Tài khoản',
        icon: <Iconify icon={'ic:round-account-box'} width={20} height={20} />,
        component: <AccountGeneral />,
      },
      {
        value: 'Đổi mật khẩu',
        icon: <Iconify icon={'ic:round-vpn-key'} width={20} height={20} />,
        component: <AccountChangePassword />,
      },
    ];
    return (
      <Page title="Người dùng: Cài đặt tài khoản">
        <Container maxWidth={themeStretch ? false : 'lg'}>
          <HeaderBreadcrumbs
            heading="Tài khoản"
            links={[
              { name: 'Bảng điều khiển', href: PATH_DASHBOARD.root },
              { name: 'Người dùng', href: PATH_DASHBOARD.user.root },
              { name: 'Cài đặt tài khoản' },
            ]}
          />
  
          <Tabs
            value={currentTab}
            scrollButtons="auto"
            variant="scrollable"
            allowScrollButtonsMobile
            onChange={(e, value) => setCurrentTab(value)}
          >
            {ACCOUNT_TABS.map((tab) => (
              <Tab disableRipple key={tab.value} label={tab.value} icon={tab.icon} value={tab.value} />
            ))}
          </Tabs>
  
          <Box sx={{ mb: 5 }} />
  
          {ACCOUNT_TABS.map((tab) => {
            const isMatched = tab.value === currentTab;
            return isMatched && <Box key={tab.value}>{tab.component}</Box>;
          })}
        </Container>
      </Page>
    );
  }

  if (unorm.nfkd(account.role).toLowerCase().indexOf(unorm.nfkd('Người dùng').toLowerCase()) !== -1) {
    const ACCOUNT_TABS = [
      {
        value: 'Tài khoản',
        icon: <Iconify icon={'ic:round-account-box'} width={20} height={20} />,
        component: <AccountGeneral />,
      },
      {
        value: 'Thông tin chi tiết',
        icon: <Iconify icon={'healthicons:medical-records-outline'} width={20} height={20} />,
        component: <AccountUser />,
      },
      {
        value: 'Đổi mật khẩu',
        icon: <Iconify icon={'ic:round-vpn-key'} width={20} height={20} />,
        component: <AccountChangePassword />,
      },
    ];
    return (
      <Page title="Người dùng: Cài đặt tài khoản">
        <Container maxWidth={themeStretch ? false : 'lg'}>
          <HeaderBreadcrumbs
            heading="Tài khoản"
            links={[
              { name: 'Bảng điều khiển', href: PATH_DASHBOARD.root },
              { name: 'Người dùng', href: PATH_DASHBOARD.user.root },
              { name: 'Cài đặt tài khoản' },
            ]}
          />
  
          <Tabs
            value={currentTab}
            scrollButtons="auto"
            variant="scrollable"
            allowScrollButtonsMobile
            onChange={(e, value) => setCurrentTab(value)}
          >
            {ACCOUNT_TABS.map((tab) => (
              <Tab disableRipple key={tab.value} label={tab.value} icon={tab.icon} value={tab.value} />
            ))}
          </Tabs>
  
          <Box sx={{ mb: 5 }} />
  
          {ACCOUNT_TABS.map((tab) => {
            const isMatched = tab.value === currentTab;
            return isMatched && <Box key={tab.value}>{tab.component}</Box>;
          })}
        </Container>
      </Page>
    );
  }
}
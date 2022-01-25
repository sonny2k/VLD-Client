import { useState } from 'react';
// @mui
import { Container, Tab, Box, Tabs } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// hooks
import useSettings from '../../hooks/useSettings';
// _mock_
import { _userPayment, _userAddressBook, _userInvoices, _userAbout } from '../../_mock';
// components
import Page from '../../components/Page';
import Iconify from '../../components/Iconify';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
// sections
import {
  AccountGeneral,
  AccountBilling,
  AccountSocialLinks,
  AccountUser,
  AccountNotifications,
  AccountChangePassword,
  CreateConsultation,
  EditAddress,
} from '../../sections/@dashboard/user/account/index';

// ----------------------------------------------------------------------

export default function UserAccount() {
  const { themeStretch } = useSettings();

  const [currentTab, setCurrentTab] = useState('Tài khoản');

  const ACCOUNT_TABS = [
    {
      value: 'Tài khoản',
      icon: <Iconify icon={'ic:round-account-box'} width={20} height={20} />,
      component: <AccountGeneral />,
    },
    {
      value: 'Địa chỉ',
      icon: <Iconify icon={'ic:round-account-box'} width={20} height={20} />,
      component: <EditAddress />,
    },

    {
      value: 'Đặt Lịch Tư Vấn',
      icon: <Iconify icon={'ic:round-account-box'} width={20} height={20} />,
      component: <CreateConsultation />,
    },
    // {
    //   value: 'Hồ sơ bệnh án',
    //   icon: <Iconify icon={'healthicons:medical-records-outline'} width={20} height={20} />,
    //   component: <AccountUser />,
    // },
    // {
    //   value: 'Hồ sơ bệnh án',
    //   icon: <Iconify icon={'ic:round-receipt'} width={20} height={20} />,
    //   component: <AccountBilling cards={_userPayment} addressBook={_userAddressBook} invoices={_userInvoices} />,
    // },
    {
      value: 'Toa thuốc của tôi',
      icon: <Iconify icon={'fontisto:prescription'} width={20} height={20} />,
      component: <AccountNotifications />,
    },
    // {
    //   value: 'social_links',
    //   icon: <Iconify icon={'eva:share-fill'} width={20} height={20} />,
    //   component: <AccountSocialLinks myProfile={_userAbout} />,
    // },
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

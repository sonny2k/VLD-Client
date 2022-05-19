import { Icon } from '@iconify/react';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// components
import Label from '../../../components/Label';
import SvgIconStyle from '../../../components/SvgIconStyle';

// ----------------------------------------------------------------------

const getIcon = (name) => <SvgIconStyle src={`/icons/${name}.svg`} sx={{ width: 1, height: 1 }} />;

const ICONS = {
  blog: getIcon('ic_blog'),
  cart: getIcon('ic_cart'),
  chat: getIcon('ic_chat'),
  mail: getIcon('ic_mail'),
  user: getIcon('ic_user'),
  kanban: getIcon('ic_kanban'),
  banking: getIcon('ic_banking'),
  calendar: getIcon('ic_calendar'),
  ecommerce: getIcon('ic_ecommerce'),
  analytics: getIcon('ic_analytics'),
  dashboard: getIcon('ic_dashboard'),
  booking: getIcon('ic_booking'),
  admin: getIcon('ic_clarity:administrator-solid'),
};

const navConfigAd = [
  
  // ----------------------------------------------------------------------
  {
    subheader: 'Quản lý',
    items: [
      // MANAGEMENT : USER
      {
        title: 'Quản trị viên',
        icon:  <Icon icon="clarity:administrator-solid" />,
        children: [
          { title: 'Bác sĩ', path: PATH_DASHBOARD.user.doclist },
          { title: 'Sản phẩm', path: PATH_DASHBOARD.user.productlist },
          { title: 'Chuyên khoa', path: PATH_DASHBOARD.user.department },
          { title: 'Tin tức', path: PATH_DASHBOARD.user.articlelist },
          { title: 'Danh mục sản phẩm', path: PATH_DASHBOARD.user.categorylist },
          { title: 'Danh mục tin tức', path: PATH_DASHBOARD.user.categoryarticlelist },
          { title: 'Nhà cung cấp', path: PATH_DASHBOARD.user.supplierlist },
        ],
      },
    ],
  },
  // --------------------------------------------------------------------
  {
    subheader: 'Cài đặt tài khoản',
    items: [{ title: 'Tài khoản', path: PATH_DASHBOARD.user.account, icon: ICONS.user }],
  },

  // APP
  // ----------------------------------------------------------------------
  {
    subheader: 'Thống kê',
    items: [{ title: 'Dữ liệu thống kê', path: PATH_DASHBOARD.general.analytics, icon: ICONS.analytics }],
  },
];

export default navConfigAd;

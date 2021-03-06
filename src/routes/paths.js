// ----------------------------------------------------------------------

function path(root, sublink) {
  return `${root}${sublink}`;
}

const ROOTS_AUTH = '/auth';
const ROOTS_DASHBOARD = '/dashboard';

// ----------------------------------------------------------------------

export const PATH_AUTH = {
  root: ROOTS_AUTH,
  login: path(ROOTS_AUTH, '/login'),
  register: path(ROOTS_AUTH, '/register'),
  loginUnprotected: path(ROOTS_AUTH, '/login-unprotected'),
  registerUnprotected: path(ROOTS_AUTH, '/register-unprotected'),
  verify: path(ROOTS_AUTH, '/verify'),
  resetPassword: path(ROOTS_AUTH, '/reset-password'),
};

export const PATH_PAGE = {
  comingSoon: '/coming-soon',
  maintenance: '/maintenance',
  pricing: '/pricing',
  payment: '/payment',
  about: '/about-us',
  contact: '/contact-us',
  faqs: '/faqs',
  page404: '/404',
  page500: '/500',
  components: '/components',
  articles: '/articles',
  article: (id) => `/articles/${id}`,
};

export const PATH_DASHBOARD = {
  root: ROOTS_DASHBOARD,
  general: {
    app: path(ROOTS_DASHBOARD, '/app'),
    ecommerce: path(ROOTS_DASHBOARD, '/ecommerce'),
    analytics: path(ROOTS_DASHBOARD, '/analytics'),
    banking: path(ROOTS_DASHBOARD, '/banking'),
    booking: path(ROOTS_DASHBOARD, '/booking'),
  },
  mail: {
    root: path(ROOTS_DASHBOARD, '/mail'),
    all: path(ROOTS_DASHBOARD, '/mail/all'),
  },
  chat: {
    root: path(ROOTS_DASHBOARD, '/chat'),
    new: path(ROOTS_DASHBOARD, '/chat/new'),
    view: (name) => path(ROOTS_DASHBOARD, `/chat/${name}`),
  },
  calendar: path(ROOTS_DASHBOARD, '/calendar'),
  kanban: path(ROOTS_DASHBOARD, '/kanban'),
  video: path(ROOTS_DASHBOARD, '/video'),
  user: {
    root: path(ROOTS_DASHBOARD, '/user'),
    new: path(ROOTS_DASHBOARD, '/user/new'),
    list: path(ROOTS_DASHBOARD, '/user/list'),
    cards: path(ROOTS_DASHBOARD, '/user/cards'),
    profile: path(ROOTS_DASHBOARD, '/user/profile:name'),
    account: path(ROOTS_DASHBOARD, '/user/account'),
    edit: (id) => path(ROOTS_DASHBOARD, `/user/detail/${id}`),
    demoEdit: path(ROOTS_DASHBOARD, `/user/reece-chung/edit`),
    registercalendar: path(ROOTS_DASHBOARD, '/user/registercalendar'),
    department: path(ROOTS_DASHBOARD, '/user/department'),
    doctorlist: path(ROOTS_DASHBOARD, '/user/doctorlist'),
    doclist: path(ROOTS_DASHBOARD, '/user/doclist'),
    uselist: path(ROOTS_DASHBOARD, '/user/uselist'),

    productlist: path(ROOTS_DASHBOARD, '/user/productlist'),
    departmentcreate: path(ROOTS_DASHBOARD, '/user/departmentcreate'),
    departmentedit: path(ROOTS_DASHBOARD, '/user/departmentedit'),
    articlelist: path(ROOTS_DASHBOARD, '/user/articlelist'),
    categorylist: path(ROOTS_DASHBOARD, '/user/categorylist'),
    supplierlist: path(ROOTS_DASHBOARD, '/user/supplierlist'),
    categorycreate: path(ROOTS_DASHBOARD, '/user/categorycreate'),
    categoryedit: path(ROOTS_DASHBOARD, '/user/categoryedit'),
    suppliercreate: path(ROOTS_DASHBOARD, '/user/suppliercreate'),
    supplieredit: path(ROOTS_DASHBOARD, '/user/supplieredit'),
    productcreate: path(ROOTS_DASHBOARD, '/user/productcreate'),
    productedit: path(ROOTS_DASHBOARD, '/user/productedit'),
    categoryarticlelist: path(ROOTS_DASHBOARD, '/user/categoryarticlelist'),
    categoryarticlecreate: path(ROOTS_DASHBOARD, '/user/categoryarticlecreate'),
    categoryarticleedit: path(ROOTS_DASHBOARD, '/user/categoryarticleedit'),
    doccreate: path(ROOTS_DASHBOARD, '/user/doccreate'),
    docedit: path(ROOTS_DASHBOARD, '/user/docedit'),

  },
  eCommerce: {
    root: path(ROOTS_DASHBOARD, '/e-commerce'),
    shop: path(ROOTS_DASHBOARD, '/e-commerce/shop'),
    checkout: path(ROOTS_DASHBOARD, '/e-commerce/checkout'),
    new: path(ROOTS_DASHBOARD, '/e-commerce/product/new'),
    view: (name) => path(ROOTS_DASHBOARD, `/e-commerce/product/${name}`),
    edit: (name) => path(ROOTS_DASHBOARD, `/e-commerce/product/${name}/edit`),
    demoEdit: path(ROOTS_DASHBOARD, '/e-commerce/product/nike-blazer-low-77-vintage/edit'),
    demoView: path(ROOTS_DASHBOARD, '/e-commerce/product/nike-air-force-1-ndestrukt'),
  },
  prescription: {
    root: path(ROOTS_DASHBOARD, '/prescription'),
    list: path(ROOTS_DASHBOARD, '/prescription/list'),
    new: path(ROOTS_DASHBOARD, '/prescription/new'),
    view: (idne) => path(ROOTS_DASHBOARD, `/prescription/${idne}`),
    edit: (idne) => path(ROOTS_DASHBOARD, `/prescription/edit/${idne}`),
    demoEdit: path(ROOTS_DASHBOARD, '/prescription/e99f09a7-dd88-49d5-b1c8-1daf80c2d7b1/edit'),
    demoView: path(ROOTS_DASHBOARD, '/prescription/e99f09a7-dd88-49d5-b1c8-1daf80c2d7b5'),
  },
  blog: {
    root: path(ROOTS_DASHBOARD, '/blog'),
    posts: path(ROOTS_DASHBOARD, '/blog/posts'),
    new: path(ROOTS_DASHBOARD, '/blog/new'),
    edit: path(ROOTS_DASHBOARD, '/blog/edit'),
    view: (title) => path(ROOTS_DASHBOARD, `/blog/post/${title}`),
    demoView: path(ROOTS_DASHBOARD, '/blog/post/apply-these-7-secret-techniques-to-improve-event'),
  },
};

export const PATH_DOCS = 'https://docs-minimals.vercel.app/introduction';

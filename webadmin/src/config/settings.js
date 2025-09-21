import { get } from 'lodash';
import path from 'path';
const dirname = path.resolve('./');

const componentsSettings = {
  pageSize: 20,
};

const settings = {
  siteTitle: 'Dangquang',
  siteName: 'Distant and Time Management',
  productName: 'dat-management',
  appId: 'dat-management',
  domain: get(process, 'env.DOMAIN') || 'localhost',
  copyright: 'Copyright @ 2025 Metatek. Powered by Metatek.',
  topNavEnable: false,
  headFixed: true,
  siteTokenKey: 'dat-token',
  ajaxHeadersTokenKey: 'authorization',
  ajaxResponseNoVerifyUrl: ['/user/login', '/user/info'],
  iconPath: path.resolve(dirname, './build/icons/icon.ico'),
  iconMacPath: path.resolve(dirname, './build/icons/icon.icns'),
  logoNoCollapsed: path.resolve(
    dirname,
    './src/assets/images/logo-no-collapsed.png',
  ),
  logoCollapsed: path.resolve(dirname, './src/assets/icons/logo-collapsed.png'),
  notFoundComponent: '@/pages/404',
  ...componentsSettings,
};

export default settings;

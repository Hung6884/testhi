import { getNotFoundRoute, umiRoutes } from '../utils/routes';
/**
 * Index Layout 路由页面
 */

export const IndexLayoutRoutes = [
  {
    icon: '',
    title: 'route.debtManagement',
    path: '/debtManagement',
    component: 'DebtManagement', 
  },
  {
    icon: '',
    title: 'route.management',
    path: '/management',
    routes: [
      {
        icon: 'FaSync',
        title: 'route.sync',
        path: '/management/sync',
        component: '@/pages/SyncData',
      },
      {
        icon: 'FaLeanpub',
        title: 'route.course',
        path: '/management/courses',
        component: '@/pages/Course',
      },

      {
        icon: 'FaLeanpub',
        title: 'route.teacher',
        path: '/management/teachers',
        component: '@/pages/Teacher',
      },
      {
        icon: 'FaUserGraduate',
        title: 'route.student',
        path: '/management/students',
        component: '@/pages/Student',
      },
      {
        icon: 'FaCarSide',
        title: 'route.vehicle',
        path: '/management/vehicles',
        component: '@/pages/Vehicle',
      },
      {
        icon: 'FaMicrochip',
        title: 'route.datDevice',
        path: '/management/dat-devices',
        component: '@/pages/DatDevice',
      },
      {
        icon: 'FaLeanpub',
        title: 'route.rfCard',
        path: '/management/rfCards',
        component: '@/pages/RFCard',
      },
    ],
  },
  {
    title: 'route.report',
    path: '/report',
    routes: [
      {
        title: 'route.report1',
        path: '/report/report1',
      },
      {
        title: 'route.report2',
        path: '/report/report2',
      },
    ],
  },
  {
    title: 'route.system',
    path: '/system',
    routes: [
      {
        title: 'route.unit',
        path: '/system/unit',
      },
      {
        title: 'route.system.parameter',
        path: '/system/parameters',
      },
    ],
  },
  {
    hidden: true,
    icon: 'FaLeanpub',
    title: 'route.course',
    path: '/',
    redirect: '/management/courses',
  },
];

export const routes = [
  {
    title: '',
    path: '/',
    routes: [
      {
        title: '',
        path: '/auth',
        component: '@/layouts/SecurityLayout.jsx',
        routes: [
          {
            title: 'app.global.route.auth.login',
            path: '/auth/login',
            component: '@/pages/Auth/Login',
          },
        ],
      },
      {
        title: '',
        path: '/',
        component: '@/layouts/SecurityLayout.jsx',
        routes: [
          {
            title: '',
            path: '/',
            component: '@/layouts/Layout',
            routes: umiRoutes(IndexLayoutRoutes),
          },
        ],
      },
      getNotFoundRoute(),
    ],
  },
];

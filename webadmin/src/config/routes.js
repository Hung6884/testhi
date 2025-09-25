import { title } from 'process';
import { getNotFoundRoute, umiRoutes } from '../utils/routes';
/**
 * Index Layout 路由页面
 */

export const IndexLayoutRoutes = [
  {
    icon: '',
    title: 'route.accounting',
    path: '/accounting',
    routes: [
      {
        title: 'route.debtManagement',
        path: 'debtManagement',
        component: 'DebtManagement',
      },
      {
        title: 'route.orderManagement',
        path: 'orderManagement',
        routes: [
        {
          title: 'route.order.thermal',
          path: 'orderManagement/orderThermal',
          component: '@/pages/OrderManagement/OrderThermal',
        },
        {
          title: 'route.order.pet',
          path: 'orderManagement/orderPet',
          component: '@/pages/OrderManagement/OrderPet',
        },
        {
          title: 'route.order.direct',
          path: 'orderManagement/orderDirect',
          // component: 'OrderDirect',
        },
      ],        
      },
      {
        title: 'route.cashbook.list',
        path: 'debtManagement',
        // component: 'DebtManagement',
      },
      {
        title: 'route.revenue',
        path: 'debtManagement',
        // component: 'DebtManagement',
      },
      {
        title: 'route.receiptOutside',
        path: 'debtManagement',
        // component: 'DebtManagement',
      },
      {
        title: 'route.orderDefects',
        path: 'debtManagement',
        // component: 'DebtManagement',
      },
      
    ],
  },






  
  {
    icon: '',
    title: 'route.management',
    path: '/management',
    routes: [
      
     
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

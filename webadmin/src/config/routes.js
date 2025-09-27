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
          component: '@/pages/OrderManagement/OrderDirect',
        },
      ],        
      },
      {
        title: 'route.cashbook.list',
        path: 'cashbookList',
        component: 'CashbookList',
      },
      {
        title: 'route.revenue',
        path: 'revenue',
        routes: [
          {
          title: 'route.revenue.thermal',
          path: 'revenueThermal',
          component: '@/pages/Revenue/RevenueThermal',
        },

        {
          title: 'route.revenue.pet',
          path: 'revenuePet',
          component: '@/pages/Revenue/RevenuePet',
        },
        {
          title: 'route.revenue.direct',
          path: 'revenueDirect',
          component: '@/pages/Revenue/RevenueDirect',
        },
        {
          title: 'route.revenue.customer',
          path: 'revenueCustomer',
          component: '@/pages/Revenue/RevenueCustomer',
        },
        // {
        //   title: 'route.revenue.businessTeam',
        //   path: 'revenueBusinessTeam',
        //   // component: '@/pages/OrderManagement/OrderDirect',
        // },
        // {
        //   title: 'route.revenue.colorTest',
        //   path: 'revenueColorTest',
        //   // component: '@/pages/OrderManagement/OrderDirect',
        // },
        // {
        //   title: 'route.revenue.printTeam',
        //   path: 'revenuePrintTeam',
        //   // component: '@/pages/OrderManagement/OrderDirect',
        // },
        // {
        //   title: 'route.revenue.drawingTeam',
        //   path: 'revenueDrawingTeam',
        //   // component: '@/pages/OrderManagement/OrderDirect',
        // },

        ]
      },
      {
        title: 'route.receiptOutside',
        path: 'receiptOutside',
        component: 'ReceiptOutSide',
      },
      {
        title: 'route.orderDefects',
        path: 'orderDefects',
        // component: 'DebtManagement',
      },
      
    ],
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

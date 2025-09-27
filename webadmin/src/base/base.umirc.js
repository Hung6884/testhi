// https://umijs.org/config/
import { defineConfig } from 'umi';

import fs from 'fs';
import lessToJs from 'less-vars-to-js';
import path from 'path';

import mapKeys from 'lodash/mapKeys';
import trimStart from 'lodash/trimStart';

const { API_HOST, DOMAIN, NODE_ENV, API_HOST_NODE_RED } = process.env;

export const baseDefineConfig = ({ settings, routes }) =>
  defineConfig({
    define: {
      'window.env.API_HOST': API_HOST,
      'window.env.DOMAIN': DOMAIN,
      'window.env.siteTokenKey': settings.siteTokenKey,
      'window.env.API_HOST_NODE_RED': API_HOST_NODE_RED,
    },
    history: { type: 'browser' },
    hash: true,
    ignoreMomentLocale: true,
    // headScripts: ['/env.js'],
    plugins: [
      '@umijs/plugins/dist/antd',
      '@umijs/plugins/dist/dva',
      '@umijs/plugins/dist/locale',
      '@umijs/plugins/dist/access',
      '@umijs/plugins/dist/initial-state',
      '@umijs/plugins/dist/model',
      '@umijs/plugins/dist/request',
    ],
    title: settings.siteTitle || 'Dangquang',
    model: {},
    initialState: {},
    request: {},
    access: {
      strictMode: true,
    },
    copy: ['.env'],
    extraBabelPlugins: [
      [
        '@babel/plugin-transform-react-jsx',
        {
          runtime: 'automatic',
        },
      ],
    ],
    dva: {},
    locale: {
      // default vi-VN
      default: 'vi-VN',
      // default true, when it is true, will use `navigator.language` overwrite default
      antd: true,
      title: true,
      baseNavigator: false,
      baseSeparator: '-',
    },
    targets: {
      ie: 11,
    },
    mfsu: false,
    jsMinifier: 'terser',
    cssMinifier: 'cssnano',
    routes,
    // Theme for antd: https://ant.design/docs/react/customize-theme-cn
    theme: {
      ...lessToJs(
        fs.readFileSync(
          path.join(__dirname, '../../src/shared/css/antd-variables.less'),
          'utf8',
        ),
      ),
      ...mapKeys(
        lessToJs(
          fs.readFileSync(
            path.join(__dirname, '../../src/shared/css/antd-variables.less'),
            'utf8',
          ),
        ),
        (value, key) => {
          return trimStart(key, '@');
        },
      ),
    },
    proxy: {
  '/api': {
    target: 'http://localhost:3000',
    changeOrigin: true,
    // nếu backend thật sự có prefix /api/v1 thì thêm dòng này
    pathRewrite: { '^/api': '/api/v1' },
  },
},

    chainWebpack(memo /* ,  { webpack } */) {
      // Add `exclude` to the built-in SVG rule.
      memo.module
        .rule('svg')
        .exclude.add(/iconsvg/)
        .end();

      // Add svg-sprite-loader Rule
      memo.module
        .rule('svg-sprite-loader')
        .test(/.svg$/)
        .include.add(/iconsvg/)
        .end()
        .use('svg-sprite-loader')
        .loader('svg-sprite-loader');

      // Add SVGO rule.
      memo.module
        .rule('svgo')
        .test(/.svg$/)
        .include.add(/iconsvg/)
        .end()
        .use('svgo-loader')
        .loader('svgo-loader')
        .options({
          // externalConfig For special configuration, paths are not relative; the starting path is the root directory.
          externalConfig: '../../src/shared/iconsvg/svgo.yml',
        });
      memo.module
        .rule('mjs-rule')
        .test(/.m?js/)
        .resolve.set('fullySpecified', false);
    },
  });

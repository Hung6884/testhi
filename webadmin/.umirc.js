// https://umijs.org/config/
import { baseDefineConfig } from './src/base/base.umirc';
import { routes } from './src/config/routes';
import settings from './src/config/settings';

export default baseDefineConfig({ settings, routes });

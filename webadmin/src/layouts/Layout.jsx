import IndexLayout from '../ui/layout/IndexLayout';
import { IndexLayoutRoutes } from '../config/routes';
import settings from '../config/settings';
function Layout() {
  return <IndexLayout routes={IndexLayoutRoutes} settings={settings} />;
}
export default Layout;

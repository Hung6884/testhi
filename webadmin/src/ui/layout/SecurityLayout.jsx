import { useEffect } from 'react';
import { Navigate, Outlet, useLocation, useSelector, useDispatch } from 'umi';

function SecurityLayout({ settings } = {}) {
  const dispatch = useDispatch();
  const { currentUser, loading } = useSelector(({ User, loading }) => ({
    currentUser: User.currentUser,
    loading: loading.effects['User/fetchCurrent'],
  }));
  const { pathname, search } = useLocation();

  useEffect(() => {
    dispatch({
      type: 'User/fetchCurrent',
      payload: settings,
    });
  }, []);

  if (
    !currentUser.isAuthorized &&
    loading === false &&
    pathname !== '/auth/login'
  ) {
    return (
      <Navigate
        to={`/auth/login?${new URLSearchParams({
          redirect: pathname + search,
        })}`}
      />
    );
  } else if (currentUser.isAuthorized && pathname === '/auth/login') {
    return <Navigate to="/" replace={true} />;
  }

  return <Outlet />;
}

export default SecurityLayout;

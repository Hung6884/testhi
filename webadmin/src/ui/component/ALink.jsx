import { Link } from 'umi';

import { isExternal } from '../../utils/validate';

export const ALink = (props) => {
  const { children, to, ...attr } = props;
  return isExternal(to) ? (
    <a href={to} {...attr} target="_blank" rel="noreferrer">
      {children}
    </a>
  ) : (
    <Link to={to} {...attr}>
      {children}
    </Link>
  );
};

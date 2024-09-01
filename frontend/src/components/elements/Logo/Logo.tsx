import React from 'react';

import { Link } from 'react-router-dom';
import { PATH_HOME } from '../../../constants/paths';

const Logo: React.FC = () => {
  return (
    <Link to={PATH_HOME}>
      <div></div>
      <h1 className="Logo text-4xl    tracking-tighter font-extrabold dark:text-white">
        We
        <span className="logo-gradient">Link</span>
      </h1>
    </Link>
  );
};

export default Logo;

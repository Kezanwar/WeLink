import React from 'react';

import { Link } from 'react-router-dom';

const Logo: React.FC = () => {
  return (
    <Link to={'/'}>
      <div></div>
      <h1 className="Logo text-3xl tracking-tighter font-extrabold dark:text-white">
        We
        <span className="text-red-400">Link</span>
      </h1>
    </Link>
  );
};

export default Logo;

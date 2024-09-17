import React from 'react';

import { Logo } from '@app/components/Logo';
import { ThemeToggle } from '@app/components/Buttons/ThemeToggle';
import LinksButton from '@app/components/Buttons/LinksButton';

const Header: React.FC = (props) => {
  return (
    <header className="header">
      <div className="is-container  flex justify-between items-center mb-4 py-4 ">
        <Logo />
        <div className="flex items-center gap-2">
          <LinksButton />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
};

export default Header;

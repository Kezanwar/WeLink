import React from 'react';

import { Logo } from '@app/components/Elements/Logo';
import { ThemeToggle } from '@app/components/Buttons/ThemeToggle';
import { SearchButton } from '../../buttons/SearchButton';

const Header: React.FC = (props) => {
  return (
    <header className="header">
      <div className="is-container  flex justify-between items-center mb-4 py-4 ">
        <Logo />
        <div className="flex items-center gap-3">
          {/* <SearchButton /> */}
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
};

export default Header;

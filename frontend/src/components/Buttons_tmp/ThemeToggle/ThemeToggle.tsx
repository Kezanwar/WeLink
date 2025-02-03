import React from 'react';

import { MdOutlineDarkMode, MdOutlineWbSunny } from 'react-icons/md';
import useThemeStore from '@app/stores/theme';

const darkIconStyles = {
  color: 'black',
  fontSize: '1.5rem',
  marginBottom: '-0.05rem'
};
const lightIconStyles = {
  color: 'white',
  fontSize: '1.5rem',
  marginBottom: '-0.10rem'
};

const ThemeToggle: React.FC = () => {
  const { mode, toggle } = useThemeStore();

  return (
    <button
      onClick={toggle}
      className="__black-and-white p-2 active:scale-75 transition-all flex items-center gap-2 "
    >
      {mode === 'light' ? (
        <>
          <MdOutlineDarkMode style={darkIconStyles} />
          {/* <span className="hidden lg:inline">Dark mode</span> */}
        </>
      ) : (
        <>
          <MdOutlineWbSunny style={lightIconStyles} />
          {/* <span className="hidden lg:inline">Light mode</span> */}
        </>
      )}
    </button>
  );
};

export default ThemeToggle;

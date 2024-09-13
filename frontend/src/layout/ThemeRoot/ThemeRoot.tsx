import React, { ReactNode } from 'react';

import useThemeStore from '@app/stores/theme';

type Props = {
  children: ReactNode;
};

const ThemeRoot: React.FC<Props> = ({ children }) => {
  const mode = useThemeStore((state) => state.mode);
  return (
    <div className={`${mode || 'dark'} max-w-[100vw] overflow-x-hidden`}>
      <div
        className={`min-h-[100vh] flex flex-col ${
          mode !== 'dark'
            ? 'bg-gradient-to-r from-rose-50/40 via-purple-50/40 to-blue-50/40'
            : 'dark:bg-gray-950'
        }    `}
      >
        {children}
      </div>
    </div>
  );
};

export default ThemeRoot;

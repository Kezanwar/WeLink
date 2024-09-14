import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LuLink } from 'react-icons/lu';
import useLinksStore from '@app/stores/links';

const iconStyles = {
  fontSize: '1.5rem',
  marginBottom: '-0.05rem'
};

const active = 'text-black dark:text-white';
const inactive = 'text-gray-400 dark:text-700';

const LinksButton: React.FC = () => {
  const location = useLocation();
  const { files } = useLinksStore();
  const path = '/links';
  const isSearch = location.pathname === path;
  return (
    <Link to={path}>
      <div
        className={`relative  ${
          isSearch ? active : inactive
        } p-2 active:scale-75 transition-all`}
      >
        <LuLink style={iconStyles} />

        {files.length > 0 && (
          <div
            className={`pointer-events-none  absolute text-[9px] top-[-4px] w-[18px]  h-[18px] flex items-center justify-center  border-white bg-red-400 border-2 dark:border-black font-bold text-white rounded-full right-[-1px]`}
          >
            {files.length}
          </div>
        )}
      </div>
    </Link>
  );
};

export default LinksButton;

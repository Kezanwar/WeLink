import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiSearch } from 'react-icons/fi';
import { PATH_SEARCH } from '@app/constants/paths.constants';

const iconStyles = {
  fontSize: '1.5rem',
  marginBottom: '-0.05rem'
};

const SearchButton: React.FC = () => {
  const location = useLocation();
  const isSearch = location.pathname === PATH_SEARCH;
  return (
    <div className="relative __black-and-white  p-2 active:scale-75 transition-all">
      <Link to={PATH_SEARCH}>
        <FiSearch style={iconStyles} />
      </Link>
      {isSearch && (
        <div className="absolute bottom-[-0.25rem] w-1 h-1 bg-green-500   rounded-full left-[50%] translate-x-[-50%]" />
      )}
    </div>
  );
};

export default SearchButton;

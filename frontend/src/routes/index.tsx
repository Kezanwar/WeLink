import React from 'react';
import { useLocation, useRoutes } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

// pages
import Home from '@app/pages/Home';
import Links from '@app/pages/Links';
import File from '@app/pages/File';

// ----------------------------------------------------------------------

const Router: React.FC = () => {
  const elements = useRoutes([
    {
      path: '/',
      element: <Home />
    },
    { path: '/links', element: <Links /> },
    { path: '/file/:uuid', element: <File /> }
  ]);
  const location = useLocation();
  if (!elements) return null;
  return (
    <AnimatePresence mode="wait">
      {React.cloneElement(elements, { key: location.pathname })}
    </AnimatePresence>
  );
};

export default Router;

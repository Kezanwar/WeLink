import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div
      className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-gray-900 dark:border-gray-300 border-r-transparent dark:border-r-gray-600 align-[-0.125em] text-primary motion-reduce:animate-[spin_1.5s_linear_infinite]"
      role="status"
    />
  );
};

export default LoadingSpinner;

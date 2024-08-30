import React, { ReactNode } from 'react';

type Props = {
  className?: string;
  children: ReactNode;
};

const BodyText: React.FC<Props> = ({ className, children }) => {
  return (
    <p
      className={`dark:text-gray-500 text-sm  text-gray-400 leading-5 ${
        className || ''
      }`}
    >
      {children}
    </p>
  );
};

export default BodyText;

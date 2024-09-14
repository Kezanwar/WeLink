import React, { ReactNode } from 'react';

type Props = { children: ReactNode; variant: 'sm' | 'md' };

const variant_style = {
  sm: 'text-[11px]',
  md: 'text-[13px]'
};

const Subheading: React.FC<Props> = ({ children, variant }) => {
  return (
    <h4 className={`__black-and-white uppercase ${variant_style[variant]}`}>
      {children}
    </h4>
  );
};

export default Subheading;

import React, { ReactNode } from 'react';

type Props = {
  variant: 'md' | 'lg' | 'sm';
  className?: string;
  children: ReactNode;
};

const styles = {
  md: '__black-and-white font-semi-bold text-2xl  md:text-3xl',
  sm: '__black-and-white font-semi-bold text-md  md:text-lg',
  lg: '__black-and-white font-semi-bold tracking-tighter text-2xl md:text-4xl'
};

const Heading: React.FC<Props> = ({
  variant = 'md',
  className = '',
  children
}) => {
  return <h2 className={`${styles[variant]} ${className}`}>{children}</h2>;
};

export default Heading;

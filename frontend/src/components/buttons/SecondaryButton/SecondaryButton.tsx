import React, { FC, ReactElement, ReactNode } from 'react';

type Props = React.HTMLProps<HTMLButtonElement> & {
  text: string;
  icon?: ReactNode;
};

const SecondaryButton: FC<Props> = ({ onClick, text, icon, className }) => {
  return (
    <button
      onClick={onClick}
      className={`hover:scale-105 active:scale-90 text-sm transition-transform flex gap-1  rounded-full items-center  ${className}`}
    >
      {text} {icon && icon}
    </button>
  );
};

export default SecondaryButton;

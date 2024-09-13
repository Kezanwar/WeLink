import React, { FC, ReactNode } from 'react';

type Props = React.HTMLProps<HTMLButtonElement> & {
  text: string;
  icon?: ReactNode;
};

const SecondaryButton: FC<Props> = ({ onClick, text, icon, className }) => {
  return (
    <button
      onClick={onClick}
      className={`active:scale-90 hover:opacity-70 font-semibold text-sm transition-all flex gap-1  rounded-full items-center  ${className}`}
    >
      {text} {icon && icon}
    </button>
  );
};

export default SecondaryButton;

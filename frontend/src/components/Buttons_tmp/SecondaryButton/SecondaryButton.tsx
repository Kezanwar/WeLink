import React, { FC, ReactNode } from 'react';

type Props = React.HTMLProps<HTMLButtonElement> & {
  text: string;
  endIcon?: ReactNode;
  startIcon?: ReactNode;
};

const SecondaryButton: FC<Props> = ({
  onClick,
  text,
  endIcon,
  className,
  startIcon
}) => {
  return (
    <button
      onClick={onClick}
      className={`active:scale-90 hover:opacity-70 font-semibold text-sm transition-all flex gap-1  rounded-full items-center  ${className}`}
    >
      {startIcon && startIcon} {text} {endIcon && endIcon}
    </button>
  );
};

export default SecondaryButton;

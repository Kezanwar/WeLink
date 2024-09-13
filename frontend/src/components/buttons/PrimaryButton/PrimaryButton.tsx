import React, { FC, ReactNode } from 'react';

type Props = React.HTMLProps<HTMLButtonElement> & {
  text: string;
  icon?: ReactNode;
};

const PrimaryButton: FC<Props> = ({ onClick, icon, text }) => {
  return (
    <button
      onClick={onClick}
      className="hover:opacity-70 text-sm text-black font-semibold active:scale-90 transition-all mt-4  dark:text-white flex gap-2 border-2 border-black dark:border-white px-3 py-2 rounded-full items-center "
    >
      {text}
      {icon}
    </button>
  );
};

export default PrimaryButton;

import React, { FC } from 'react';

type Props = {
  progress: number;
};

const ProgressBar: FC<Props> = ({ progress }) => {
  return (
    <div className="w-[120px]">
      <p className="text-[12px] mb-2 text-gray-400">{`${progress}%`}</p>
      <div
        className="flex w-full h-1 bg-gray-200 rounded-full overflow-hidden dark:bg-neutral-700"
        role="progressbar"
      >
        <div
          className="flex flex-col justify-center rounded-full overflow-hidden bg-green-400 text-xs text-white text-center whitespace-nowrap  transition duration-500"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
};

export default ProgressBar;

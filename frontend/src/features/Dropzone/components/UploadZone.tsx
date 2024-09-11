import { FC, useMemo } from 'react';
import { IoCloudUploadOutline } from 'react-icons/io5';

type Props = { over: boolean };

const UploadZone: FC<Props> = ({ over }) => {
  const text_color = useMemo(() => {
    if (over) {
      return 'text-green-400 dark:text-green-400';
    }
    return 'text-gray-300 dark:text-gray-700 group-hover:text-green-400 group-hover:dark:text-green-400';
  }, [over]);
  return (
    <div
      className={`pointer-events-none ${text_color} flex flex-col items-center justify-center`}
    >
      <p
        className={`mb-2 ${
          !over ? 'scale-100 group-hover:scale-0' : 'scale-0'
        } transition-all`}
      >
        Drop or Upload
      </p>
      <IoCloudUploadOutline
        className={`transition-all ${
          !over ? 'group-hover:translate-y-[-10px]' : 'translate-y-[-10px]'
        }`}
        size={over ? 85 : 80}
      />
    </div>
  );
};

export default UploadZone;

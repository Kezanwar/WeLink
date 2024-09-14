import { FC, useMemo } from 'react';

import ProgressBar from '@app/components/ProgressBar';
import useFileStore from '@app/stores/file';
import cc from '@app/util/cc';
import formatBytes from '@app/util/format-bytes';
import FileIcon, { Extension } from '@app/components/FileIcon/FileIcon';

const File: FC = () => {
  const { file, isProcessing, processingProgress } = useFileStore();

  const ext: Extension = useMemo(() => {
    const txtArr = file?.name.split('.');

    return txtArr?.[txtArr.length - 1].toLowerCase() as Extension;
  }, [file]);

  return file ? (
    <>
      <div
        className={cc([
          'h-full w-full flex flex-col items-center justify-center ',
          isProcessing && 'opacity-30'
        ])}
      >
        <FileIcon ext={ext} />
        <p className="text-lg text-black font-medium mb-2 dark:text-white">
          {file?.name}
        </p>
        <p className="text-sm text-gray-400">{formatBytes(file?.size)}</p>
      </div>
      <div className="h-[40px]">
        {isProcessing && (
          <>
            <ProgressBar progress={processingProgress} />
            <p className="text-sm text-gray-400 mt-2">Checking file...</p>
          </>
        )}
      </div>
    </>
  ) : null;
};

export default File;

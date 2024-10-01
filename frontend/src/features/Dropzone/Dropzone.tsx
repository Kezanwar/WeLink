import React, { FC, useEffect, useRef } from 'react';
import { IoMdClose } from 'react-icons/io';
import { useDropArea } from 'react-use';
import { IoMdLink } from 'react-icons/io';

import SecondaryButton from '@app/components/Buttons/SecondaryButton/SecondaryButton';
import PrimaryButton from '@app/components/Buttons/PrimaryButton';
import UploadZone from './components/UploadZone';
import UploadModal from '../UploadModal';
import File from './components/File';

import useFileStore from '@app/stores/file';
import useLinksStore from '@app/stores/links';

import useProcessFile from '@app/hooks/useProcessFile';

import Request from '@app/services/request';

import cc from '@app/util/cc';
import useToastStore from '@app/stores/toast';

const Dropzone: FC = () => {
  const {
    file,
    isProcessing,
    processSuccess,
    onStartUpload,
    onUploadProgressChange,
    onUploadIntervalIncrement,
    onUploadError,
    onUploadSuccess
  } = useFileStore();

  const { processFile, abort } = useProcessFile();

  const { enqueueMessage } = useToastStore();

  const { add, exists } = useLinksStore();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const onUploadAreaClick = () => {
    fileInputRef?.current?.click();
  };

  const [bond, state] = useDropArea({
    onFiles: async (files) => {
      if (files) {
        try {
          processFile(files[0]);
        } catch (err) {
          console.log('ERROR!', err);
          abort();
        }
      }
    }
  });

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      try {
        processFile(e.target.files[0]);
      } catch (err) {
        console.log('ERROR!', err);
        abort();
      }
    }
  };

  const interval = useRef<ReturnType<typeof setInterval> | null>(null);

  const handleGetLink = async () => {
    if (!file) {
      return;
    }

    if (exists(file.name)) {
      enqueueMessage({
        text: `You've already created an active link for ${file.name}`,
        type: 'error'
      });
      return;
    }

    try {
      onStartUpload();
      const res = await Request.postFile(file, (ev) => {
        if (ev.progress) {
          const val = ev.progress * 100;
          if (val > 0 && val < 74) {
            onUploadProgressChange(Math.round(val));
          } else {
            if (!interval.current) {
              interval.current = setInterval(onUploadIntervalIncrement, 600);
            }
          }
        }
      });
      if (interval.current) {
        clearInterval(interval.current);
        interval.current = null;
      }
      onUploadProgressChange(100);
      setTimeout(() => {
        onUploadSuccess(res.data);
        add(res.data);
        enqueueMessage({
          text: `Link for ${file.name} created successfully 🚀`,
          type: 'success'
        });
      }, 300);
    } catch (error) {
      Request.errorHandler(error, (err) => {
        onUploadError(err.message);
      });
    }
  };

  useEffect(() => {
    return () => abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <input
        className="hidden"
        ref={fileInputRef}
        type="file"
        onChange={handleFileChange}
      />
      <button
        onClick={onUploadAreaClick}
        className={cc([
          'mt-8 md:mt-4 group transition-all h-40  md:w-96 md:h-64 rounded-2xl flex flex-col justify-center items-center gap-4',
          (isProcessing || file) && 'pointer-events-none'
        ])}
        {...bond}
      >
        {!file ? <UploadZone over={state.over} /> : <File />}
      </button>
      {processSuccess && !!file && (
        <div className="mt-4 md:mt-0 mb-6 flex items-center gap-8">
          <SecondaryButton
            onClick={abort}
            className="mt-4 text-red-500"
            text="Clear"
            endIcon={<IoMdClose size={20} />}
          />
          <PrimaryButton
            text="Get Link"
            onClick={handleGetLink}
            icon={<IoMdLink className="text-green-400" size={20} />}
          />
        </div>
      )}
      {<UploadModal />}
    </>
  );
};

export default Dropzone;

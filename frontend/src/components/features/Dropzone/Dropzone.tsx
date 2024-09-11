import React, { FC, useRef, useState } from 'react';
import { IoMdClose } from 'react-icons/io';
import { useDropArea } from 'react-use';
import { IoMdLink } from 'react-icons/io';

import useToastStore from '@app/stores/toast';
import useFileStore, { useProcessFile } from '@app/stores/file';

import SecondaryButton from '@app/components/buttons/SecondaryButton/SecondaryButton';
import File from './components/File';

import PrimaryButton from '@app/components/buttons/PrimaryButton';
import Upload from './components/Upload';
import Request from '@app/services/request';

import UploadModal from '../UploadModal';
import cc from '@app/util/cc';

const Dropzone: FC = () => {
  const {
    file,
    isProcessing,
    processSuccess,
    onStartUpload,
    onUploadProgressChange,
    onUploadError,
    onUploadSuccess
  } = useFileStore();
  const { enqueueMessage } = useToastStore();

  const { processFile, abort } = useProcessFile();

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

  const handleGetLink = async () => {
    // enqueueMessage({ text: 'test', type: 'success' });
    if (!file) {
      return;
    }

    try {
      onStartUpload();
      const res = await Request.postFile(file, (ev) =>
        onUploadProgressChange(ev.progress ? Math.round(ev.progress * 100) : 0)
      );
      onUploadSuccess(res.data);
    } catch (error) {
      Request.errorHandler(error, (err) => {
        onUploadError(err.message);
      });
    }
  };

  const fileInputRef = useRef<HTMLInputElement>(null);

  const onUploadAreaClick = () => {
    fileInputRef?.current?.click();
  };

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
          'mt-4 group transition-all  w-96 h-80 rounded-2xl flex flex-col justify-center items-center gap-4',
          (isProcessing || file) && 'pointer-events-none'
        ])}
        {...bond}
      >
        {!file ? <Upload over={state.over} /> : <File />}
      </button>
      {processSuccess && !!file && (
        <div className="flex items-center gap-8">
          <SecondaryButton
            onClick={abort}
            className="mt-4 text-red-500"
            text="Clear"
            icon={<IoMdClose size={20} />}
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

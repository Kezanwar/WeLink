import React, { FC, useRef, useState } from 'react';
import { IoMdClose } from 'react-icons/io';
import { useDropArea } from 'react-use';
import { IoMdLink } from 'react-icons/io';

import useToastStore from '@app/stores/toast';
import useFileStore, { useProcessFile } from '@app/stores/file';
import Modal from '@app/components/modal';
import SecondaryButton from '@app/components/buttons/SecondaryButton/SecondaryButton';
import File from './components/File';
import cc from '@app/util/cc';
import PrimaryButton from '@app/components/buttons/PrimaryButton';
import Upload from './components/Upload';
import Request from '@app/services/request';

const Dropzone: FC = () => {
  const { file, isUploading, uploadSuccess } = useFileStore();
  const { enqueueMessage } = useToastStore();
  const [showModal, setShowModal] = useState(false);
  const { processFile, abort } = useProcessFile();

  const closeModal = () => setShowModal(false);

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

  const handleGetLink = () => {
    console.log(file);
    enqueueMessage({ text: 'test', type: 'success' });
    setShowModal(true);
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
          (isUploading || file) && 'pointer-events-none'
        ])}
        {...bond}
      >
        {!file ? <Upload over={state.over} /> : <File />}
      </button>
      {uploadSuccess && file && (
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
      {showModal && (
        <Modal
          title="Uploading file..."
          description="Please do not close this webpage"
          type="loading"
          onClose={closeModal}
          showCancel
        />
      )}
    </>
  );
};

export default Dropzone;

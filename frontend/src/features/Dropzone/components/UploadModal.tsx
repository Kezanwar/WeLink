import { FC, useMemo } from 'react';
import { motion } from 'framer-motion';
import { AiOutlineCheck, AiOutlineExclamationCircle } from 'react-icons/ai';
import { BsCloudArrowUp } from 'react-icons/bs';

import Spinner from '@app/components/spinner';
import SecondaryButton from '@app/components/buttons/SecondaryButton/SecondaryButton';
import Modal from '@app/components/modal';
import useFileStore from '@app/stores/file';
import ProgressBar from '@app/components/progress-bar';
import { capitalizeWord } from '@app/util/capitalize-word';

const SuccessIcon: FC = () => {
  return (
    <div className="bg-green-100  w-12 h-12 flex justify-center items-center rounded-full">
      <AiOutlineCheck className="text-green-600" size={20} />
    </div>
  );
};
const ErrorIcon: FC = () => {
  return (
    <div className="bg-red-100  w-12 h-12 flex justify-center items-center rounded-full">
      <AiOutlineExclamationCircle className="text-red-600" size={20} />
    </div>
  );
};
const Uploading: FC = () => {
  return (
    <div className="bg-green-50  w-12 h-12 flex justify-center items-center rounded-full">
      <BsCloudArrowUp className="text-green-600" size={20} />
    </div>
  );
};

const icon_map = {
  success: <SuccessIcon />,
  error: <ErrorIcon />,
  loading: <Uploading />
};

const title_map = {
  success: 'Link created!',
  error: 'Oops! Something went wrong',
  loading: 'Uploading to our Cloud Service...'
};

const UploadModal: FC = () => {
  const {
    closeUploadModal,
    showUploadModal,
    isUploading,
    uploadError,
    uploadSuccess,
    uploadProgress,
    fileExpiry,
    fileUUID
  } = useFileStore();

  if (!showUploadModal) return null;

  const state = uploadError ? 'error' : uploadSuccess ? 'success' : 'loading';

  const hasLink = uploadSuccess && fileExpiry && fileUUID;

  return (
    <Modal onClose={closeUploadModal} showCancel={true}>
      {icon_map[state]}
      <div className="flex flex-col items-center justify-center">
        <h3 className="font-sm mb-2 dark:text-white text-lg">
          {title_map[state]}
        </h3>

        <p className="font-normal text-sm text-gray-400 dark:text-gray-500 mb-4">
          {uploadError && capitalizeWord(uploadError)}
          {isUploading &&
            (uploadProgress < 60 ? 'This shoudnt take long' : 'Almost done')}
          {hasLink && `You link will expire on ${fileExpiry.toDateString()}`}
        </p>
        <div className="min-h-[20px]">
          {isUploading && <ProgressBar progress={uploadProgress} />}
        </div>
      </div>
    </Modal>
  );
};

export default UploadModal;

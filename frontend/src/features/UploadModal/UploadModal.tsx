import { FC } from 'react';

import useFileStore from '@app/stores/file';
import { capitalizeWord } from '@app/util/capitalize-word';

import Modal from '@app/components/Modal';
import ProgressBar from '@app/components/ProgressBar';
import CopyLink from '@app/components/CopyLink';

import { ErrorIcon, SuccessIcon, UploadingIcon } from './components/Icons';
import Request from '@app/services/request';
import { Heading } from '@app/components/Typography/Heading';

const icon_map = {
  success: <SuccessIcon />,
  error: <ErrorIcon />,
  loading: <UploadingIcon />
};

const title_map = {
  success: 'Heres your link...',
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

  const link = `${Request.FE_BASE_URL}/file/${fileUUID}`;

  return (
    <Modal onClose={closeUploadModal} showCancel={true}>
      {icon_map[state]}
      <div className="flex flex-col items-center justify-center w-full">
        <Heading
          variant="sm"
          className="md:text-2xl font-bold mb-2 dark:text-white text-lg"
        >
          {title_map[state]}
        </Heading>

        <p className="font-normal text-sm text-gray-400 dark:text-gray-500 mb-4">
          {uploadError && capitalizeWord(uploadError)}
          {isUploading &&
            (uploadProgress < 60 ? 'This shoudnt take long' : 'Almost done')}
          {hasLink && `Expires on ${fileExpiry}`}
        </p>

        <div className={`min-h-[20px] ${hasLink ? 'w-full' : ''}`}>
          {isUploading && <ProgressBar progress={uploadProgress} />}
          {hasLink && <CopyLink className="w-[90%] m-auto" link={link} />}
        </div>
      </div>
    </Modal>
  );
};

export default UploadModal;

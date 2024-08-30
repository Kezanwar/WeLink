import useFileStore from '@app/stores/file';
import { toBase64 } from '@app/util/file';
import React, { FC, useMemo, useRef, useState } from 'react';
import { IoCloudUploadOutline } from 'react-icons/io5';
import { IoMdClose } from 'react-icons/io';
import { useDropArea } from 'react-use';
import { IoMdLink } from 'react-icons/io';
import useToastStore from '@app/stores/toast';
import Modal from '@app/components/modal';
import SecondaryButton from '@app/components/buttons/SecondaryButton/SecondaryButton';

type Props = any;

const Dropzone: FC<Props> = (props) => {
  const { file, setFile, clearFile } = useFileStore();
  const { enqueueMessage } = useToastStore();
  const [showModal, setShowModal] = useState(false);

  const closeModal = () => setShowModal(false);

  const [bond, state] = useDropArea({
    onFiles: async (files) => {
      if (files) {
        try {
          const base64 = await toBase64(files[0]);
          if (typeof base64 === 'string') {
            setFile(base64);
          }
        } catch (err) {
          if (err instanceof ProgressEvent) {
            if (err.currentTarget instanceof FileReader) {
              // if (error.currentTarget)
            }
          }
        }
      }
    }
  });

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const base64 = await toBase64(e.target.files[0]);
      if (typeof base64 === 'string') {
        setFile(base64);
      }
    }
  };

  const fileInputRef = useRef<HTMLInputElement>(null);

  const onUploadAreaClick = () => {
    fileInputRef?.current?.click();
  };

  const text_color = useMemo(() => {
    if (state.over) {
      return 'text-pink-400 dark:text-cyan-400';
    }
    return 'text-gray-300 dark:text-gray-700 group-hover:text-pink-400 group-hover:dark:text-cyan-400';
  }, [state.over]);

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
        className={`mt-4 group transition-all ${
          !file ? ` ` : ''
        }  w-96 h-80 rounded-2xl flex flex-col justify-center items-center gap-4 `}
        {...bond}
      >
        {!file ? (
          <div
            className={`pointer-events-none ${text_color} flex flex-col items-center justify-center`}
          >
            <p
              className={`mb-2 ${
                !state.over ? 'scale-100 group-hover:scale-0' : 'scale-0'
              } transition-all`}
            >
              Drop or Upload
            </p>
            <IoCloudUploadOutline
              className={`transition-all ${
                !state.over
                  ? 'group-hover:translate-y-[-10px]'
                  : 'translate-y-[-10px]'
              }`}
              size={state.over ? 85 : 80}
            />
          </div>
        ) : (
          <div className="h-full w-full flex items-center justify-center ">
            <img className="h-full w-full object-cover" src={file}></img>
          </div>
        )}
      </button>
      {file && (
        <div className="flex items-center gap-12">
          <SecondaryButton
            onClick={clearFile}
            className="mt-4  text-red-500"
            text="Clear"
            icon={<IoMdClose size={20} />}
          />
          <button
            onClick={() => {
              enqueueMessage({ text: 'test', type: 'success' });
              console.log(file?.length);
              setShowModal(true);
            }}
            className="hover:opacity-80 text-sm bg-black text-white active:scale-90 transition-all mt-4 dark:bg-black dark:text-white flex gap-2 dark:border-2 dark:border-white px-3 py-2 rounded-xl items-center "
          >
            Get Link
            <IoMdLink className="text-green-400" size={20} />
          </button>
        </div>
      )}
      {showModal && (
        <Modal
          title="Uploading image..."
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

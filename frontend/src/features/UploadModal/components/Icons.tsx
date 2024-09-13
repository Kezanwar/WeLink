import { FC } from 'react';
import { AiOutlineCheck, AiOutlineExclamation } from 'react-icons/ai';
import { BsCloudArrowUp } from 'react-icons/bs';

export const SuccessIcon: FC = () => {
  return (
    <div className="bg-green-100  text-green-500  w-12 h-12 flex justify-center items-center rounded-full">
      <AiOutlineCheck size={24} />
    </div>
  );
};
export const ErrorIcon: FC = () => {
  return (
    <div className="bg-red-100  text-red-500  w-12 h-12 flex justify-center items-center rounded-full">
      <AiOutlineExclamation size={24} />
    </div>
  );
};
export const UploadingIcon: FC = () => {
  return (
    <div className="bg-amber-100  text-amber-500  w-12 h-12 flex justify-center items-center rounded-full">
      <BsCloudArrowUp size={24} />
    </div>
  );
};

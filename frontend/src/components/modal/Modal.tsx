import { FC } from 'react';
import { motion } from 'framer-motion';
import { AiOutlineCheck, AiOutlineExclamationCircle } from 'react-icons/ai';
import Spinner from '../spinner';
import SecondaryButton from '../buttons/SecondaryButton/SecondaryButton';

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

const icon_map = {
  success: <SuccessIcon />,
  error: <ErrorIcon />,
  loading: <Spinner />
};

type Props = {
  onClose: () => void;
  type: 'success' | 'error' | 'loading';
  title: string;
  description: string;
  showCancel: boolean;
};

const initial = { opacity: 0 };
const animated = { opacity: 1 };

const Modal: FC<Props> = ({
  onClose,
  type,
  title,
  description,
  showCancel
}) => {
  const handleCancelClick = () => {
    onClose();
  };
  return (
    <motion.div
      onClick={onClose}
      className="bg-gray-800/70 dark:bg-white/20 top-0 fixed h-full w-full flex justify-center items-center"
      initial={initial}
      animate={animated}
    >
      <div
        onClick={(e) => {
          e.stopPropagation();
        }}
        className="w-[500px] max-w-[100vw] px-6 py-8 bg-white dark:bg-black shadow-xl rounded-xl flex flex-col items-center gap-8 text-center"
      >
        {icon_map[type]}
        <div>
          <h3 className="font-medium dark:text-white text-lg">{title}</h3>
          <p className="font-normal text-sm text-gray-400 dark:text-gray-500 mt-1">
            {description}
          </p>
        </div>
        <div className="flex items-center gap-4">
          {showCancel && (
            <SecondaryButton onClick={handleCancelClick} text="Done" />
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default Modal;

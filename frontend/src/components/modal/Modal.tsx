import { FC, ReactNode } from 'react';
import { motion } from 'framer-motion';

import SecondaryButton from '../buttons/SecondaryButton/SecondaryButton';

export type ModalProps = {
  onClose: () => void;
  showCancel: boolean;
  children: ReactNode;
};

const initial = { opacity: 0 };
const animated = { opacity: 1 };

const Modal: FC<ModalProps> = ({ onClose, showCancel, children }) => {
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
        {children}
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

import useToastStore from '@app/stores/toast';
import { FC } from 'react';
import { AiOutlineCheck, AiOutlineExclamationCircle } from 'react-icons/ai';
import { motion, AnimatePresence, spring } from 'framer-motion';

const initial = { opacity: 0, x: 60 };
const animated = { opacity: 1, x: 0 };
const exit = { opacity: 0 };

const col_map = {
  error: 'bg-red-100 text-red-500',
  success: 'bg-green-100 text-green-500'
};

const icon_map = {
  error: <AiOutlineExclamationCircle />,
  success: <AiOutlineCheck />
};

const Toast: FC = () => {
  const { messages } = useToastStore();

  return (
    <div className="fixed bottom-5 right-5 flex flex-col gap-4">
      <AnimatePresence>
        {messages.map((msg) => (
          <motion.div
            initial={initial}
            animate={animated}
            exit={exit}
            transition={spring}
            className={`px-3 py-3 text-sm rounded-md  bg-white text-black shadow-xl flex items-start gap-2 font-semi-bold`}
            key={msg.uuid}
          >
            <div className={`rounded-full p-1 ${col_map[msg.type]}`}>
              {icon_map[msg.type]}
            </div>
            <p className="max-w-[240px] font-medium">{msg.text}</p>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default Toast;

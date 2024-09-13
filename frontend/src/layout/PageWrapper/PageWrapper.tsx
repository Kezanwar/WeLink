import { FC, ReactNode } from 'react';
import { motion } from 'framer-motion';

type Props = { children: ReactNode; className?: string };

const initial = { opacity: 0 };
const anim = { opacity: 1 };

const PageWrapper: FC<Props> = ({ children, className = '' }) => {
  return (
    <motion.main
      className={`flex-1 flex flex-col ${className}`}
      initial={initial}
      animate={anim}
    >
      {children}
    </motion.main>
  );
};

export default PageWrapper;

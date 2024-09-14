import { FC, ReactNode } from 'react';
import { motion } from 'framer-motion';

type Props = { children: ReactNode };

const initial = { opacity: 0 };
const anim = { opacity: 1 };

const PageWrapper: FC<Props> = ({ children }) => {
  return (
    <motion.main initial={initial} animate={anim}>
      {children}
    </motion.main>
  );
};

export default PageWrapper;

import React from 'react';
import { motion } from 'framer-motion';
import { BodyText } from '@app/components/typography/BodyText';
import { Heading } from '@app/components/typography/Heading';
import Dropzone from '@app/features/Dropzone';

const Home: React.FC = () => {
  return (
    <motion.main initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="flex flex-col items-center gap-12 p-6">
        <div className="__black-and-white flex flex-col items-center  text-center">
          <Heading variant="lg" className="mb-5">
            Upload a file and get a share-able{' '}
            <span className="font-bold relative logo-gradient text-transparent">
              link
              <span className="text-gray-200">...</span>
            </span>
            {/* <div className="absolute right-[25%] translate-x-[10%] top-[-8px]">
                {' '}
                <TbLink className="text-gray-300 text-[15px]" />
              </div>
            </span>{' '} */}
          </Heading>
          <BodyText className="max-w-[420px] mb-5">
            All file types are accepted,{' '}
            <span className="text-black dark:text-white">
              for large files OR folders you must compress it into a .zip first.
            </span>
          </BodyText>
          {/* <BodyText>
            Your link will expire after{' '}
            <span className="text-black dark:text-white">3 days.</span>
          </BodyText> */}
        </div>
        <Dropzone />
      </div>
    </motion.main>
  );
};

export default Home;

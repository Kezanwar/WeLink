import React from 'react';
import { motion } from 'framer-motion';
import { BodyText } from '@app/components/typography/BodyText';
import { TbLink } from 'react-icons/tb';
import { Heading } from '@app/components/typography/Heading';
import Dropzone from '@app/components/features/Dropzone';

const Home: React.FC = () => {
  return (
    <motion.main initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="flex flex-col items-center gap-12 p-6">
        <div className="__black-and-white flex flex-col items-center  text-center">
          <Heading variant="lg" className="mb-4">
            Upload a file and get a share-able{' '}
            <span className="font-bold relative">
              <span className=" text-amber-400 ">l</span>
              <span className=" text-indigo-400  ">i</span>
              <span className=" text-pink-400  ">n</span>
              <span className="text-cyan-400">k</span>
              <span className="text-gray-200">...</span>
            </span>
            {/* <div className="absolute right-[25%] translate-x-[10%] top-[-8px]">
                {' '}
                <TbLink className="text-gray-300 text-[15px]" />
              </div>
            </span>{' '} */}
          </Heading>
          <BodyText className="max-w-[420px] mb-4">
            All file types are accepted, if you want to upload a folder you must
            compress it into a .zip first.
          </BodyText>
          <BodyText>You link will expire after 3 days.</BodyText>
        </div>
        <Dropzone />
      </div>
    </motion.main>
  );
};

export default Home;

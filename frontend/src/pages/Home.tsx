import React from 'react';
import { BodyText } from '@app/components/Typography/BodyText';
import { Heading } from '@app/components/Typography/Heading';
import Dropzone from '@app/features/Dropzone';
import PageWrapper from '@app/layout/PageWrapper';

const Home: React.FC = () => {
  return (
    <PageWrapper className="items-center gap-12 p-6">
      <div className="__black-and-white flex flex-col items-center  text-center">
        <Heading variant="lg" className="mb-5">
          Upload a file and get a share-able{' '}
          <span className="font-bold relative logo-gradient text-transparent">
            link
            <span className="text-gray-200">...</span>
          </span>
        </Heading>
        <BodyText className="max-w-[420px] mb-3">
          All file types are accepted,{' '}
          <span className="text-black dark:text-white">
            for large files OR folders you must compress it into a .zip first
          </span>
        </BodyText>
        <BodyText className="mb-3">
          Max upload size is{' '}
          <span className="text-black dark:text-white">500mb</span>{' '}
        </BodyText>
        <BodyText>
          Your link will expire after{' '}
          <span className="text-black dark:text-white"> 24 Hours</span>
        </BodyText>
      </div>
      <Dropzone />
    </PageWrapper>
  );
};

export default Home;

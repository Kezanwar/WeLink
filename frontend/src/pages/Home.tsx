import React from 'react';
import { BodyText } from '@app/components/Typography/BodyText';
import { Heading } from '@app/components/Typography/Heading';
import Dropzone from '@app/features/Dropzone';
import PageWrapper from '@app/layout/PageWrapper';

const TitleSection: React.FC = () => {
  return (
    <div className="__black-and-white flex flex-col items-center  text-center">
      <Heading variant="lg" className="mb-5 font-bold">
        Upload a file and get a share-able link
      </Heading>
      <BodyText className="max-w-[420px] mb-3">
        All file types are accepted,{' '}
        <span className="text-black dark:text-white">
          for large files OR folders you must compress it into a .zip first.
        </span>{' '}
        (Max 2GB)
      </BodyText>
    </div>
  );
};

const Home: React.FC = () => {
  return (
    <PageWrapper>
      <div className="flex flex-col items-center gap-12 px-6">
        <TitleSection />
        <Dropzone />
      </div>
    </PageWrapper>
  );
};

export default Home;

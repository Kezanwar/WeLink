import FileLink from '@app/components/FileLink';
import { BodyText } from '@app/components/Typography/BodyText';
import { Heading } from '@app/components/Typography/Heading';
import PageWrapper from '@app/layout/PageWrapper';
import useLinksStore from '@app/stores/links';
import React, { FC } from 'react';

const TitleSection: React.FC = () => {
  return (
    <div className="__black-and-white flex flex-col items-center  text-center">
      <Heading variant="lg" className="mb-5 font-bold">
        Your links
      </Heading>
      <BodyText className="max-w-[420px] mb-3">
        Your current active files,{' '}
        <span className="text-black dark:text-white">
          links are only saved on the device in which they were created on.
        </span>
      </BodyText>
    </div>
  );
};

const Links: FC = () => {
  const { files } = useLinksStore();

  return (
    <PageWrapper>
      <div className="flex flex-col items-center gap-12 px-6">
        <TitleSection />
        <div className="lg:pt-8 lg:pb-20">
          <div className="grid  lg:grid-cols-2  relative">
            <div className="hidden lg:block absolute top-0  left-[50%] translate-x-[-50%] w-[1px] h-full bg-gray-200 dark:bg-gray-900" />
            {files.map((f, i) => {
              const isLast = i === files.length - 1;
              const isSecondLast = i === files.length - 2;
              return (
                <div
                  className={`${!isLast ? 'border-b' : ''} ${
                    isSecondLast ? 'border-b lg:border-b-0' : ''
                  } mx-2 lg:mx-0 py-12 border-gray-200 dark:border-gray-800   px-4 lg:px-16 `}
                >
                  <FileLink key={f.uuid} meta={f} />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default Links;

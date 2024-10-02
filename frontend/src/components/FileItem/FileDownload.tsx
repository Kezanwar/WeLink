import useLinksStore, { FileMeta } from '@app/stores/links';
import React, { FC, useState } from 'react';
import FileIcon from '../FileIcon';
import { Heading } from '../Typography/Heading';
import Request from '@app/services/request';
import formatDate from '@app/util/format-date';
import useToastStore from '@app/stores/toast';
import { useCopyToClipboard } from 'react-use';
import { Extension } from '../FileIcon/FileIcon';
import Subheading from '../Typography/Subheading';
import { BodyText } from '../Typography/BodyText';
import SecondaryButton from '../Buttons/SecondaryButton/SecondaryButton';
import { MdCopyAll, MdOutlineFileDownload } from 'react-icons/md';
import { toBase64 } from '@app/util/to-base-64';
import { Buffer } from 'buffer';
import getExt from '@app/util/get-ext';

type Props = { meta: FileMeta; onDownload: () => void };

const FileDownload: FC<Props> = ({ meta, onDownload }) => {
  const { enqueueMessage } = useToastStore();
  const [_, copyToClipboard] = useCopyToClipboard();

  const ext = getExt(meta.name);
  const expires = formatDate(meta.expires);

  const link = `${Request.FE_BASE_URL}/file/${meta.uuid}`;

  const onCopy = () => {
    copyToClipboard(link);
    enqueueMessage({
      text: 'Link copied and ready to share 👍🏾',
      type: 'success'
    });
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="pt-1 ">
        <FileIcon ext={ext} />
      </div>

      <div>
        <Heading
          className=" font-medium mb-6 text-center leading-tight"
          variant="md"
        >
          {meta.name}
        </Heading>
        <div className="flex flex-col items-center">
          <div className="flex items-center justify-center mb-8 gap-12">
            <div className="text-center">
              <Subheading variant="sm">Size</Subheading>
              <BodyText>{meta.formatted_size}</BodyText>
            </div>
            {/* <div className="h-6 w-[1px] bg-gray-300 dark:bg-gray-700" /> */}
            <div className="text-center">
              <Subheading variant="sm">Expires</Subheading>
              <BodyText>{expires}</BodyText>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <SecondaryButton
              onClick={onCopy}
              className=" text-black dark:text-white"
              startIcon={<MdCopyAll size={20} />}
              text="Copy"
            />
            <SecondaryButton
              onClick={onDownload}
              className=" text-red-400 "
              startIcon={<MdOutlineFileDownload size={21} />}
              text="Download"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileDownload;

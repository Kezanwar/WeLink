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

type Props = { meta: FileMeta };

const FileDownload: FC<Props> = ({ meta }) => {
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

  const onDownload = async () => {
    try {
      const res = await Request.getFileBinary(meta.uuid, (p) =>
        console.log(p.progress)
      );

      console.log('runs');

      const base64 = Buffer.from(res.data, 'binary').toString('base64');
      //   console.log(typeof res.data);
      //   const blob = atob(res.data)

      //   //   if (typeof base64 !== 'string') {
      //   //     throw new Error('failed to download');
      //   //   }

      //   // create "a" HTML element with href to file & click
      const link = document.createElement('a');
      link.href = `data:${res.headers['Content-Type']};base64,${base64}`;
      link.setAttribute('download', meta.name); //or any other extension
      document.body.appendChild(link);
      link.click();

      //   // clean up "a" element & remove ObjectURL
      document.body.removeChild(link);
    } catch (error) {
      Request.errorHandler(error, (err) => console.log(error));
    }
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
              className=" text-green-500 "
              startIcon={<MdOutlineFileDownload size={20} />}
              text="Download"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileDownload;

import { FC, memo, useState } from 'react';

import FileIcon from '@app/components/FileIcon';
import { Extension } from '@app/components/FileIcon/FileIcon';
import { Heading } from '@app/components/Typography/Heading';
import { BodyText } from '@app/components/Typography/BodyText';
import Subheading from '@app/components/Typography/Subheading';

import useLinksStore, { FileMeta } from '@app/stores/links';
import formatDate from '@app/util/format-date';

import SecondaryButton from '../Buttons/SecondaryButton/SecondaryButton';
import { MdCopyAll } from 'react-icons/md';
import { useCopyToClipboard } from 'react-use';
import useToastStore from '@app/stores/toast';
import Request, { ErrorObject } from '@app/services/request';
import { IoMdClose } from 'react-icons/io';
import Spinner from '../Spinner';

type Props = {
  meta: FileMeta;
};

const FileLink: FC<Props> = memo(({ meta }) => {
  const { enqueueMessage } = useToastStore();
  const { remove } = useLinksStore();
  const [_, copyToClipboard] = useCopyToClipboard();

  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);
  const [deleteError, setDeleteError] = useState<ErrorObject | null>(null);

  const textArr = meta.name.split('.');
  const ext = textArr[textArr.length - 1] as Extension;
  const expires = formatDate(meta.expires);

  const link = `${Request.FE_BASE_URL}/file/${meta.uuid}`;

  const onCopy = () => {
    copyToClipboard(link);
    enqueueMessage({
      text: 'Link copied and ready to share 👍🏾',
      type: 'success'
    });
  };

  const onRemove = async () => {
    try {
      setDeleteLoading(true);
      await Request.deleteFile(meta.uuid);
      enqueueMessage({
        text: `${meta.name} deleted ❌`,
        type: 'success'
      });
      remove(meta.uuid);
    } catch (error) {
      Request.errorHandler(error, (err) => {
        setDeleteError(err);
      });
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="flex items-start gap-3">
      <div className="pt-1">
        <FileIcon ext={ext} />
      </div>

      <div>
        <Heading
          className="mb-2  font-medium lg:mb-1 leading-tight"
          variant="sm"
        >
          {meta.name}
        </Heading>
        <div className="flex flex-col max-w-max">
          <div className="flex items-center mb-3 lg:mb-2 gap-4 lg:gap-3">
            <div>
              <Subheading variant="sm">Size</Subheading>
              <BodyText>{meta.formatted_size}</BodyText>
            </div>
            <div className="h-6 w-[1px] bg-gray-300 dark:bg-gray-700" />
            <div>
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
              onClick={onRemove}
              className=" text-red-600 darl:text-red-100"
              startIcon={<IoMdClose size={20} />}
              text="Delete"
            />
            {deleteLoading && <Spinner size="sm" />}
          </div>
        </div>
      </div>
    </div>
  );
});

export default FileLink;

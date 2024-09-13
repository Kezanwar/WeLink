import useToastStore from '@app/stores/toast';
import { FC, useEffect } from 'react';
import { MdCopyAll } from 'react-icons/md';
import { useCopyToClipboard } from 'react-use';

type Props = {
  link: string;
};

const CopyLink: FC<Props> = ({ link }) => {
  const { enqueueMessage } = useToastStore();
  const [state, copyToClipboard] = useCopyToClipboard();

  const onCopy = () => {
    copyToClipboard(link);
    enqueueMessage({ text: 'Link copied', type: 'success' });
  };

  console.log(link);

  return (
    <>
      <button
        onClick={onCopy}
        className="my-2 group h-10  w-[90%] m-auto flex rounded-md items-center  transition-all  dark:hover:opacity-100 active:scale-95 "
      >
        <input
          value={link}
          readOnly
          className="text-left h-full text-[12px] font-medium dark:bg-white dark:border-white w-full rounded-md border-r-0 rounded-r-none  border-2 border-black pointer-events-none text-gray-400 group-hover:text-black transition-colors p-2"
        />
        <div className="w-10 border-2 dark:bg-white border-black dark:border-white dark:border-l-black rounded-md flex rounded-l-none items-center justify-center h-full group-hover:text-blue-500  group-hover:bg-blue-50 group-hover:border-blue-500    transition-colors">
          <MdCopyAll size={20} />
        </div>
      </button>
      {state.error && (
        <p className="text-red-500 text-[12px] max-w-[70%] m-auto">
          Oops! an error occured whilst copying to clipboard, please try again
        </p>
      )}
    </>
  );
};

export default CopyLink;

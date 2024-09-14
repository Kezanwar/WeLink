import useToastStore from '@app/stores/toast';
import { FC, useEffect } from 'react';
import { MdCopyAll } from 'react-icons/md';
import { useCopyToClipboard } from 'react-use';

type Props = {
  link: string;
  className?: string;
};

const CopyLink: FC<Props> = ({ link, className = '' }) => {
  const { enqueueMessage } = useToastStore();
  const [state, copyToClipboard] = useCopyToClipboard();

  const onCopy = () => {
    copyToClipboard(link);
    enqueueMessage({
      text: 'Link copied and ready to share 👍🏾',
      type: 'success'
    });
  };

  return (
    <>
      <button
        onClick={onCopy}
        className={`my-2 group h-10 ${className} flex rounded-md items-center  transition-all  dark:hover:opacity-100 active:scale-95 `}
      >
        <input
          value={link}
          readOnly
          className="text-left h-full text-[12px] font-medium dark:bg-white dark:border-white w-full rounded-md border-r-0 rounded-r-none  border-2 border-black pointer-events-none text-black  transition-colors p-2"
        />
        <div className="w-10 border-2 dark:bg-white border-black dark:border-white dark:border-l-black rounded-md flex rounded-l-none items-center justify-center h-full group-hover:text-red-400   group-hover:border-red-400    transition-colors">
          <MdCopyAll size={20} />
        </div>
      </button>
      {state.error && (
        <p className="text-red-600 text-[12px] max-w-[70%] m-auto">
          Oops! an error occured whilst copying to clipboard, please try again
        </p>
      )}
    </>
  );
};

export default CopyLink;

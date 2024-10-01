import { ErrorObject } from '@app/services/request';
import { FC } from 'react';

type Props = {
  error: ErrorObject;
};

const ErrorMessage: FC<Props> = ({ error }) => {
  const { message, statusCode } = error;
  return (
    <div className="text-center flex flex-col items-center">
      <h3 className="text-[100px] mb-8 font-medium tracking-tighter text-red-400">
        {statusCode}
      </h3>
      <h6 className="font-bold mb-4 text-2xl">Oops!</h6>
      <p className="text-sm text-gray-400 dark:text-white  ">{message}...</p>
    </div>
  );
};

export default ErrorMessage;

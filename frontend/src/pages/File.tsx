import ErrorMessage from '@app/components/ErrorMessage';
import FileDownload from '@app/components/FileItem';
import FileLink from '@app/components/FileLink';
import Spinner from '@app/components/Spinner';
import PageWrapper from '@app/layout/PageWrapper';
import Request, { ErrorObject } from '@app/services/request';
import { FileMeta } from '@app/stores/links';
import { FC, useEffect, useState } from 'react';
import { useParams } from 'react-router';

const LoadingFile = () => {
  return (
    <div className="flex pt-24 flex-col items-center">
      <Spinner size="md" />
      <p className="mt-4">Loading file...</p>
    </div>
  );
};

const File: FC = () => {
  const { uuid } = useParams();

  const [meta, setMeta] = useState<FileMeta | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<ErrorObject | null>();

  const getMeta = async (uuid: string) => {
    try {
      setIsLoading(true);
      const res = await Request.getFileMeta(uuid);
      setMeta(res.data);
    } catch (error) {
      Request.errorHandler(error, (err) => setError(err));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (uuid) {
      getMeta(uuid);
    }
  }, [uuid]);

  return (
    <PageWrapper>
      {isLoading && <LoadingFile />}
      {error && <ErrorMessage error={error} />}
      {meta && (
        <div className="flex justify-center pt-28">
          <FileDownload meta={meta} />
        </div>
      )}
    </PageWrapper>
  );
};

export default File;

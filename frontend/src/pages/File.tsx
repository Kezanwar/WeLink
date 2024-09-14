import PageWrapper from '@app/layout/PageWrapper';
import Request, { ErrorObject } from '@app/services/request';
import { FileMeta } from '@app/stores/links';
import { FC, useEffect, useState } from 'react';

import { useParams } from 'react-router';

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
      <div className=""></div>
    </PageWrapper>
  );
};

export default File;

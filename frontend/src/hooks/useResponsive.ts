import { useCallback, useEffect, useMemo, useState } from 'react';
import { mediaQueries } from '../constants/responsive';

export function useMediaQuery(queries: string[]): boolean[] {
  const queriesMemo = useMemo(() => {
    return queries?.length ? queries : [];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queries?.length]);

  const getMatches = useCallback((): boolean[] => {
    return queriesMemo?.length
      ? queriesMemo.map((q) => window.matchMedia(q).matches)
      : [];
  }, [queriesMemo]);

  const [matches, setMatches] = useState<boolean[]>(getMatches());

  const handleChange = useCallback(() => {
    setMatches(getMatches());
  }, [getMatches]);

  useEffect(() => {
    if (queriesMemo?.length) {
      const matchMedias = queriesMemo.map((q) => window.matchMedia(q));

      // Triggered at the first client-side load and if query changes
      handleChange();

      // Listen matchMedias
      for (const match of matchMedias) {
        match.addEventListener('change', handleChange);
      }
    }

    return () => {
      const matchMedias = queriesMemo?.map((q) => window.matchMedia(q));
      if (matchMedias?.length) {
        for (const match of matchMedias) {
          match.removeEventListener('change', handleChange);
        }
      }
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queriesMemo?.length]);

  return matches;
}

export function useResponsive(): boolean[] {
  const queries = useMediaQuery([mediaQueries.lgPhone, mediaQueries.lgTablet]);
  return queries;
}

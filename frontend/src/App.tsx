// components
import ThemeRoot from '@app/layout/ThemeRoot';
import Header from '@app/features/Header';
import Toast from '@app/features/Toast';

//routes
import Router from '@app/routes';

//services
import Request from './services/request';
import { useEffect } from 'react';
import useLinksStore from './stores/links';

Request.init();

function App() {
  const { prune } = useLinksStore();
  useEffect(() => {
    prune();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <ThemeRoot>
      <Header />
      <Router />
      <Toast />
    </ThemeRoot>
  );
}

export default App;

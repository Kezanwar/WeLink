// components
import ThemeRoot from '@app/layout/ThemeRoot';
import Header from '@app/features/Header';
import Toast from '@app/features/Toast';

//routes
import Router from '@app/routes/routes';

//services
import Request from './services/request';

Request.init();

function App() {
  return (
    <ThemeRoot>
      <Header />
      <Router />
      <Toast />
    </ThemeRoot>
  );
}

export default App;

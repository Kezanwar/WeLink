// components
import ThemeRoot from '@app/components/layout/ThemeRoot';
import Header from '@app/components/features/Header';
import Toast from './components/features/Toast';

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

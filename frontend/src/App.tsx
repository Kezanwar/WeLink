// components
import { ThemeRoot } from '@app/components/layout/ThemeRoot';
import { Header } from '@app/components/features/Header';

// routes
import Router from '@app/routes/routes';
import Toast from './components/features/Toast';

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

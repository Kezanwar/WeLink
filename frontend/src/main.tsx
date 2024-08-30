import React from 'react';
import ReactDOM from 'react-dom/client';

// react-router
import { BrowserRouter } from 'react-router-dom';

// app
import App from './App.tsx';

// styles
import '@app/sass/styles.scss';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);

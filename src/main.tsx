import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { wtnStore } from './wtnSlice';
import AppLoader from './AppLoader';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={wtnStore}>
      <AppLoader />
    </Provider>
  </React.StrictMode>
);

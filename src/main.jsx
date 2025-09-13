import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { MotionConfig } from 'motion/react';
import { createRoot } from 'react-dom/client';
import { Toaster } from 'react-hot-toast';
import 'react-loading-skeleton/dist/skeleton.css';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import App from './App';
import './index.css';
import { persistor, store } from './store/store';
import { HelmetProvider } from 'react-helmet-async';

const queryClient = new QueryClient();
 
createRoot(document.getElementById('root')).render(
  <HelmetProvider>
  <QueryClientProvider client={queryClient}>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <MotionConfig
          transition={{
            reducedMotion: 'user',
            duration: 0.35,
            default: { type: 'tween', ease: [0, 0, 0.3, 1], duration: 0.35 },
            exit: { type: 'tween', ease: [0.3, 0, 1, 1], duration: 0.35 },
          }}
        >
          <App />
          <Toaster />
        </MotionConfig>
      </PersistGate>
    </Provider>
    <ReactQueryDevtools initialIsOpen={false} />
  </QueryClientProvider>
  </HelmetProvider>
);

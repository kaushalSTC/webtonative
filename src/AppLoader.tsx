import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import App from './App';

function loadWtnScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if ((window as any).webtonative) {
      resolve();
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/webtonative@1.0.73/webtonative.min.js';
    script.async = false;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load webtonative script'));
    document.head.appendChild(script);
  });
}

export default function AppLoader() {
  const isMobileApp = useSelector((state: any) => state.wtn.isMobileApp);
  const platform = useSelector((state: any) => state.wtn.platform);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (isMobileApp && (platform === 'ios' || platform === 'android')) {
      loadWtnScript().then(() => setReady(true));
    } else {
      setReady(true);
    }
  }, [isMobileApp, platform]);

  if (!ready) return <div>Loading...</div>;
  return <App />;
} 
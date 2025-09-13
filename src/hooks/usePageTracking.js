import { useEffect } from 'react';
import { useLocation } from 'react-router';
import { trackPageView } from '../utils/gtm';

const usePageTracking = () => {
  const location = useLocation();

  useEffect(() => {
    const pageTitle = document.title;
    trackPageView(pageTitle, location.pathname);
  }, [location]);
};

export default usePageTracking; 
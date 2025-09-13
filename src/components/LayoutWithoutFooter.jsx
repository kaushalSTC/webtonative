import { Outlet } from 'react-router-dom';
import Header from './Header/Header';
import usePageTracking from '../hooks/usePageTracking';

const LayoutWithoutFooter = () => {
  usePageTracking();
  return (
    <>
      <Header />
      <Outlet />
    </>
  );
};

export default LayoutWithoutFooter;

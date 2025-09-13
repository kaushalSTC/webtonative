import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import axios from 'axios';
import Footer from '../components/Footer/Footer';
import Header from '../components/Header/Header';
import { BASE_URL } from '../constants';
import { useDispatch, useSelector } from 'react-redux';
import { setLogout } from '../store/reducers/auth-slice';
import { resetPlayer } from '../store/reducers/player-slice';
import { resetBooking } from '../store/reducers/tournament-registeration-slice';
import MetaTag from './MetaTag';
import usePageTracking from '../hooks/usePageTracking';

const Layout = () => {
  usePageTracking();
  const location = useLocation();
  const navigate = useNavigate();
  const auth = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  
  /* 
  ┌─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
  │   Added to make a fetch on every page change and check if token is missing error occours                            │
  │   if Error -> Token is Missing - Reset States in Redux -> Navigate to Home Page                                     │
  └─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
  */
 useEffect(() => {
  if(location.pathname === '/community' && !auth.isLoggedIn) {
    navigate('/login');
  }
    const checkAuth = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/players/get-details`, { withCredentials: true });
        if (response.status !== 200) {
          dispatch(setLogout());
          dispatch(resetPlayer());
          dispatch(resetBooking());
          navigate('/');
        }
      } catch (error) {
        if (error.status !== 200) {
          dispatch(setLogout());
          dispatch(resetPlayer());
          dispatch(resetBooking());
          navigate('/');
        }
      }
    };

    if (auth.isLoggedIn) {
      checkAuth();
    }
  }, [location]); // Runs once when Layout is mounted

  return (
    <>
      <Header />
      <MetaTag />
      <div className={`${location.pathname.includes('tournaments') || location.pathname.includes('login') ? "" : "main-wrapper"}`}>
        <Outlet />
      </div>
      <Footer />
    </>
  );
};

export default Layout;

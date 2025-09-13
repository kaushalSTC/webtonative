import { createBrowserRouter, RouterProvider, ScrollRestoration, redirect } from 'react-router';


import './App.css';
import Layout from './components/Layout';
import LayoutWithoutFooter from './components/LayoutWithoutFooter';
import TournamentPaymentStatus from './components/TournamentBookingFlow/TournamentPaymentStatus/TournamentPaymentStatus';
import BlogDeatils from './pages/BlogDeatils';
import BlogListing from './pages/BlogListing';
import ComingSoon from './pages/ComingSoon';
import Faq from './pages/Faq';
import Homepage from './pages/Home';
import Login from './pages/Login';
import PersonalDetails from './pages/PersonalDetails';
import Profile from './pages/Profile';
import StaticPage from "./pages/StaticPage";
import TournamentBookingPage from './pages/TournamentBookingPage';
import TournamentDetails from './pages/TournamentDetails';
import TournamentListing from './pages/TournamentListing';
import UserAccount from './pages/UserAccount';
import VenueDetails from './pages/VenueDetails';
import VenueListing from './pages/VenueListing';
import TournamentLivePage from './pages/TournamentLive';
import AccountLayout from './components/AccountLayout/AccountLayout.jsx';
import GamesListing from './pages/GamesListing.jsx';
import CreateGame from './pages/CreateGame.jsx';
import GameDetails from './pages/GameDetails.jsx';
import EditGame from './pages/EditGame.jsx';
import ComingSoonLayout from './components/ComingSoonLayout';
import ContactUs from './pages/ContactUs.jsx';
import Community from './pages/Community.jsx';
import AboutUs from './pages/AboutUs.jsx';
import Tourism from './pages/Tourism.jsx';
import usePageTracking from './hooks/usePageTracking';
import SocialEventDetails from './pages/SocialEventDetails.jsx';
import SocialEventBookingPage from './pages/SocialEventBookingPage.jsx';
import SocialEventPaymentStatus from './components/SocialEvents/SocialEventPaymentStatus/SocialEventPaymentStatus.jsx';
import PlayingActivity from './pages/PlayingActivity.jsx';
import GameScorePage from './pages/GameScorePage.jsx';
import ViewGameScores from './pages/ViewGameScores.jsx';
import GameActivityRecorded from './pages/GameActivityRecorded.jsx';
import ViewTournamentScore from './pages/ViewTournamentScore.jsx';
import { useDispatch, useSelector } from 'react-redux';
import { setMobileConfig } from './store/reducers/wtn-slice.js';
import { useEffect } from 'react';
import { ValidPlatforms } from './constants.js';

const router = createBrowserRouter([
  {
    path: "/",
    element: <ComingSoonLayout />, // Render ComingSoon on root path
    children: [
    ]
  },
  {
    path: "",
    element: (
      <>
        <ScrollRestoration />
        <Layout />
      </>
    ),
    children: [
      {
        path: '/community',
        element: <Community />
      },
      {
        path: 'pages/:handle',
        element: <StaticPage />,
      },
      {
        path: 'pages/faq',
        element: <Faq/>,
      },
      {
        path: '/playing-activity/:id',
        element: <PlayingActivity/>,
      },
      {
        path: 'pages/contactUs',
        element: <ContactUs/>,
      },
      {
        path: 'pages/picklebay-retreats',
        element: <Tourism />,
      },
      {
        path: 'pages/about-us',
        element: <AboutUs />,
      },
      {
        index: true,
        element: <Homepage />
      },
      {
        path: 'venues/:handle',
        element: <VenueDetails />,
      },
      {
        path: 'venues',
        element: <VenueListing />,
      },
      {
        path: 'tournaments/:handle',
        element: <TournamentDetails />,
      },
      {
        path: 'tournaments/:handle/scores/fixture/:fixtureId',
        element: <ViewTournamentScore/>,
      },
      {
        path: "tournaments",
        element: <TournamentListing />,
      },
      {
        path: "tournaments/booking/payment-status",
        element: <TournamentPaymentStatus />,
      },
      {
        path: 'social-events/:handle',
        element: <SocialEventDetails />,
      },
      {
        path: "blogs/:handle",
        element: <BlogDeatils />,
      },
      {
        path: "blogs",
        element: <BlogListing />,
      },
      {
        path: "tournaments/:handle/live",
        element: <TournamentLivePage />,
      },
      {
        path: "logout",
        element: <UserAccount />,
      },
      {
        path: 'account',
        element: <Profile/>,
      },
      {
        path: 'account/bookings',
        element: <UserAccount/>,
      },
      {
        path: 'account/settings',
        element: <UserAccount/>,
      },
      {
        path: 'account/personal-details',
        element: <PersonalDetails/>,
      },
      {
        path: 'games',
        element: <GamesListing />,
      },
      {
        path: 'create-game',
        element: <CreateGame />,
      },
      {
        path: 'edit-game/:handle',
        element: <EditGame />,
      },
      {
        path: '/games/:handle',
        element: <GameDetails />,
      },
      {
        path: '/games/:handle/score',
        element: <GameScorePage />,
      },
      {
        path: '/games/:handle/score/conformation',
        element: <GameActivityRecorded />,
      },
      {
        path: '/games/:handle/score-details',
        element: <ViewGameScores />
      },
      {
        path: '*', // Catch-all for undefined routes
        element: <ComingSoon />, // For Future <404Page />
      },
    ],
  },
  {
    path: "login",
    element: <Login />,
  },
  {
    path: "/tournaments",
    element: (
      <>
        <ScrollRestoration />
        <LayoutWithoutFooter />
      </>
    ),
    children: [
      {
        path: "booking",
        element: <TournamentBookingPage />,
      },
      {
        path: "booking/:handle",
        element: <TournamentBookingPage />,
      },
      {
        path: '*', // Catch-all for undefined routes
        element: <ComingSoon />, // For Future <404Page />
      },
    ],
  },
  {
    path: "/social-events",
    element: (
      <>
        <ScrollRestoration />
        <LayoutWithoutFooter />
      </>
    ),
    children: [
      {
        path: "booking",
        element: <SocialEventBookingPage />,
      },
      {
        path: "booking/:handle",
        element: <SocialEventBookingPage />,
      },
      {
        path: "booking/payment-status",
        element: <SocialEventPaymentStatus />,
      },
      {
        path: '*', // Catch-all for undefined routes
        element: <ComingSoon />, // For Future <404Page />
      },
    ],
  },
  {
    path: '*', // Catch-all for undefined routes
    element: <ComingSoon />, // For Future <404Page />
  },
]);

function App() {
  const dispatch = useDispatch();
  const { platform } = useSelector((state)=> state.wtn);
  useEffect(() => {
    alert("Use Effect Triggerred");
    window.handleMobileConfig = (platform) => {
      try {
        if (window.handleMobileConfigSet) {
          return true;
        }

        if (platform && typeof platform === "string" && ValidPlatforms.includes(platform.toLowerCase())) {
          dispatch(setMobileConfig({ platform: platform.toLowerCase() }));
          window.handleMobileConfigSet = true;
          alert(`Platform Configured Successfully: ${platform}`);
          return true;
        } else {
          alert('Invalid config: platform must be "android" or "ios".');
          return false;
        }
      } catch (err) {
        alert('An error occurred while configuring the platform.');
        return false;
      }
    };

    return () => {
      delete window.handleMobileConfig;
    };
  }, [dispatch]);


  if(platform === "android") {
    return(
      <p>Hello World</p>
    )
  }

  return <RouterProvider router={router} />;
}

export default App;
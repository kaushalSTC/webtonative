import ActivitySummary from '../components/ActivitySummary/ActivitySummary';
import BookingHistory from '../components/BookingHistory/BookingHistory';
import CreatorsGames from '../components/CreatorsGames/CreatorsGames';
import GameInvitesSlider from '../components/GameInvitesSlider/GameInvitesSlider';
import ProfileUserInfo from '../components/ProflleUserInfo/ProfileUserInfo';
import SavedVenues from '../components/SavedVenues/SavedVenues';
import UpcomingJoinedGames from '../components/UpcomingJoinedGames/UpcomingJoinedGames';
import { useNavigate } from 'react-router';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import DeletedGames from '../components/DeletedGames/DeletedGames';
import UserActivity from '../components/UserActivity/UserActivity';
import UserDraftGames from '../components/UserDraftGames/UserDraftGames';

const Profile = () => {
  const navigate = useNavigate();
  const auth = useSelector((state) => state.auth);
  useEffect(() => {
    if (!auth.isLoggedIn) {
      navigate('/login');
    }
  },[auth.isLoggedIn]);
  return (
    <div className="main-container bg-f2f2f2">
      <div className="max-w-[720px] mx-auto px-0 w-full container bg-white pt-2">
        <ProfileUserInfo />
        <UpcomingJoinedGames />
        <GameInvitesSlider />
        <UserActivity/>
        <UserDraftGames/>
        <CreatorsGames />
        <ActivitySummary />
        <BookingHistory />
      </div>
    </div>
  );
};

export default Profile;

/* eslint-disable react/prop-types */
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router';
import Loader from '../components/Loader/Loader';
import ErrorState from '../components/Tournament/ErrorState/ErrorState';
import SocialEventDraftBooking from '../components/SocialEvents/SocialEventDraftBooking/SocialEventDraftBooking';
import { useCreateEventDraftBooking } from '../hooks/SocialEventHooks';
import UpdatePlayerDetails from '../components/TournamentBookingFlow/UpdatePlayerDetails/UpdatePlayerDetails';

function EventLoader() {
  return (
    <main className="w-full mx-auto bg-f2f2f2">
      <div className="max-w-[720px] mx-auto relative">
        <div className="flex justify-center item-center gap-6 w-full h-[95vh] bg-white relative">
          <Loader />
        </div>
      </div>
    </main>
  );
}

const SocialEventBookingPage = () => {
  const { handle } = useParams();
  const auth = useSelector((state) => state.auth);
  const player = useSelector((state) => state.player);
  const socialEventRegistration = useSelector((state) => state.socialEventRegistration);
  const { event } = socialEventRegistration;
  const navigate = useNavigate();

  useEffect(() => {
    if (!auth.isLoggedIn) navigate(`/login?redirect=/social-events`);
  }, [auth, navigate, handle]);

  /*
    ┌─────────────────────────────────────────────────────────────────────────────┐
    │   Mutations and Queries                                                     │
    └─────────────────────────────────────────────────────────────────────────────┘
  */
  const {
    mutate: createDraftBooking,
    isSuccess: isCreateDraftBookingSuccess,
    isPending: isCreateDraftBookingPending,
    isError: isCreateDraftBookingError,
    error: createDraftBookingError
  } = useCreateEventDraftBooking();

  useEffect(() => {
    if (
      auth.isLoggedIn &&                                                                           // Player is Logged In
      (!player.name.includes('Picklebay Player') && player.name && player.dob && player.gender) && // Player Has Valid Details
      event && event._id &&                                                                        // Event Is Selected
      !socialEventRegistration.booking.eventId                                                     // Booking Doesn't Already Exist
    ) {
      createDraftBooking({
        playerId: player.id,
        eventId: event._id
      });
    }
  }, [player]);

  /*
    ┌─────────────────────────────────────────────────────────────────────────────┐
    │   Error States                                                              │
    └─────────────────────────────────────────────────────────────────────────────┘
  */
  if (auth.isLoggedIn && !event) {
    return <ErrorState message="No event selected" redirectionPath="/social-events" />;
  }

  /*
    ┌─────────────────────────────────────────────────────────────────────────────┐
    │   Player Details Before Event Draft Booking                                 │
    └─────────────────────────────────────────────────────────────────────────────┘
  */
  if (auth.isLoggedIn && (player.name.includes('Picklebay Player') || !player.name || !player.dob || !player.gender)) {
    return <UpdatePlayerDetails />;
  }

  /*
    ┌─────────────────────────────────────────────────────────────────────────────┐
    │   Event Draft Booking Page                                                  │
    └─────────────────────────────────────────────────────────────────────────────┘
  */
  if (isCreateDraftBookingPending) {
    return <EventLoader />;
  }

  return (
    <SocialEventDraftBooking
      isCreateDraftBookingSuccess={isCreateDraftBookingSuccess}
      isCreateDraftBookingError={isCreateDraftBookingError}
      createDraftBookingError={createDraftBookingError}
    />
  );
};

export default SocialEventBookingPage;
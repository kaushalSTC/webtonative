/* eslint-disable react/prop-types */
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router';
import Loader from '../components/Loader/Loader';
import ErrorState from '../components/Tournament/ErrorState/ErrorState';
import TournamentDraftBooking from '../components/TournamentBookingFlow/TournamentDraftBooking/TournamentDraftBooking';
import UpdatePlayerDetails from '../components/TournamentBookingFlow/UpdatePlayerDetails/UpdatePlayerDetails';
import { useCreateDraftBookingMutation } from '../hooks/TournamentHooks';

function TournamentLoader() {
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

const TournamentBookingPage = () => {
  const { handle } = useParams();
  const auth = useSelector((state) => state.auth);
  const player = useSelector((state) => state.player);
  const tournamentRegisteration = useSelector((state) => state.tournamentRegisteration);
  const { selectedCategoriesIds, selectedCategories, tournament, booking } = tournamentRegisteration;
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!auth.isLoggedIn) navigate(`/login?redirect=/tournaments`);
  }, [auth, navigate, handle]);

  /*
    ┌─────────────────────────────────────────────────────────────────────────────┐
    │   Mutations and Queries                                                     │
    └─────────────────────────────────────────────────────────────────────────────┘
  */
  const { mutate: createDraftBooking, isSuccess: isCreateDraftBookingSuccess, isPending: isCreateDraftBookingPending, isError: isCreateDraftBookingError, error: createDraftBookingError } = useCreateDraftBookingMutation();

  useEffect(() => {
    if (
      auth.isLoggedIn &&                                                                              // Player is Logged In
      (!player.name.includes('Picklebay Player') && player.name && player.dob && player.gender) &&    // Player Has Valid Details
      selectedCategoriesIds?.length !== 0 &&                                                          // Player Has Selected Categories
      tournamentRegisteration.tournamentId &&                                                         // Tournament Id Is Set
      booking.tournamentId !== tournamentRegisteration.tournamentId                                   // Booking Doesn't Already Exist with same Tournament Id
    ) {
      createDraftBooking({
        playerId: player.id,
        tournamentId: tournamentRegisteration.tournamentId,
        categoryIds: tournamentRegisteration.selectedCategoriesIds,
        selectedCategories: tournamentRegisteration.selectedCategories,
      });
    }
  }, [player]);

  /*
    ┌─────────────────────────────────────────────────────────────────────────────┐
    │   Error States                                                              │
    └─────────────────────────────────────────────────────────────────────────────┘
  */
  if (auth.isLoggedIn && selectedCategoriesIds?.length === 0) return <ErrorState message="Please select at least one category" redirectionPath={`/tournaments/${tournamentRegisteration.tournament.handle}`}></ErrorState>;

  /*
    ┌─────────────────────────────────────────────────────────────────────────────┐
    │   Player Details Before Tournament Draft Booking                            │
    └─────────────────────────────────────────────────────────────────────────────┘
  */
  if (auth.isLoggedIn && (player.name.includes('Picklebay Player') || !player.name || !player.dob || !player.gender)) return <UpdatePlayerDetails></UpdatePlayerDetails>;

  /*
    ┌─────────────────────────────────────────────────────────────────────────────┐
    │   Tournament Draft Booking Page                                             │
    │   Player Adds Doubles Partners                                              │
    └─────────────────────────────────────────────────────────────────────────────┘
  */
  if (isCreateDraftBookingPending) return <TournamentLoader></TournamentLoader>;

  return (
    <TournamentDraftBooking
      isCreateDraftBookingSuccess={isCreateDraftBookingSuccess}
      isCreateDraftBookingError={isCreateDraftBookingError}
      createDraftBookingError={createDraftBookingError}
    />
  );
};

export default TournamentBookingPage;

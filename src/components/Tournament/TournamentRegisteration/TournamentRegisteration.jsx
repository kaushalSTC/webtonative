/* eslint-disable react/prop-types */
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import Button from '../../../components/Button/Button';
import { canBookOnDate } from '../../../utils/utlis';
import { useLocation } from 'react-router';
import { trackTournamentRegistrationClick } from '../../../utils/gtm';

function getCategorySelectedFee(category) {
  // Case: League + MIL requires explicit gender selection
  if (category.format === 'LEAGUE' && category.type === 'MIL') {
    if (!category.selectedGender) {
      return null; // No fee until gender is selected
    }
    if (category.selectedGender === 'male' && category.registrationFeeForMen != null) {
      return category.registrationFeeForMen;
    }
    if (category.selectedGender === 'female' && category.registrationFeeForWomen != null) {
      return category.registrationFeeForWomen;
    }
    return category.registrationFee || null;
  }

  // Normal categories - use the standard registration fee
  return category.registrationFee || null;
}

function calculateSelectedCategoriesTotal(categories) {
  if (!categories || categories.length === 0) return 0;

  return categories
    .filter(category => category.isSelected)
    .reduce((sum, category) => {
      const fee = getCategorySelectedFee(category);
      return fee != null ? sum + fee : sum;
    }, 0);
}

function findLowestAvailablePrice(categories = []) {
  const fees = categories.flatMap(category =>
    [category.registrationFee, category.registrationFeeForMen, category.registrationFeeForWomen]
      .filter(fee => fee != null)
  );

  return fees.length ? Math.min(...fees) : null;
}

// Helper function to parse DD/MM/YYYY date strings
const parseDateString = (dateString) => {
  if (!dateString) return null;
  const parts = dateString.split('/');
  if (parts.length !== 3) return null;
  return new Date(parts[2], parts[1] - 1, parts[0]);
};

const TournamentRegisteration = ({ scrollCategorySectionIntoView }) => {
  const location = useLocation();
  const tournamentRegisteration = useSelector(state => state.tournamentRegisteration);
  const tournament = tournamentRegisteration.tournament;
  const { categories } = tournament;
  const navigate = useNavigate();
  const auth = useSelector(state => state.auth);

  // Calculate price based on selected categories, or show lowest available price
  const selectedCategoriesTotal = calculateSelectedCategoriesTotal(categories);
  const hasSelectedCategories = categories?.some(cat => cat.isSelected);
  const price = hasSelectedCategories ? selectedCategoriesTotal : findLowestAvailablePrice(categories);

  const isBookingAllowed = (() => {
    const { bookingStartDate, bookingEndDate } = tournament;
    if (!bookingStartDate || !bookingEndDate) {
      return false;
    }

    const startDate = parseDateString(bookingStartDate);
    const endDate = parseDateString(bookingEndDate);

    if (!startDate || !endDate) {
      console.error("Error parsing tournament booking dates:", bookingStartDate, bookingEndDate);
      return false;
    }

    const currentDate = new Date();

    // Set start date to beginning of the day
    startDate.setHours(0, 0, 0, 0);

    // Set end date to end of the day (11:59:59 PM)
    endDate.setHours(23, 59, 59, 999);

    // Keep current date as is (with current time)
    return currentDate >= startDate && currentDate <= endDate;
  })();

  const regiterationHandler = () => {
    const selectedCategories = tournament?.categories?.filter((category) => category.isSelected);
    
    // Calculate total price using the correct fee calculation
    const totalPrice = calculateSelectedCategoriesTotal(tournament.categories);

    trackTournamentRegistrationClick(
      tournament.handle,
      tournament.tournamentName,
      selectedCategories.map(cat => cat.categoryName),
      totalPrice
    );

    if (tournament.categories.every(category => !category.isSelected)) {
      if (scrollCategorySectionIntoView) {
        scrollCategorySectionIntoView();
      }
      return null;
    }

    if (!auth.isLoggedIn) {
      return navigate(`/login?redirect=/tournaments/booking&tournament=${tournament.handle}`);
    }

    navigate('/tournaments/booking');
  };

  if (!categories || categories?.length <= 0) return null;

  return (
    <div className={`w-full bg-transparent gap-[18px] flex flex-col sticky bottom-[60px] md:bottom-0 left-0 right-0 z-[1] py-5 px-[15px] md:px-0 md:py-0`}>
      <div className={`flex flex-row w-full bg-white rounded-r-20 md:rounded-none gap-3 p-5 md:px-20 md:py-4 justify-between items-center border border-t-f2f2f2 border-l-f2f2f2 border-r-f2f2f2 md:border-t-2 md:border-l-0 md:border-r-0 md:border-b-0 md:border-f2f2f2`}>
        {price && price > 0 && (
          <div className="flex flex-col items-start justify-center min-w-0 leading-tight">
            <p className="font-general font-medium text-383838 opacity-70 text-sm">
              {hasSelectedCategories ? 'Total Amount' : 'Starting From'}
            </p>
            <p
              className="font-general font-semibold text-base text-1c0e0e capitalize mt-0 p-0 leading-tight whitespace-nowrap"
              style={{ willChange: 'contents', transform: 'translateZ(0)' }}
            >
              INR {price}/-
            </p>
          </div>
        )}

        <Button
          onClick={regiterationHandler}
          className="bg-383838 flex ml-auto flex-row items-center justify-center text-ffffff font-general text-base w-auto rounded-full py-3.5 px-9 cursor-pointer"
          disabled={!isBookingAllowed}
        >
          Register Now
        </Button>
      </div>
    </div>
  );
};

export default TournamentRegisteration;
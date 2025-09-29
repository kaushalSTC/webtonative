/* eslint-disable react/prop-types */
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import Button from '../../../components/Button/Button';
import { useEffect } from 'react';
import { setSocialEvent } from '../../../store/reducers/social-event-registration-slice';

// --- Fee helpers ---
function getCategorySelectedFee(category) {
  if (category.format === 'LEAGUE' && category.type === 'MIL') {
    if (!category.selectedGender) return null;
    if (category.selectedGender === 'male' && category.registrationFeeForMen != null) {
      return category.registrationFeeForMen;
    }
    if (category.selectedGender === 'female' && category.registrationFeeForWomen != null) {
      return category.registrationFeeForWomen;
    }
    return category.registrationFee || null;
  }
  return category.registrationFee || null;
}

function calculateSelectedCategoriesTotal(categories = []) {
  return categories
    .filter(cat => cat.isSelected)
    .reduce((sum, cat) => {
      const fee = getCategorySelectedFee(cat);
      return fee != null ? sum + fee : sum;
    }, 0);
}

function findLowestAvailableCategoryPrice(categories = []) {
  const fees = categories.flatMap(cat =>
    [cat.registrationFee, cat.registrationFeeForMen, cat.registrationFeeForWomen]
      .filter(fee => fee != null)
  );
  return fees.length ? Math.min(...fees) : null;
}

const parseDateString = (dateString) => {
  if (!dateString) return null;
  const parts = dateString.split('/');
  if (parts.length !== 3) return null;
  return new Date(parts[2], parts[1] - 1, parts[0]);
};

const SocialEventRegistration = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const auth = useSelector(state => state.auth);
  const socialEventRegistration = useSelector(state => state.socialEventRegistration);

  // IMPORTANT: read selectedSocialEvent from the slice root (fixed bug)
  const { event, selectedSocialEvent } = socialEventRegistration || {};
  if (!event) return null;

  useEffect(() => {
    if (!event?.tournamentData?.categories) {
      dispatch(
        setSocialEvent({
          eventId: event._id,
          isSocialEventSelected: true,
        })
      );
    }
  }, [event?.tournamentData])

  const categories = event?.tournamentData?.categories || [];

  // --- Determine event fee ---
  const rawEventFee = event?.registrationFee ?? event?.eventFee ?? event?.fee ?? null;
  const eventFee = rawEventFee != null ? Number(rawEventFee) : null;

  // --- Calculate totals ---
  const selectedCategoriesTotal = calculateSelectedCategoriesTotal(categories);
  const hasSelectedCategories = categories.some(cat => cat.isSelected);

  // Social-only event: if there are no tournament categories, just use eventFee
  let eventPrice = 0;
  if (categories.length === 0) {
    eventPrice = eventFee || 0;
  } else {
    // If user explicitly selected the social event, include its fee
    eventPrice = selectedSocialEvent && eventFee ? eventFee : 0;
  }

  const categoriesPrice = hasSelectedCategories ? selectedCategoriesTotal : 0;
  const totalSelectedPrice = eventPrice + categoriesPrice;

  // If nothing selected, show lowest available price
  const lowestCategoryPrice = findLowestAvailableCategoryPrice(categories);
  const fallbackCandidates = [];
  if (eventFee != null) fallbackCandidates.push(eventFee);
  if (lowestCategoryPrice != null) fallbackCandidates.push(lowestCategoryPrice);
  const fallbackPrice = fallbackCandidates.length ? Math.min(...fallbackCandidates) : null;

  const price = totalSelectedPrice > 0 ? totalSelectedPrice : fallbackPrice;


  // --- Booking window check ---
  const isBookingAllowed = (() => {
    const { bookingStartDate, bookingEndDate } = event;
    if (!bookingStartDate || !bookingEndDate) return false;

    const startDate = parseDateString(bookingStartDate);
    const endDate = parseDateString(bookingEndDate);
    if (!startDate || !endDate) return false;

    const currentDate = new Date();
    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(23, 59, 59, 999);

    return currentDate >= startDate && currentDate <= endDate;
  })();

  const registrationHandler = () => {
    if (!auth.isLoggedIn) {
      return navigate(`/login?redirect=/social-events/booking&event=${event.handle}`);
    }
    navigate('/social-events/booking');
  };
  // Render only if we have a price to show OR booking allowed (otherwise hide)
  if (price == null && !isBookingAllowed) return null;

  return (
    <div className="w-full bg-transparent gap-[18px] flex flex-col sticky bottom-[60px] md:bottom-0 left-0 right-0 z-[1] py-5 px-[15px] md:px-0 md:py-0">
      <div className="flex flex-row w-full bg-white rounded-r-20 md:rounded-none gap-3 p-5 md:px-20 md:py-4 justify-between items-center border border-t-f2f2f2 border-l-f2f2f2 border-r-f2f2f2 md:border-t-2 md:border-l-0 md:border-r-0 md:border-b-0 md:border-f2f2f2">
        {price != null && price > 0 && (
          <div className="flex flex-col items-start justify-center min-w-0 leading-tight">
            <p className="font-general font-medium text-383838 opacity-70 text-sm">
              {totalSelectedPrice > 0 ? 'Total Amount' : 'Starting From'}
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
          onClick={registrationHandler}
          className="bg-383838 flex ml-auto flex-row items-center justify-center text-ffffff font-general text-base w-auto rounded-full py-3.5 px-9 cursor-pointer"
          disabled={!isBookingAllowed}
        >
          Register Now
        </Button>
      </div>
    </div>
  );
};

export default SocialEventRegistration;

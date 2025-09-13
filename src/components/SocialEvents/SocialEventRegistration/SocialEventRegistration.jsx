/* eslint-disable react/prop-types */
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import Button from '../../../components/Button/Button';

const parseDateString = (dateString) => {
  if (!dateString) return null;
  const parts = dateString.split('/');
  if (parts.length !== 3) return null;
  return new Date(parts[2], parts[1] - 1, parts[0]);
};

const SocialEventRegistration = () => {
  const navigate = useNavigate();
  const auth = useSelector((state) => state.auth);
  const eventState = useSelector((state) => state.socialEventRegistration);
  const event = eventState.event;

  const isBookingAllowed = (() => {
    const { bookingStartDate, bookingEndDate } = event;
    if (!bookingStartDate || !bookingEndDate) return false;

    const startDate = parseDateString(bookingStartDate);
    const endDate = parseDateString(bookingEndDate);
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    if (endDate) endDate.setHours(23, 59, 59, 999);

    return startDate && endDate && currentDate >= startDate && currentDate <= endDate;
  })();

  const registrationHandler = () => {
    if (!event || !event._id) return;


    if (!auth.isLoggedIn) {
      return navigate(`/login?redirect=/social-events/booking&event=${event.handle}`);
    }

    navigate('/social-events/booking');
  };

  if (!event) return null;

  return (
    <div className="w-full bg-ffffff gap-[18px] flex flex-col sticky bottom-0 left-0 right-0 z-[1] border-t-2 border-f2f2f2">
      <div className="flex flex-row w-full px-9 md:px-20 py-4 justify-between items-center">
        <div className="flex flex-col items-start justify-center min-w-0 leading-tight">
          <p className="font-general font-medium text-383838 opacity-70 text-sm">Registration Fee</p>
          <p className="font-general font-semibold text-base text-1c0e0e capitalize mt-0 p-0 leading-tight whitespace-nowrap"
             style={{ willChange: 'contents', transform: 'translateZ(0)' }}>
            INR {event.registrationFee}/-
          </p>
        </div>

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

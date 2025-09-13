import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import Loader from '../components/Loader/Loader';
import ErrorState from '../components/Tournament/ErrorState/ErrorState';
import SocialEventSwiper from '../components/SocialEvents/SocialEventSwiper/SocialEventSwiper';
import SocialEventInfo from '../components/SocialEvents/SocialEventInfo/SocialEventInfo';
import SocialEventsWhatToExpect from '../components/SocialEvents/SocialEventsWhatToExpect/SocialEventsWhatToExpect';
import { Helmet } from 'react-helmet';
import { useEventByHandleQuery, useTrendingCommunityEvents } from '../hooks/SocialEventHooks';
import SocialEventGallery from '../components/SocialEvents/SocialEventGallery/SocialEventGallery';
import SocialEventPreRequisites from '../components/SocialEvents/SocialEventPreRequisites/SocialEventPreRequisites';
import SocialEventSponsors from '../components/SocialEvents/SocialEventSponsors/SocialEventSponsors';
import SocialEventPreviousEvents from '../components/SocialEvents/SocialEventPreviousEvents/SocialEventPreviousEvents';
import SocialEventOrganizer from '../components/SocialEvents/SocialEventOrganizer/SocialEventOrganizer';
import SocialEventRegistration from '../components/SocialEvents/SocialEventRegistration/SocialEventRegistration';
import { setEvent } from '../store/reducers/socialevent-registration-slice';
import TrendingCommunityEvents from '../components/SocialEvents/TendingCommunityEvents/TendingCommunityEvents';
import { DownArrow } from '../assets';

const SocialEventDetails = () => {
  const { handle } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { data: { event } = {}, isLoading, isError, error } = useEventByHandleQuery(handle);
  const { data: trendingSection = {}, isLoading: trendingLoading } = useTrendingCommunityEvents();

  // Move the dispatch to useEffect to avoid state updates during render
  useEffect(() => {
    if (event) {
      dispatch(setEvent(event));
    }
  }, [event, dispatch]);

  if (!handle) return <ErrorState message="No event handle provided"></ErrorState>;

  if (isError) return <ErrorState message={error?.message || 'Something went wrong'}></ErrorState>;

  if (isLoading) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <Loader size="lg" />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Picklebay - Social Event Details</title>
        <meta name="description" content="Explore social events with Picklebay." />
        <link rel="canonical" href={`https://picklebay.com/social-events/${event.handle}`} />
      </Helmet>
      <main className="w-full mx-auto bg-f2f2f2">
        <div className="max-w-[720px] mx-auto relative">
          <SocialEventSwiper event={event} />
          <SocialEventInfo event={event} />
          <SocialEventsWhatToExpect event={event} />
          <SocialEventGallery event={event} />
          <SocialEventPreRequisites event={event} />
          <SocialEventSponsors event={event} />
          <SocialEventOrganizer event={event} />
          <SocialEventPreviousEvents event={event} />
          <TrendingCommunityEvents section={trendingSection} isLoading={trendingLoading} />

          {/* Refund and Terms and Conditions */}
          <div className="w-full bg-white px-9 md:px-20 py-10 pb-5 flex flex-col">
            <div
              className='flex items-center justify-between w-full mb-5 cursor-pointer'
              onClick={() => navigate('/pages/termsConditions')}
            >
              <p className='text-xs md:text-sm font-general font-medium text-383838'>Terms & Conditions</p>
              <img src={DownArrow} alt="Down Arrow" className='w-[25px] h-[25px] inline-block mr-[6px] rotate-270' />
            </div>
            {/* Divider */}
            <hr className="border-t border-gray-200 w-full my-0 mb-5" />
            <div
              className='flex items-center justify-between w-full mb-5 cursor-pointer'
              onClick={() => navigate('/pages/refundsCancellations')}
            >
              <p className='text-xs md:text-sm font-general font-medium text-383838'>Refunds & Cancellations</p>
              <img src={DownArrow} alt="Down Arrow" className='w-[25px] h-[25px] inline-block mr-[6px] rotate-270' />
            </div>
          </div>

          <SocialEventRegistration />
        </div>
      </main>
    </>
  );
};

export default SocialEventDetails;

import PropTypes from 'prop-types';
import { useState } from 'react';
import { RWebShare } from 'react-web-share';
import parse from 'html-react-parser';
import { CalendarIcon, Location, MapIcon, ShareIcon } from '../../../assets';
import { convertSingleTimeTo12Hour, formatAddress, getDateString } from '../../../utils/utlis';
import CommunityButton from '../../CommunityButton/CommunityButton';
import { useCreateEventPost } from '../../../hooks/SocialEventHooks';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { createToast, createErrorToast } from '../../../utils/utlis';

const SocialEventInfo = ({ event }) => {
  const [isSharing, setIsSharing] = useState(false);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const navigate = useNavigate();
  const playerID = useSelector((state) => state.player.id);
  const BASE_URL = `${import.meta.env.VITE_DEV_URL}`;
  const joinEventLink = `${BASE_URL}events/${event.handle}`;

  const { mutate: createEventPost, isLoading: isCreateEventPostLoading } = useCreateEventPost();

  // Safely access dates with null checkse
  const bookingStartDate = event?.bookingStartDate ? getDateString(event.bookingStartDate) : null;
  const bookingEndDate = event?.bookingEndDate ? getDateString(event.bookingEndDate) : null;
  const startTime = event?.startTime ? convertSingleTimeTo12Hour(event.startTime) : '';
  const endTime = event?.endTime ? convertSingleTimeTo12Hour(event.endTime) : '';
  const startDate = event?.startDate ? getDateString(event.startDate) : '';

  const handleCreateEventPost = () => {
    createEventPost({ 
      playerID, 
      eventHandle: event.handle, 
      eventLinkObj: { eventJoinLink: joinEventLink } 
    }, {
      onSuccess: (data) => {
        createToast('Event post created successfully');
        navigate('/community');
      },
      onError: (error) => {
        console.log(error, 'error');
        createErrorToast(error?.response?.data?.message || 'Failed to create event post');
      }
    });
  };

  const handleOpenMap = () => {
    const address = event?.eventLocation?.address;
    if (!address) {
      console.warn('No address available for mapping');
      return;
    }

    const fullAddress = formatAddress(address);
    if (!fullAddress.trim()) {
      console.warn('Empty address after formatting');
      return;
    }

    const googleMapUrl = `https://www.google.com/maps?q=${encodeURIComponent(fullAddress)}`;
    window.open(googleMapUrl, "_blank");
  };

  const getRegistrationStatus = (bookingStartDate, bookingEndDate) => {
    if (!bookingStartDate || !bookingEndDate) return '';
  
    const today = new Date();
  
    const [startDay, startMonth] = bookingStartDate.split('/').map(Number);
    const [endDay, endMonth] = bookingEndDate.split('/').map(Number);
  
    const startDate = new Date(2025, startMonth - 1, startDay);
    const endDate = new Date(2025, endMonth - 1, endDay);
  
    if (today < startDate) {
      return (
        <div className='bg-f4f5ff px-9 md:px-20 py-3 rounded-md'>
          <p className='font-general font-medium text-xs md:text-sm text-383838'>
            Registrations open on 
          </p>
          <span className='text-black font-general font-medium text-xs md:text-sm'>{getDateString(bookingStartDate)}</span>
        </div>
      );
    } else if (today > endDate) {
      return (
        <div className='bg-f4f5ff px-9 md:px-20 py-3 rounded-md flex items-center justify-between'>
          <p className='font-general font-medium text-xs md:text-sm text-383838'>
            Registrations closed on 
          </p>
          <span className='text-black font-general font-medium text-xs md:text-sm'>{getDateString(bookingEndDate)}</span>
        </div>
      );
    } else {
      return (
        <div className='bg-f4f5ff px-9 md:px-20 py-3 rounded-md space-y-1'>
          <div className='flex justify-between font-general text-sm text-383838'>
            <span className='text-black font-general font-medium text-xs md:text-sm'>Registrations Open</span>
            <span className='text-black font-general font-medium text-xs md:text-sm'>{getDateString(bookingStartDate)}</span>
          </div>
          <div className='flex justify-between font-general text-xs md:text-sm text-383838'>
            <span className='text-black font-general font-medium text-xs md:text-sm'>Registrations Close</span>
            <span className='text-black font-general font-medium text-xs md:text-sm'>{getDateString(bookingEndDate)}</span>
          </div>
        </div>
      );
    }
  };
  

  if (!event) {
    return null;
  }

  return (
    <>
      <div className="w-full bg-white px-9 md:px-20 py-10 pb-8 gap-2">
        <div className="flex flex-row items-center justify-between mb-3 md:mb-1">
          <h1 className="text-[24px] md:text-[34px] font-author font-medium text-383838 leading-8 tracking-normal capitalize">
            {event.eventName || 'Untitled Event'}
          </h1>

          <div className="flex">
            <RWebShare
              data={{ text: event.eventName || "", url: location.href, title: event.eventName || "" }}
              onShareWindowClose={() => setIsSharing(false)}
              beforeOpen={() => setIsSharing(true)}
              disabled={isSharing}
            >
              <img
                src={ShareIcon}
                alt="share-icon"
                className="w-5 h-5 ml-auto cursor-pointer"
                style={{ opacity: isSharing ? 0.5 : 1 }}
              />
            </RWebShare>
          </div>
        </div>

        {/* Event Details */}
        <div className="flex flex-col gap-4 mt-2">
          {/* Date and Time */}
          {startDate && (
            <div>
              <p className='font-medium font-general text-sm md:text-base text-383838 md:text-1c0e0e opacity-70'>Duration</p>
              <div className="flex items-center gap-2">
                <img src={CalendarIcon} alt="calendar" className="w-4 h-4" />
                <span className="font-general font-medium text-sm md:text-base text-1c0e0e capitalize opacity-70">
                  {startDate}
                </span>
              </div>
              <div className='w-full h-[1px] bg-f2f2f2 mt-5'></div>
            </div>
          )}

          {/* Location */}
          {event.eventLocation?.address && (
            <div className='flex items-center justify-between gap-2'>
              <div className="flex items-start gap-1">
                <img src={Location} alt="location" className="w-4 h-4 mt-1" />
                <span className="font-general font-medium text-base text-1c0e0e max-w-[230px] max-md:text-sm max-md:max-w-[220px] capitalize opacity-70">
                  {formatAddress(event.eventLocation.address)}
                </span>
              </div>
              <div className="cursor-pointer" onClick={handleOpenMap}>
                <span className="w-6 h-6 ml-auto block">
                  <img src={MapIcon} alt="map-icon" className="w-6 h-6 " />
                </span>
                <p className="font-medium font-general text-sm text-244cb4 underline max-md:text-[12px] text-right">
                  Map View
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Registration Status */}
      <div className="text-383838">
      {getRegistrationStatus(event.bookingStartDate, event.bookingEndDate)}
      </div>

      {/* Description */}
      {event.description && (
        <div className="w-full bg-white px-9 md:px-20 py-5 pb-8 gap-2 [&_p_a]:break-words">
          <div className="prose max-w-none mx-auto font-medium mb-2 font-general text-sm md:text-base text-1c0e0e opacity-70">Description</div>
          <div className="prose max-w-none mx-auto font-general font-medium text-sm text-383838 opacity-70">{parse(event.description)}</div>
        </div>
      )}


      {/* Community Share Section */}
      <div className="w-full bg-white px-9 md:px-20 py-10 pb-8">
        <div className='flex items-center justify-between flex-wrap gap-2'>
          <div className='md:max-w-[241px] max-w-full'>
            <p className='font-author font-medium text-383838 text-2xl'>Let the Community know</p>
            <p className='font-general font-medium text-xs md:text-sm text-383838 opacity-70'>Social events can be shared with the community with just a tap</p>
          </div>
          <div>
            <CommunityButton 
              enableLoader={true} 
              buttonTitle={'Share On Your Feed'} 
              handleCommunityButtonClick={handleCreateEventPost} 
              buttonTitleStyle={`min-w-[190px] font-general font-medium text-383838 cursor-pointer text-sm md:text-base py-2 h-[52px] flex items-center justify-center px-[30px] md:px-3 md:py-5 md:px-6 border border-383838 rounded-3xl`} 
            />
          </div>
        </div>
      </div>
    </>
  );
};

SocialEventInfo.propTypes = {
  event: PropTypes.shape({
    eventName: PropTypes.string,
    description: PropTypes.string,
    startDate: PropTypes.string,
    endDate: PropTypes.string,
    startTime: PropTypes.string,
    endTime: PropTypes.string,
    bookingStartDate: PropTypes.string,
    bookingEndDate: PropTypes.string,
    handle: PropTypes.string,
    eventLocation: PropTypes.shape({
      address: PropTypes.shape({
        line1: PropTypes.string,
        line2: PropTypes.string,
        city: PropTypes.string,
        state: PropTypes.string,
        postalCode: PropTypes.string
      })
    })
  }).isRequired
};

export default SocialEventInfo;
import React from 'react';
import { Link } from 'react-router';
import { Calendar, Location } from "../../assets";
import { convertSingleTimeTo12Hour, formatAddress, getDateString } from '../../utils/utlis';


const SocialEventCard = ({ event }) => {
  const {
    eventName,
    startDate,
    startTime,
    _id,
    bannerDesktopImages,
    handle,
    eventLocation,
    ownerBrandName
  } = event;

  
  return (
    <Link to={`/social-events/${handle}`} className="block">
      <div className="relative hover:shadow-lg transition-shadow duration-300 ease-in-out rounded-[20px] active:scale-[0.97] cursor-pointer">
        <div className="aspect-[352/191] overflow-hidden w-full rounded-tl-[20px] rounded-tr-[20px]">
          {bannerDesktopImages && bannerDesktopImages.length > 0 ? (
            <img
              src={bannerDesktopImages[0]}
              alt={eventName}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-f2f2f2 flex items-center justify-center">
              <span className="text-383838 opacity-50">
                No Image Available
              </span>
            </div>
          )}
        </div>
        <div className="border border-f0f0f0 rounded-bl-[20px] rounded-br-[20px] bg-white">
          <div className="pt-5 md:pt-4 pb-4 md:pb-2 px-5 border-b border-dbe0fc">
            <p className="font-author font-medium text-2xl text-383838 truncate uppercase">
              {eventName}
            </p>
            {ownerBrandName && (
              <p className="font-general font-medium text-sm md:text-base text-383838 opacity-100 uppercase whitespace-nowrap">
                <span className="font-general font-medium text-383838 text-xs md:text-sm opacity-70 capitalize mr-1">
                  Organized By: 
                </span>
                {ownerBrandName}
              </p>
            )}
          </div>
          <div className="flex items-center gap-10 px-5 py-4">
            <div className="flex items-center gap-2 whitespace-nowrap">
              <img src={Calendar} alt="calendar" className="w-4 h-4" />
              <p className="font-general font-medium text-sm text-383838 opacity-70 whitespace-nowrap">
                {getDateString(startDate)} | {convertSingleTimeTo12Hour(startTime)} IST
              </p>
            </div>
            <div className="flex items-center gap-2">
              <img src={Location} alt="location" className="w-4 h-4" />
              <p className="font-general font-medium text-sm text-383838 opacity-70 truncate max-w-[120px] md:max-w-[85px]">
                {formatAddress(eventLocation?.address)}
              </p>
            </div>
          </div>
        </div>
        <p className="uppercase font-general font-medium text-383838 text-xs bg-white py-[5px] px-[8px] absolute top-2 left-2 rounded-[22px]">
          community event
        </p>
      </div>
    </Link>
  );
};

export default SocialEventCard;
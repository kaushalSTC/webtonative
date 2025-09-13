import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import React, { useState } from "react";
import { RWebShare } from "react-web-share";
import { Clock, DropdownArrow, FeaturedIcon, Location, MapIcon, OpenLink, PhoneIcon, ShareIcon } from "../../assets";

function VenueDetailsInfo({ data }) {
  const venue = data?.data;


  const availableDays = venue.availableDays.reduce((acc, day) => {
    acc[day.day] = day;
    return acc;
  }, {});

  const firstActiveDay = venue?.availableDays.find(day => day.active);
  const openingTime = firstActiveDay?.openingTime;
  const closingTime = firstActiveDay?.closingTime;

  const fullAddress = `${venue.address.line1 ?? ""}, ${venue.address.line2 ?? ""
    }, ${venue.address.city ?? ""}, ${venue.address.state ?? ""}, ${venue.address.postalCode ?? ""
    }`.trim();

  const leastPrice = venue.courts?.reduce((min, court) => {
    return court.price < min ? court.price : min;
  }, Infinity);

  const curretUrl = window.Location.href;

  const handleOpenMap = () => {
    if (!fullAddress.trim()) return;
    const googleMapUrl = `https://www.google.com/maps?q=${encodeURIComponent(
      fullAddress
    )}`;
    window.open(googleMapUrl, "_blank");
  };

  const handleOpenLink = () => {
    if (venue.venueInfoUrl) window.open(venue.venueInfoUrl, '_blank');
  };

  const venueTag = venue?.tags[0];

  const [isSharing, setIsSharing] = useState(false);

  return (
    <div className="px-[35px] md:px-12">
      <div className="flex justify-between md:mt-10 mt-7">
        <div>
          <p className="font-medium font-author text-383838 max-md:text-2xl text-[34px] capitalize leading-none">
            {venue.name}
          </p>
          <p className="font-general font-medium max-md:text-sm text-base text-1c0e0e capitalize">
            {venue.address.line1 ? `${venue.address.line1}, ${venue.address.city}` : venue.address.city}
          </p>

        </div>
        <div className="flex flex-col gap-2">
          <RWebShare
            data={{ text: "", url: curretUrl, title: "" }}
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
          <div
            className={`flex items-center justify-center gap-2 bg-f2f2f2 rounded-3xl px-2 py-1 mt-auto ${venueTag ? "" : "hidden"
              }`}
          >
            <img
              src={FeaturedIcon}
              alt="featured-icon"
              className="w-3 h-3"
            />
            <span className="text-383838 text-xs font-medium font-general capitalize">
              {venue.tags[0]}
            </span>
          </div>
        </div>
      </div>

      <p className="text-1c0e0eB3 text-base font-general font-medium mt-12 max-md:mt-7 max-md:text-sm">
        Overview
      </p>

      <Menu as="div" className="relative inline-block text-left w-full mb-5">
        {({ open }) => {
          if (open) {
            document.documentElement.style.overflow = null;
            document.documentElement.style.padding = null;
          }

          return (
            <>
              <MenuButton className="inline-flex w-full items-center gap-x-1.5 rounded-md bg-white text-base font-general font-medium py-2 text-1c0e0e max-md:text-sm cursor-pointer">
                <img src={Clock} alt="Clock-icon" className="w-4 h-4" />
                <span className="font-general font-medium text-base text-56b918 max-md:text-sm">
                  Open
                </span>
                {openingTime} - {closingTime} | Mon - Sun
                <img src={DropdownArrow} alt="dropdown-arrow" className="w-4 h-4 ml-auto" />
              </MenuButton>
              <MenuItems
                transition
                className="absolute z-10 mt-2 w-full origin-top-right divide-y divide-gray-100 rounded-2xl bg-white shadow-lg ring-1 ring-black/5 transition focus:outline-hidden"
              >
                {venue.availableDays.slice(1).map(({ day }) => {
                  const dayInfo = availableDays[day] || availableDays["All days"];
                  return (
                    <MenuItem key={day} className="group">
                      <div className="flex items-center px-4 py-2 text-sm justify-between">
                        <p className={`font-medium font-general text-sm text-383838 capitalize ${dayInfo?.active ? "" : "opacity-70"}`}>
                          {day}
                        </p>
                        <p className="font-regular font-general text-sm text-383838 opacity-70 uppercase">
                          {dayInfo?.openingTime ? `${dayInfo.openingTime} - ${dayInfo.closingTime}` : "----------------------"} 
                        </p>
                      </div>
                    </MenuItem>
                  );
                })}
              </MenuItems>
            </>
          );
        }}
      </Menu>


      <div className="flex justify-between pt-6 pb-5 border-t border-f2f2f2 border-b">
        <div className="flex items-baseline gap-2">
          <span>
            <img src={Location} alt="Location-icon" className="w-4 h-4 " />
          </span>
          <p className="font-general font-medium text-base text-1c0e0e max-w-[230px] max-md:text-sm max-md:max-w-[220px] capitalize">
            {venue.address.line1}, {venue.address.line2}, {venue.address.city},{" "}
            {venue.address.state}, {venue.address.postalCode}
          </p>
        </div>
        <div onClick={handleOpenMap} data-google-map-url={`https://www.google.com/maps?q=${encodeURIComponent(fullAddress)}`}
         className="venue-map-btn cursor-pointer">
          <span className="w-6 h-6 ml-auto block">
            <img src={MapIcon} alt="map-icon" className="w-6 h-6 " />
          </span>
          <p className="venue-map-textfont-medium font-general text-sm text-244cb4 underline max-md:text-[12px]">
            Map View
          </p>
        </div>
      </div>

      <div className={`flex justify-between pt-[15px] md:pt-7 pb-[15px] md:pb-7 border-t border-f2f2f2 border-b ${venue.phoneNumber ? 'block' : 'hidden'}`}>
        <div className="flex items-baseline gap-2">
          <span>
            <img src={PhoneIcon} alt="Location-icon" className="w-4 h-4 " />
          </span>
          <p className="font-general font-medium text-base text-1c0e0e max-w-[230px] max-md:text-sm max-md:max-w-[220px] capitalize">
            {venue?.phoneNumber}
          </p>
        </div>
      </div>

      <div className="flex justify-between items-center pt-5">
        <div className={`${leastPrice === Infinity ? "invisible" : " "}`}>
          <p className="font-medium font-general text-sm text-383838 opacity-70  max-md:text-[12px]">
            Starting From
          </p>
          <p className="font-semibold font-general text-base text-1c0e0e">{`INR. ${leastPrice}/-`}</p>
        </div>
        <div
          onClick={handleOpenLink} data-venue-url={venue.venueInfoUrl || ''}
          className={`venue-info-btn cursor-pointer flex w-full justify-between p-5 border border-dbe0fc max-w-[260px] bg-f4f5ff rounded-r-20 max-md:max-w-[155px] ${venue.venueInfoUrl ? "cursor-pointer" : "cursor-grab"}`}
        >
          <p className="venue-info-text font-medium font-general text-size-12 text-244cb4">
            Get info
          </p>
          <span>
            {" "}
            <img src={OpenLink} alt="open-link" className="w-4 h-4 " />{" "}
          </span>
        </div>
      </div>
    </div>
  );
}

export default VenueDetailsInfo;

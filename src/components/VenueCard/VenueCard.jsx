import React from "react";
import { Link } from "react-router";
import { Clock, FeaturedIcon, Location, VenueImage } from "../../assets";
import { nanoid } from "nanoid";
import 'swiper/css';
import 'swiper/css/pagination';
import { Mousewheel, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

function VenueCard({ venue, imageLoading = "lazy" }) {
  const handle = venue?.handle;
  const VenueImages = venue?.bannerImages;

  const leastPrice = venue?.courts?.reduce((min, court) => {
    return court.price < min ? court.price : min;
  }, Infinity);

  const venueTag = venue?.tags[0];

  const firstActiveDay = venue?.availableDays.find(day => day.active);
  const openingTime = firstActiveDay?.openingTime;
  const closingTime = firstActiveDay?.closingTime;

  return (
    <Link
      to={`/venues/${handle}`}
      className="group relative"
    >
      <div className="divide-y divide-gray-200 overflow-hidden rounded-2xl bg-white border border-[#f0f0f0] hover:shadow-lg transition-shadow duration-300 ease-in-out mb-2">
        <Swiper
          pagination={true}
          modules={[Mousewheel, Pagination]}
          className="mySwiper"
          slidesPerView={1}
          spaceBetween={10}
          allowTouchMove={true}
          grabCursor={true}
          touchRatio={1} // Increase touch sensitivity
          simulateTouch={true}
          mousewheel={{
            forceToAxis: true,
            releaseOnEdges: true,
            invert: false,
            sensitivity: 1,
            thresholdDelta: 100,
          }}
          style={{
            '--swiper-pagination-color': '#244CB4',
            '--swiper-pagination-bullet-inactive-color': '#fff',
            '--swiper-pagination-bullet-inactive-opacity': '0.5',
            '--swiper-pagination-bullet-horizontal-gap': '0.19rem',
          }}
        >
          {VenueImages && VenueImages.length > 0 ? (
            VenueImages.map((media) => {
              const isVideo = media.type === "video";
              return (
                <SwiperSlide key={nanoid()}>
                  {isVideo ? (
                    <video
                      controls
                      src={media.url}
                      className="w-full h-full object-cover max-h-[450px]"
                    />
                  ) : (
                    <img
                      src={media.url}
                      alt="Venue"
                      className="w-full h-full object-cover max-h-[450px] aspect-350/262"
                      loading={imageLoading}
                    />
                  )}
                </SwiperSlide>
              );
            })
          ) : (
            <SwiperSlide>

              <img
                src={VenueImage}
                alt="Venue"
                className="w-full h-full object-cover max-h-[450px]"
                loading={imageLoading}
              />
            </SwiperSlide>
          )}
        </Swiper>

        <div className="md:px-[20px] px-[18px] py-5">
          <p className="max-md:text-sm font-semibold font-general text-383838 text-base mb-1 capitalize line-clamp-1">
            {venue.name}
          </p>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <img src={Location} alt="Location" />
              <p className="max-md:text-xs opacity-70 font-medium font-general text-[13px] text-383838 capitalize line-clamp-1 max-w-[130px]">
                {venue.address.line1 ? `${venue.address.line1}, ${venue.address.city}` : venue.address.city}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <img src={Clock} alt="Clock-icon" className="w-4 h-4" />
              <p className="max-md:text-xs opacity-70 font-medium font-general text-[13px] uppercase text-383838">
                {openingTime} - {closingTime}
              </p>
            </div>
          </div>
          <div
            className={`flex items-start justify-between pt-3 border-t-[1px] border-t-[#F2F2F2] ${leastPrice === Infinity ? "hidden" : ""
              }`}
          >
            <p className="max-md:text-xs font-medium font-general text-sm opacity-70 text-383838 capitalize">
              Starts from
            </p>
            <p className="max-md:text-sm text-base text-general opacity-100 text-383838 font-semibold">
              INR {leastPrice}{" "}
              <span className="max-md:text-xs font-medium font-general text-base opacity-70 text-383838">
                / Session
              </span>
            </p>
          </div>
        </div>

        <div
          className={`flex items-center justify-between px-[8px] py-[5px] absolute top-[9px] z-[2] right-[10px] bg-white rounded-xl gap-[5px] ${venueTag ? "" : "hidden"
            }`}
        >
          <img src={FeaturedIcon} alt="" className="w-3 h-3" />
          <p className="max-md:text-[10px] font-general font-medium text-xs text-383838 leading-none capitalize">
            {venue.tags[0]}
          </p>
        </div>
      </div>
    </Link>
  );
}

export default VenueCard;

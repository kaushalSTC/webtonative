import React, { useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import SocialEventCard from '../../SocialEventCard/SocialEventCard';
import Loader from '../../Loader/Loader';
import { BottomBarHomeActiveIcon, SwiperButton } from "../../../assets";

const TrendingCommunityEvents = ({ section = {}, isLoading }) => {
  console.log(section.isVisible, 'section');
  if (!section.isVisible) return null;
  const events = section.featuredSocialEvents || [];
  const swiperRef = useRef(null);
  
  const handlePrevClick = () => {
    if (swiperRef.current) {
      swiperRef.current.slidePrev();
    }
  };
  
  const handleNextClick = () => {
    if (swiperRef.current) {
      swiperRef.current.slideNext();
    }
  };

  if (isLoading) return <Loader size="md" color="loading" />;
  if (!events.length) return null;

  return (
    <div className="w-full bg-white px-9 md:px-20 py-10 pb-8 gap-[18px] flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center justify-start gap-3">
          <p className="font-general font-medium text-sm md:text-base text-383838 md:text-1c0e0eb3 opacity-70 md:opacity-100 capitalize">
            Trending Community Events
          </p>
        </div>
        <div className="flex items-center justify-between gap-3">
          <button
            className="flex w-[35px] h-[35px] items-center justify-center p-3 border rounded-full cursor-pointer hover:bg-gray-100"
            onClick={handlePrevClick}
          >
            <img src={SwiperButton} alt="Previous" className="rotate-180" />
          </button>
          <button
            className="flex w-[35px] h-[35px] items-center justify-center p-3 border rounded-full cursor-pointer hover:bg-gray-100"
            onClick={handleNextClick}
          >
            <img src={SwiperButton} alt="Next" />
          </button>
        </div>
      </div>

      <div>
        <Swiper
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
          }}
          modules={[Navigation]}
          spaceBetween={15}
          breakpoints={{
            320: {
              slidesPerView: 1.1,
            },
            389: {
              slidesPerView: 1.2,
            },
            840: {
              slidesPerView: 1,
            },
            1100: {
              slidesPerView: 1.8,
            },
          }}
        >
          {events.map((event) => (
            <SwiperSlide key={event._id}>
              <SocialEventCard event={event} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default TrendingCommunityEvents;

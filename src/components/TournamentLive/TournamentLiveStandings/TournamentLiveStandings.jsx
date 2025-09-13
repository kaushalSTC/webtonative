import React, { useState } from 'react'
import { useRef } from 'react'
import { SwiperButton } from '../../../assets'
import { nanoid } from 'nanoid'
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { TournamentFixtureFormats } from '../../../constants';
import TournamentStandingGenerator from './TournamentStandingGenerator';

const TournamentLiveStandings = ({ fixtures, EventFormat }) => {
  if (!fixtures || fixtures.length === 0) {
    return (
      <div>
        <p className='text-center py-6 font-general font-medium text-383838 text-sm md:text-base'>
          No Standings are available for this category.
        </p>
      </div>
    );
  }

  const [activeIndex, setActiveIndex] = useState(0);
  const heading = TournamentFixtureFormats[fixtures[activeIndex]?.format];
  const swiperRef = useRef(null);

  const handlePrevClick = () => {
    if (swiperRef.current && activeIndex > 0) {
      swiperRef.current.slidePrev();
    }
  };

  const handleNextClick = () => {
    if (swiperRef.current && activeIndex < fixtures.length - 1) {
      swiperRef.current.slideNext();
    }
  };

  const isFirstSlide = activeIndex === 0;
  const isLastSlide = activeIndex === fixtures.length - 1;

  const handleDropdownToggle = () => {
    if (swiperRef.current && swiperRef.current.updateAutoHeight) {
      // Small delay to ensure DOM has updated
      setTimeout(() => {
        swiperRef.current.updateAutoHeight();
      }, 10);
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between bg-white px-9 md:px-20 py-7">
        <div className="flex items-center justify-start gap-3">
          <p className="font-general font-medium text-sm md:text-base text-383838 md:text-1c0e0eb3 opacity-70 md:opacity-100 capitalize">
            {fixtures[activeIndex].name}
          </p>
        </div>
        {fixtures.length > 1 && (
          <div className="flex items-center justify-between gap-3">
            <button
              disabled={isFirstSlide}
              className={`flex w-[37px] h-[35px] items-center justify-center p-3 border-3 border-f2f2f2 rounded-full cursor-pointer hover:bg-gray-100 transition-opacity duration-200 ${
                isFirstSlide ? "opacity-40 cursor-not-allowed" : ""
              }`}
              onClick={handlePrevClick}
            >
              <img src={SwiperButton} alt="Previous" className="rotate-180" />
            </button>
            <button
              disabled={isLastSlide}
              className={`flex w-[37px] h-[35px] items-center justify-center p-3 border-3 border-f2f2f2 rounded-full cursor-pointer hover:bg-gray-100 transition-opacity duration-200 ${
                isLastSlide ? "opacity-40 cursor-not-allowed" : ""
              }`}
              onClick={handleNextClick}
            >
              <img src={SwiperButton} alt="Next" />
            </button>
          </div>
        )}
      </div>
      <Swiper
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
        }}
        onSlideChange={(swiper) => {
          setActiveIndex(swiper.activeIndex);
          handleDropdownToggle();
        }}
        spaceBetween={15}
        slidesPerView={1}
        autoHeight={true}
      >
        {fixtures.map((fixture) => (
          <SwiperSlide key={nanoid()}>
            <TournamentStandingGenerator
              fixture={fixture}
              handleDropdownToggle={handleDropdownToggle}
              EventFormat={EventFormat}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default TournamentLiveStandings
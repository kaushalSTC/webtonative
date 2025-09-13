import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { nanoid } from 'nanoid';
import React, { useRef } from 'react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Navigation } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import { SwiperButton } from '../../assets';
import Loader from '../Loader/Loader';
import VenueCard from '../VenueCard/VenueCard';
import { useSelector } from 'react-redux';

const fetchFeaturedVenues = async ({ queryKey }) => {
  const [, city] = queryKey;
  const baseURL = import.meta.env.VITE_DEV_URL;
  const response = await axios.get(`${baseURL}/api/public/homepage-sections`, {
    params: {
      section: 'venues',
      city: city || '',
    },
  });
  return response.data;
};

const HomepageFeaturedVenues = () => {
  const city = useSelector(state => state.location.city);
  const swiperRef = useRef(null);

  const { data: featuredVenue, isLoading, isError } = useQuery({
    queryKey: ['homepage-featured-venues', city],
    queryFn: fetchFeaturedVenues,
    enabled: !!city, // prevents query if city is not available yet
  });

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

  if (isLoading) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <h2 className="font-general font-medium text-base text-#1c0e0e">{featuredVenue?.data[0]?.sectionTitle}</h2>
        <Loader size="lg" color="loading " />
      </div>
    );
  }

  if (isError) {
    return null;
  }

  const venues = featuredVenue?.data[0]?.venues || [];

  if (venues.length === 0) return null;

  return (
    <>
      <style>{`
        .homepage-venues .swiper.homepage-venue-main-swiper {
            padding-left: 120px;
            padding-right: 0px;
            padding-bottom: 20px;
        }
        @media (max-width: 768px) {
            .homepage-venues .swiper.homepage-venue-main-swiper {
                padding-left: 16px;
                padding-right: 16px;
            }
        }
     `}</style>

      <div className='homepage-venues'>
        <div className="pb-7">
          <div className='flex items-center justify-between px-9 md:px-[140px] mb-7'>
            <div>
              <h2 className="font-general font-medium text-sm md:text-base text-#1c0e0e">Featured Venues</h2>
            </div>
            <div className='flex items-center justify-between gap-3'>
              <button
                className='flex w-[35px] h-[35px] items-center justify-center p-3 border rounded-full cursor-pointer hover:bg-gray-100'
                onClick={handlePrevClick}
              >
                <img src={SwiperButton} alt="Previous" className='rotate-180 ' loading='lazy'/>
              </button>
              <button
                className='flex w-[35px] h-[35px] items-center justify-center p-3 border rounded-full cursor-pointer hover:bg-gray-100'
                onClick={handleNextClick}
              >
                <img src={SwiperButton} alt="Next " />
              </button>
            </div>
          </div>

          <div>
            <Swiper
              onSwiper={(swiper) => {
                swiperRef.current = swiper;
              }}
              className='homepage-venue-main-swiper'
              modules={[Navigation]}
              spaceBetween={15}
              breakpoints={{
                320: { slidesPerView: 1 },
                389: { slidesPerView: 1.2 },
                840: { slidesPerView: 2.3 },
                1100: { slidesPerView: 3.4 }
              }}
            >
              {venues.map((venue) => (
                <SwiperSlide key={nanoid()}>
                  <VenueCard venue={venue?.venueID} />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </div>
    </>
  );
};

export default HomepageFeaturedVenues;

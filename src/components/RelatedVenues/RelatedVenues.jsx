/* eslint-disable react/prop-types */
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { nanoid } from 'nanoid';
import { useRef } from 'react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Navigation } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import { SwiperButton } from '../../assets';
import Loader from '../Loader/Loader';
import VenueCard from '../VenueCard/VenueCard';

const fetchRelatedVenues = async ({ tags, lat, lng }) => {
  const baseURL = import.meta.env.VITE_DEV_URL;
  return axios.get(`${baseURL}/api/public/venues`, {
    params: {
      tags,
      lat,
      lng,
    }
  });
};

const RelatedVenues = ({ data }) => {
  console.log(data,'data')
  const swiperRef = useRef(null);
  const relatedVenueTag = 'Feature';
  const lng = data?.data?.address?.location?.coordinates[0];
  const lat = data?.data?.address?.location?.coordinates[1];

  const { data: relatedVenues, isLoading, isError } = useQuery({
    queryKey: ['relatedVenues', relatedVenueTag],
    queryFn: () => fetchRelatedVenues({
      lat: lat,
      lng: lng,
      tags: relatedVenueTag
    }),
    enabled: !!relatedVenueTag,
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
        <h2 className="font-general font-medium text-base text-#1c0e0e">Related Venues</h2>
      <Loader size="lg" color="loading "/>
    </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-f2f2f2 p-6">
        <h2 className="font-general font-medium text-base text-#1c0e0e">Related Venues</h2>
        <p className="font-general font-medium text-sm text-383838 opacity-70">Unable to load related venues</p>
      </div>
    );
  }

  const venues = relatedVenues?.data?.data?.data || [];

  if (venues.length === 0) return null;

  if (Array.isArray(data.data.tags) && data.data.tags.length === 0) return null;

  return (
    <>
      <style>{`
        .vd-related-venue-swiper .main-swiper {
          padding-left: 53px;
        }
        @media (max-width: 768px) {
          .vd-related-venue-swiper .main-swiper {
            padding-left: 18px;
          }
        }
      `}</style>
      <div className="vd-related-venue-swiper bg-f2f2f2 pb-8 pt-4">
        <div className='flex items-center justify-between py-5 px-[35px] md:px-[76px] md:py-7'>
          <div>
            <h2 className="font-general font-medium text-sm md:text-base text-1c0e0eb3 md:text-#1c0e0e">Related Venues</h2>
            <p className="font-general font-medium text-xs md:text-sm text-383838 opacity-70">We&apos;re showing you more venues</p>
          </div>
          <div className='flex items-center justify-between gap-3'>
            <button
              className='flex w-[35px] h-[35px] items-center justify-center p-3 border rounded-full cursor-pointer hover:bg-gray-100'
              onClick={handlePrevClick}
            >
              <img src={SwiperButton} alt="Previous" className='rotate-180 '/>
            </button>
            <button
              className='flex w-[35px] h-[35px] items-center justify-center p-3 border rounded-full cursor-pointer hover:bg-gray-100'
              onClick={handleNextClick}
            >
              <img src={SwiperButton} alt="Next "/>
            </button>
          </div>
        </div>

        <Swiper
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
          }}
          className='main-swiper'
          modules={[Navigation]}
          slidesPerView={1.1}
          spaceBetween={10}
          breakpoints={{
            640: {
              slidesPerView: 1.91,
              spaceBetween: 15
            },
          }}
        >
          {venues.map((venue) => (
            <SwiperSlide key={nanoid()}>
              <VenueCard venue={venue} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </>
  );
};

export default RelatedVenues;
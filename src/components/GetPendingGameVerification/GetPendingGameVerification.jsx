import React, { useEffect, useRef } from 'react'
import PendingVerificationGameCard from '../PendingVerificationGameCard/PendingVerificationGameCard'
import { useGetPendingGameVerification } from '../../hooks/GameHooks';
import { useSelector } from 'react-redux';
import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import { SwiperButton } from '../../assets';
import Skeleton from 'react-loading-skeleton';

const GetPendingGameVerification = () => {
  const playerID = useSelector((state) => state.player.id);
  const { data, isLoading, error, refetch, isError } = useGetPendingGameVerification({ playerID: playerID });
  const swiperRef = useRef(null);

  if (!data || data.length === 0) return null;

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

  return (
    <div className="pending-verification-slider mb-10 bg-f4f5ff">
      <style>{`
        .pending-verification-slider .swiper {
          padding-left: 65px;
        }
        @media (max-width: 768px) {
          .pending-verification-slider .swiper {
            padding: 20px;
          }
        }
      `}</style>
      <div className="flex items-center justify-between mb-5 px-[33px] md:px-[73px] pt-6 md:pt-12">
        <h2 className="text-base text-1c0e0eb3 font-general font-medium capitalize">Validate Game Scores</h2>
        {data && data.length > 3 && (
          <div className="flex items-center justify-between gap-3">
            <button
              className="flex w-[41px] h-[41px] items-center justify-center p-3 border-2 border-f2f2f2 rounded-full cursor-pointer hover:bg-gray-100"
              onClick={handlePrevClick}
            >
              <img src={SwiperButton} alt="Previous" className="rotate-180" loading='lazy' />
            </button>
            <button
              className="flex w-[41px] h-[41px] items-center justify-center p-3 border-2 border-f2f2f2 rounded-full cursor-pointer hover:bg-gray-100"
              onClick={handleNextClick}
            >
              <img src={SwiperButton} alt="Next" loading='lazy' />
            </button>
          </div>
        )}
      </div>
      <div className="w-full">
        <Swiper
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
          }}
          modules={[Navigation]}
          spaceBetween={10}
          slidesPerView={'auto'}
          breakpoints={{
            768: {
              spaceBetween: 16,
            },
          }}
        >
          {isLoading ? (
            <div className='flex items-center gap-2'>
              <Skeleton height={200} width={250} />
              <Skeleton height={200} width={250} />
            </div>
          ) : data?.map((game, index) => (
            <SwiperSlide key={index} className="max-w-[352px]">
              <PendingVerificationGameCard game={game} handleRefresh={refetch} showButtons={true} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  )
}

export default GetPendingGameVerification
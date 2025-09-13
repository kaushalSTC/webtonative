import { nanoid } from 'nanoid';
import { useRef } from 'react';
import { useSelector } from 'react-redux';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Mousewheel, Navigation } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Balls, SwiperButton } from '../../assets';
import { useGetPlayerGameInvites } from '../../hooks/GameHooks';
import PendingRequestGameCard from '../PendingRequestGameCard/PendingRequestGameCard';
import Skeleton from 'react-loading-skeleton';
import { createErrorToast } from '../../utils/utlis';

const GameInvitesSlider = () => {
  const player = useSelector((state) => state.player);
  const { data: gameInvites, isLoading, error, refetch } = useGetPlayerGameInvites(player.id);
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

  const handleRefresh = () => {
    refetch();
  }
  
  if (gameInvites && gameInvites?.games?.length === 0) return null;

  if(error) {
    createErrorToast(error?.message || 'Failed to fetch game invites');
    return null;
  }

  return (
    <div>
      <div className="w-full h-[2px] md:h-[10px] bg-white mb-[30px]"></div>
      <div className="game-invites-slider-container pb-[30px]">
        <div className="px-[33px] md:px-[73px] flex flex-row items-center justify-between mb-3">
          <div className="flex flex-row items-center justify-start mb-4">
            <img src={Balls} alt="profile-activity" className="w-auto h-[15px] inline-block mr-[6px] " />
            <span className="font-general font-medium text-md md:text-base text-1c0e0eb3 capitalize inline">
              Pending Requests
            </span>
          </div>
          {gameInvites?.games?.length > 1 && (
            <div className="flex items-center justify-between gap-3">
              <button
                className="flex w-[41px] h-[41px] items-center justify-center p-3 border-2 border-f2f2f2 rounded-full cursor-pointer hover:bg-gray-100"
                onClick={handlePrevClick}
              >
                <img src={SwiperButton} alt="Previous" className="rotate-180 " />
              </button>
              <button
                className="flex w-[41px] h-[41px] items-center justify-center p-3 border-2 border-f2f2f2 rounded-full cursor-pointer hover:bg-gray-100"
                onClick={handleNextClick}
              >
                <img src={SwiperButton} alt="Next " />
              </button>
            </div>
          )}
        </div>

        <div className="w-full">
          <style>{`
            .game-invites-slider-container .swiper {
              padding-left: 65px;
            }
            @media (max-width: 768px) {
              .game-invites-slider-container .swiper {
                padding-left: 30px;
              }
            }
          `}</style>
          <Swiper
            onSwiper={(swiper) => {
              swiperRef.current = swiper;
            }}
            modules={[Navigation, Mousewheel]}
            spaceBetween={10}
            slidesPerView={'auto'}
            allowTouchMove={true}
            grabCursor={true}
            touchRatio={1.5}
            simulateTouch={true}
            mousewheel={true}
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
            )
              : gameInvites?.games?.map((game) => (
                <SwiperSlide key={nanoid()} className="max-w-[352px]">
                  <PendingRequestGameCard game={game} disableHover={true} handleRefresh={handleRefresh}/>
                </SwiperSlide>
              ))}
          </Swiper>
        </div>
      </div>
    </div>
  );
};

export default GameInvitesSlider;

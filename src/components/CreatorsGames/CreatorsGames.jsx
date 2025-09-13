import { nanoid } from 'nanoid';
import { useRef } from 'react';
import { useSelector } from 'react-redux';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Mousewheel, Navigation } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Balls, SwiperButton } from '../../assets';
import { useGetCreatedGames } from '../../hooks/GameHooks';
import GameCard from '../GameCard/GameCard';
import Loader from '../Loader/Loader';

const CreatorsGames = () => {
    const player = useSelector((state) => state.player);
    const { data: gameCreated, isLoading } = useGetCreatedGames(player.id);
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
  
    if (gameCreated && gameCreated.length === 0) return null;
  
    if (isLoading) {
      return (
        <>
          <div className="w-full h-[2px] md:h-[10px] bg-f2f2f2"></div>
          <div className="flex items-center justify-center mx-auto mt-4 w-full h-[20vh] max-w-[1600px]">
            <Loader />
          </div>
        </>
      );
    }
  
    return (
      <div>
        <div className="w-full h-[2px] md:h-[10px] bg-white mb-[30px]"></div>
        <div className="game-invites-slider-container pb-[30px]">
          <div className="px-[33px] md:px-[73px] flex flex-row items-center justify-between mb-5">
            <div className="flex flex-row items-center justify-start mb-4">
              <img src={Balls} alt="profile-activity" className="w-auto h-[15px] inline-block mr-[6px] "/>
              <span className="font-general font-medium text-md md:text-base text-1c0e0eb3 capitalize inline">
                Created Games
              </span>
            </div>
            {gameCreated.length > 1 && (
              <div className="flex items-center justify-between gap-3">
                <button
                  className="flex w-[41px] h-[41px] items-center justify-center p-3 border-2 border-f2f2f2 rounded-full cursor-pointer hover:bg-gray-100"
                  onClick={handlePrevClick}
                >
                  <img src={SwiperButton} alt="Previous" className="rotate-180 "/>
                </button>
                <button
                  className="flex w-[41px] h-[41px] items-center justify-center p-3 border-2 border-f2f2f2 rounded-full cursor-pointer hover:bg-gray-100"
                  onClick={handleNextClick}
                >
                  <img src={SwiperButton} alt="Next "/>
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
              allowTouchMove={true}
              grabCursor={true}
              touchRatio={1.5}
              simulateTouch={true}
              mousewheel={true}
              spaceBetween={10}
              slidesPerView={'auto'}
              breakpoints={{
                768: {
                  spaceBetween: 16,
                },
              }}
            >
              {gameCreated.map((game) => (
                <SwiperSlide key={nanoid()} className="max-w-[352px]">
                  <GameCard game={game} disableHover={true}/>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </div>
    );
}

export default CreatorsGames
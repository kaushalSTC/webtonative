import { nanoid } from 'nanoid';
import { useSelector } from 'react-redux';
import { useMediaQuery } from 'react-responsive';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Swiper, SwiperSlide } from 'swiper/react';
import { useGetPlayerJoinedGames } from '../../hooks/GameHooks';
import Loader from '../Loader/Loader';
import UpcomingJoinedGamesCard from '../UpcomingJoinedGamesCard/UpcomingJoinedGamesCard';
import { Mousewheel } from 'swiper/modules';

const UpcomingJoinedGames = () => {
  const isMobile = useMediaQuery({ query: '(max-width: 768px)' });
  const player = useSelector((state) => state.player);
  function getCurrentDateFormatted() {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const year = today.getFullYear();
  
    return `${day}/${month}/${year}`;
  }
  
  const currentDate = getCurrentDateFormatted();
  const { data: games, isLoading } = useGetPlayerJoinedGames(player.id, currentDate);

  if (games && games.length === 0) return null;

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
    <>
      <div className="w-full h-[2px] md:h-[10px] bg-f2f2f2"></div>
      <style>{`
        .upcoming-gamnes .swiper {
          padding-left: 76px;
        }
      `}</style>

      <div className="upcoming-gamnes py-9">
        <p className="pl-[33px] md:pl-[76px] font-general font-medium text-1c0e0eb3 text-base mb-[18px]">Upcoming</p>
        <div className="px-[33px] md:px-0 w-full flex flex-col md:flex-row overflow-x-hidden md:overflow-x-auto gap-4 scrollbar-hide items-start">
          {isMobile ? (
            <>
              {games.map((game) => (
                <UpcomingJoinedGamesCard gameInvite={game} key={nanoid()} />
              ))}
            </>
          ) : (
            <Swiper
              className='w-full'
              slidesPerView={'auto'}
              spaceBetween={10}
              modules={[Mousewheel]}
              allowTouchMove={true}
              grabCursor={true}
              touchRatio={1.5}
              simulateTouch={true}
              mousewheel={true}
            >
              {games.map((game) => (
                <SwiperSlide key={nanoid()} className='max-w-[506px]'>
                  <UpcomingJoinedGamesCard gameInvite={game} />
                </SwiperSlide>
              ))}
            </Swiper>
          )}
        </div>
      </div>
    </>
  );
};

export default UpcomingJoinedGames;

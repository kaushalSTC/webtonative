/* eslint-disable react/prop-types */
import { nanoid } from 'nanoid';
import { useRef } from 'react';
import { useMediaQuery } from 'react-responsive';
import { useNavigate } from 'react-router';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Navigation } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import { SwiperButton } from '../../assets';
import Button from '../Button/Button';
import GameCard from '../GameCard/GameCard';

const CMS_DATA = {
  title: 'Explore Games',
  subTitle: 'Join games happening near you',
};

const ExploreGamesSlider = ({headerSpacingDesktop = "140px", headerSpacingMobile = "18px", swiperPaddingDesktop = "140px", swiperPaddingMobile = "18px", showSubtitle = true, games = null}) => {
  const isMobile = useMediaQuery({ query: '(max-width: 768px)' });
  const swiperRef = useRef(null);
  const navigate = useNavigate();
  
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
    <>
      <style>{`
        .news-and-updates .swiper {
          padding-left: ${swiperPaddingDesktop};
        }
        @media (max-width: 768px) {
          .news-and-updates .swiper {
            padding-left: ${swiperPaddingMobile};
          }
        }
      `}</style>
      <div className="news-and-updates mb-20">
        <div className="flex items-center justify-between mb-5" style={{padding: isMobile ? `0 ${headerSpacingMobile}` : `0 ${headerSpacingDesktop}`}}>
          <div className="flex flex-col gap-0">
            <h2 className="text-base text-1c0e0eb3 font-general font-medium capitalize">{CMS_DATA.title}</h2>
            {showSubtitle && <p className="text-xs text-383838 font-general font-medium capitalize opacity-70">{CMS_DATA.subTitle}</p>}
          </div>

          {games && games.length > 3 && (
            <div className="flex items-center justify-between gap-3">
              <button
                className="flex w-[41px] h-[41px] items-center justify-center p-3 border-2 border-f2f2f2 rounded-full cursor-pointer hover:bg-gray-100"
                onClick={handlePrevClick}
              >
                <img src={SwiperButton} alt="Previous" className="rotate-180" loading='lazy'/>
              </button>
              <button
                className="flex w-[41px] h-[41px] items-center justify-center p-3 border-2 border-f2f2f2 rounded-full cursor-pointer hover:bg-gray-100"
                onClick={handleNextClick}
              >
                <img src={SwiperButton} alt="Next" loading='lazy'/>
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
            {games && games.map((game) => (
              <SwiperSlide key={nanoid()} className="max-w-[352px]">
                <GameCard game={game} disableHover={true}/>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {isMobile && (
          <Button
            onClick={() => navigate('/games')}
            className="underline font-general font-medium text-sm px-10 py-[11px] text-244cb4 text-center mx-auto block mt-5"
          >
            View All
          </Button>
        )}
      </div>
    </>
  );
};

export default ExploreGamesSlider;

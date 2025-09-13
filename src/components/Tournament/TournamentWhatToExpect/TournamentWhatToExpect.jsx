import { nanoid } from "nanoid";
import PropTypes from 'prop-types';
import { useState } from 'react';
import { useMediaQuery } from "react-responsive";
import 'swiper/css';
import { Mousewheel, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from 'swiper/react';

const TournamentWhatToExpect = ({ tournament }) => {
  const isMobile = useMediaQuery({ query: '(max-width: 768px)' });
  const [swiper, setSwiper] = useState(null);

  // Check if the tournament has whatToExpect data and it's not empty
  if (!tournament?.whatToExpect || tournament.whatToExpect.length === 0) {
    return null;
  }

  return (
    <div className="w-full bg-white py-10 pb-8 gap-[18px] flex flex-col mt-[10px]">
      <div className="flex flex-row justify-between items-center px-9 md:px-20 gap-2">
        <h2 className="font-general font-medium text-base text-1c0e0e opacity-70 capitalize">
          What To Expect
        </h2>
        {tournament.instagramHandle && (
          <a 
            href={tournament.instagramHandle} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-244cb4 underline text-sm font-medium font-general"
          >
            Visit Instagram
          </a>
        )}
      </div>

      <div className="flex flex-row justify-between items-center md:gap-[10px] gap-[18px] overflow-x-auto md:pl-[80px] md:pr-[10px] pl-[30px] pr-[6px] [&::-webkit-scrollbar]:hidden">
      {/* <Swiper
  pagination={true}
  modules={[Mousewheel]} // ✅ enable scroll behavior
  className="w-full"
  slidesPerView={1.7}
  spaceBetween={20}
  allowTouchMove={true}
  grabCursor={true}
  touchRatio={1.5}
  simulateTouch={true}
  mousewheel={true}
  onSwiper={(swiper) => setSwiper(swiper)}
  style={{
    paddingLeft: isMobile ? '24px' : '80px',
    '--swiper-pagination-color': '#244CB4',
    '--swiper-pagination-bullet-inactive-color': '#fff',
    '--swiper-pagination-bullet-inactive-opacity': '0.5',
    '--swiper-pagination-bullet-horizontal-gap': '0.19rem',
  }}
  breakpoints={{
    768: {
      spaceBetween: 10.93,
      slidesPerView: 2.5,
    }
  }}
> */}

        {tournament.whatToExpect.map((item) => (
          <div key={nanoid()} className="h-full md:min-w-[40%] min-w-[60%] ">
            <div className="flex flex-col h-full rounded-r-20 border border-244cb4 bg-f4f5ff p-[32px] gap-2">
              <p className="font-author text-size-24 font-medium text-244cb4 max-w-[80%] md:max-w-[70%] leading-6">
                {item.title}
              </p>
              <div className="border border-56b918 md:w-[80%] h-0"></div>
              <p className="font-general font-medium text-xs md:text-sm text-383838 opacity-70">
                {item.description}
              </p>
            </div>
          </div>
        ))}
    </div>
    </div>
  );
};

TournamentWhatToExpect.propTypes = {
  tournament: PropTypes.shape({
    whatToExpect: PropTypes.arrayOf(
      PropTypes.shape({
        title: PropTypes.string,
        description: PropTypes.string,
      })
    ),
    instagramHandle: PropTypes.string
  })
};

export default TournamentWhatToExpect;
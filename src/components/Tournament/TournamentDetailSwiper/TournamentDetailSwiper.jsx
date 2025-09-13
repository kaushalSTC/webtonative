import { nanoid } from "nanoid";
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import { Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

const TournamentDetailSwiper = ({ tournament }) => {
  const registeredPlayers = tournament?.totalBookings || '';
  const isMobile = useMediaQuery({ query: '(max-width: 768px)' });
  const [tournamentImages, setTournamentImages] = useState(isMobile ? tournament.bannerMobileImages : tournament.bannerDesktopImages);
  const [tournamentSwiper, setTournamentSwiper] = useState(null);

  useEffect(() => {
    setTournamentImages(
      isMobile ? tournament.bannerMobileImages : tournament.bannerDesktopImages
    );
  }, [isMobile, tournament.bannerMobileImages, tournament.bannerDesktopImages]);

  return (
    <div className='w-full bg-white relative'>
      <Swiper
        spaceBetween={10}
        slidesPerView={1}
        onSlideChange={() => console.log('slide change')}
        autoHeight={true}
        pagination={true}
        modules={[Pagination]}
        onSwiper={(swiper) => setTournamentSwiper(swiper)}
        style={{
          '--swiper-pagination-color': '#244CB4',
          '--swiper-pagination-bullet-inactive-color': '#fff',
          '--swiper-pagination-bullet-inactive-opacity': '0.5',
          '--swiper-pagination-bullet-horizontal-gap': '0.19rem',
        }}
      >
        {tournamentImages.map((image, index) => (
          <SwiperSlide key={nanoid()}>
            <img src={image} alt="" width="100%" height="auto"/>
          </SwiperSlide>
        ))}
      </Swiper>
      {/* {registeredPlayers > 0 && <p className={`z-[1] font-general font-medium text-xs text-383838 uppercase absolute right-4 bottom-[17.5px] bg-ffffff p-[5px] rounded-full ${registeredPlayers > 30 ? "" : "hidden"}`}>{registeredPlayers} Players Registered</p>} */}
    </div>
  );
};

TournamentDetailSwiper.propTypes = {
  tournament: PropTypes.object,
};

export default TournamentDetailSwiper;

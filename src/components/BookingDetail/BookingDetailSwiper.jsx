import { nanoid } from "nanoid";
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import { Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

export default function BookingDetailSwiper({ booking }) {
  let tournament = booking?.tournament;
  const isMobile = useMediaQuery({ query: '(max-width: 768px)' });
  const [tournamentImages, setTournamentImages] = useState(isMobile ? tournament?.bannerMobileImages : tournament?.bannerDesktopImages);
  const [tournamentSwiper, setTournamentSwiper] = useState(null);

  useEffect(() => {
    setTournamentImages(
      isMobile ? tournament?.bannerMobileImages : tournament?.bannerDesktopImages
    );
  }, [isMobile, tournament?.bannerMobileImages, tournament?.bannerDesktopImages]);

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
        {tournamentImages?.map((image, index) => (
          <SwiperSlide key={nanoid()}>
            <img src={image} alt="" width="100%" height="auto" />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};



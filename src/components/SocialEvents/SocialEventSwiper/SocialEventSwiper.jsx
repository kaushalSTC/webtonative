import { nanoid } from "nanoid";
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import { Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

const SocialEventSwiper = ({ event }) => {
  const isMobile = useMediaQuery({ query: '(max-width: 768px)' });
  const [eventImages, setEventImages] = useState(isMobile ? event.bannerMobileImages : event.bannerDesktopImages);
  const [eventSwiper, setEventSwiper] = useState(null);

  useEffect(() => {
    setEventImages(
      isMobile ? event.bannerMobileImages : event.bannerDesktopImages
    );
  }, [isMobile, event.bannerMobileImages, event.bannerDesktopImages]);

  return (
    <div className='w-full bg-white relative'>
      <Swiper
        spaceBetween={10}
        slidesPerView={1}
        onSlideChange={() => console.log('slide change')}
        autoHeight={true}
        pagination={true}
        modules={[Pagination]}
        onSwiper={(swiper) => setEventSwiper(swiper)}
        style={{
          '--swiper-pagination-color': '#244CB4',
          '--swiper-pagination-bullet-inactive-color': '#fff',
          '--swiper-pagination-bullet-inactive-opacity': '0.5',
          '--swiper-pagination-bullet-horizontal-gap': '0.19rem',
        }}
      >
        {eventImages.map((image, index) => (
          <SwiperSlide key={nanoid()}>
            <img src={image} alt="" width="100%" height="auto"/>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

SocialEventSwiper.propTypes = {
  event: PropTypes.object,
};

export default SocialEventSwiper;
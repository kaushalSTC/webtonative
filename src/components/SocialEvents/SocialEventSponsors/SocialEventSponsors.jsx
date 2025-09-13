import { nanoid } from "nanoid";
import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";

/* eslint-disable react/prop-types */
const SocialEventSponsors = ({ event }) => {
  if (event.sponsors.length <= 0) return null;
  const [swiper, setSwiper] = useState(null);
  const { sponsors } = event;

  return (
    <div className="w-full bg-white px-9 md:px-20 py-10 pb-8 gap-[18px] flex flex-col mt-[10px]">
      <h2 className="font-general font-medium text-base text-1c0e0e opacity-70 capitalize">Sponsors</h2>

      <Swiper
        spaceBetween={20}
        slidesPerView={2.474}
        onSwiper={(swiper) => setSwiper(swiper)}
        className="w-full"
        breakpoints={{
          768: {
            spaceBetween: 24.88,
            slidesPerView: 4.68,
          }
        }}
      >
        {sponsors.map((sponsor) => (
          <SwiperSlide key={nanoid()} className='aspect-square overflow-hidden'>
            <img src={sponsor.sponsorImage} alt={sponsor.sponsorName} className="w-full h-auto object-cover rounded-full "/>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  )
}

export default SocialEventSponsors
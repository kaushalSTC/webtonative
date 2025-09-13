import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import TournamentCard from "../TournamentCard/TournamentCard";
import { nanoid } from 'nanoid';

const TournamentsSwiper = ({ tournaments, ...otherProps }) => {
    return (
        <Swiper {...otherProps}>
            {tournaments?.map((tournament) => (
                <SwiperSlide key={nanoid()}>
                    <TournamentCard tournament={tournament} />
                </SwiperSlide>
            ))}
        </Swiper>
    );
};

export default TournamentsSwiper;

/*
  ┌─────────────────────────────────────────────────────────────────────────┐
  │ Component Usage                                                         │
  └─────────────────────────────────────────────────────────────────────────┘
*/
/*
  ┌─────────────────────────────────────────────────────────────────────────┐
  │ Imports                                                                 │
  └─────────────────────────────────────────────────────────────────────────┘
*/

// import { Navigation } from 'swiper/modules';
// import TournametsSwiper from "../TournametsSwiper/TournametsSwiper";
// import { useRef } from 'react';

/*
  ┌─────────────────────────────────────────────────────────────────────────┐
  │ Click Handlers                                                          │
  └─────────────────────────────────────────────────────────────────────────┘
*/

// const swiperRef = useRef(null);
// const handlePrevClick = () => {
//     if (swiperRef.current) {
//         swiperRef.current.slidePrev();
//     }
// };
// const handleNextClick = () => {
//     if (swiperRef.current) {
//         swiperRef.current.slideNext();
//     }
// };

/*
  ┌─────────────────────────────────────────────────────────────────────────┐
  │ Render                                                                  │
  └─────────────────────────────────────────────────────────────────────────┘
*/

// <TournametsSwiper tournaments={tournaments} onSwiper={(swiper) => { swiperRef.current = swiper; }} modules={[Navigation]} spaceBetween={15} breakpoints={{ 320: { slidesPerView: 1 }, 389: { slidesPerView: 1.2 }, 840: { slidesPerView: 2.3 }, 1100: { slidesPerView: 3.4 } }} />
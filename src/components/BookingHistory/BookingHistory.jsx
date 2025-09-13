import { nanoid } from 'nanoid';
import React, { useEffect, useRef } from 'react';
import { useSelector } from "react-redux";
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Mousewheel, Navigation } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import { BookingHistoryIcon, SwiperButton } from '../../assets';
import BookingHistoryCard from '../BookingHistoryCard/BookingHistoryCard';
import SocialEventBookingHistoryCard from '../BookingHistoryCard/SocialEventBookingHistoryCard';
import { useGetPlayerTournamentsBooking, useGetPlayerEventBookings } from "../../hooks/PlayerHooks";

const BookingHistory = () => {
    const { id: playerID } = useSelector((state) => state.player);
    const {data: tournamentBookings, isLoading: isTournamentLoading, isError: isTournamentError} = useGetPlayerTournamentsBooking(playerID);
    const {data: socialEventBookings, isLoading: isSocialEventLoading, isError: isSocialEventError} = useGetPlayerEventBookings(playerID);
    
    const tournamentSwiperRef = useRef(null);
    const socialEventSwiperRef = useRef(null);

    const handlePrevClick = (swiperRef) => {
        if (swiperRef.current) {
            swiperRef.current.slidePrev();
        }
    };

    const handleNextClick = (swiperRef) => {
        if (swiperRef.current) {
            swiperRef.current.slideNext();
        }
    };

    if (isTournamentLoading || isSocialEventLoading) {
        return (
            <div className="w-full flex items-center justify-center flex-wrap">
                <div className="w-[200px] h-[200px] animate-pulse"></div>
                <div className="w-[200px] h-[200px] animate-pulse"></div>
                <div className="w-[200px] h-[200px] animate-pulse"></div>
            </div>
        );
    }

    if (tournamentBookings?.length === 0 && socialEventBookings?.length === 0) return null;

    const renderBookingSection = (title, bookings, swiperRef, type) => (
        <div className="mb-8">
            <div className='flex items-center justify-between p-5 md:p-7 pt-0 md:pt-0'>
                <div className='flex items-center justify-start gap-2'>
                    <h2 className="font-general font-medium text-sm md:text-base text-1c0e0eb3 pl-3">{title}</h2>
                </div>
                <div className='flex items-center justify-between gap-3'>
                    <button
                        className='flex w-[35px] h-[35px] items-center justify-center p-3 border rounded-full cursor-pointer hover:bg-gray-100'
                        onClick={() => handlePrevClick(swiperRef)}
                    >
                        <img src={SwiperButton} alt="Previous" className='rotate-180'/>
                    </button>
                    <button
                        className='flex w-[35px] h-[35px] items-center justify-center p-3 border rounded-full cursor-pointer hover:bg-gray-100'
                        onClick={() => handleNextClick(swiperRef)}
                    >
                        <img src={SwiperButton} alt="Next"/>
                    </button>
                </div>
            </div>

            <div className="ml-[20px]">
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
                    spaceBetween={15}
                    breakpoints={{
                        320: {
                            slidesPerView: 1.2,
                        },
                        640: {
                            slidesPerView: 1.9,
                        },
                    }}
                >
                    {bookings?.map((booking) => (
                        <SwiperSlide key={nanoid()}>
                            {type === 'tournament' ? (
                                <BookingHistoryCard booking={booking} />
                            ) : (
                                <SocialEventBookingHistoryCard booking={booking} />
                            )}
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </div>
    );

    return (
        <div className="bg-white md:pl-12 pb-7">
            <div className='flex items-center justify-start p-5 md:p-7'>
                <div className='flex items-center justify-start gap-2'>
                    <img src={BookingHistoryIcon} alt="booking-history" className="w-[20px] h-auto object-cover"/>
                    <h2 className="font-general font-medium text-lg md:text-xl text-1c0e0eb3">Booking History</h2>
                </div>
            </div>

            {tournamentBookings?.length > 0 && renderBookingSection(
                "Tournaments",
                tournamentBookings,
                tournamentSwiperRef,
                'tournament'
            )}

            {socialEventBookings?.length > 0 && renderBookingSection(
                "Social Events",
                socialEventBookings,
                socialEventSwiperRef,
                'social'
            )}
        </div>
    );
};

export default BookingHistory;
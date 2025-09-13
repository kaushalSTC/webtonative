import { useEffect, useRef } from 'react';
import { Navigation } from 'swiper/modules';
import { SwiperButton } from "../../assets";
import TournamentsSwiper from "../TournametsSwiper/TournametsSwiper";
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const fetchFeaturedTournaments = async () => {
    const baseURL = import.meta.env.VITE_DEV_URL;
    const response = await axios.get(`${baseURL}/api/public/homepage-sections?section=event`);
    return response.data;
};

const HomepageFeaturedTournaments = () => {
    const { data: featuredTournament, isLoading, isError, error } = useQuery({
        queryKey: ['homepage-featured-tournaments'],
        queryFn: fetchFeaturedTournaments,
    });

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

    useEffect(() => {
        console.log(featuredTournament, 'featuredTournament')
    }, [featuredTournament])

    // ✅ Prevent errors if `featuredTournament` is undefined or events array is empty
    if (!featuredTournament?.data[0]?.events || featuredTournament?.data[0]?.events.length === 0) return null;

    // Extract events from the response structure
    const events = featuredTournament.data[0].events.map(eventItem => eventItem.event);

    return (
        <>
            <style>{`
        .home-tournament .swiper {
            padding-left: 120px;
            padding-right: 0px;
        }
        @media (max-width: 768px) {
            .home-tournament .swiper {
                padding-left: 16px;
                padding-right: 16px;
            }
        }
     `}</style>
            <div className="home-tournament py-15">
                <div className="flex items-center justify-between w-full mb-7 px-9 md:px-[140px]">
                    <h2 className="font-general font-medium text-sm md:text-base text-383838 md:text-1c0e0eb3 opacity-70 md:opacity-100 capitalize">
                        Featured Events
                    </h2>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={handlePrevClick}
                            className="p-2 border rounded-full hover:bg-gray-100"
                        >
                            <img src={SwiperButton} alt="Previous" className="w-4 h-4 rotate-180" />
                        </button>
                        <button
                            onClick={handleNextClick}
                            className="p-2 border rounded-full hover:bg-gray-100"
                        >
                            <img src={SwiperButton} alt="Next" className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                <TournamentsSwiper
                    tournaments={events} // Pass the events array
                    onSwiper={(swiper) => { swiperRef.current = swiper; }}
                    modules={[Navigation]}
                    spaceBetween={15}
                    breakpoints={{
                        320: { slidesPerView: 1 },
                        389: { slidesPerView: 1.2 },
                        840: { slidesPerView: 2.3 },
                        1100: { slidesPerView: 3.4 }
                    }}
                />
            </div>
        </>
    );
};

export default HomepageFeaturedTournaments;
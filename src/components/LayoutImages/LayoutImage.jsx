import { nanoid } from "nanoid";
import { useState } from "react";
import Popup from "../Popup/Popup";
import 'swiper/css';
import 'swiper/css/pagination';
import { Pagination, Navigation, Mousewheel } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import LayoutImageCard from '../LayoutImageCard/LayoutImageCard'

function LayoutImage({ data }) {
    const [isOpen, setIsOpen] = useState(false);
    const [activeIndex, setActiveIndex] = useState(0); // Store clicked index

    const handleViewOpen = (state, index = 0) => {
        setIsOpen(state);
        setActiveIndex(index); // Set clicked index
    };

    // Sort courts by ascending courtNumber
    let courts = data?.data?.layoutImages?.slice()?.sort((a, b) => a.courtNumber - b.courtNumber);

    return (
        <div>
            {courts && courts.length > 0 ? (
                <>
                    <div className='w-full h-[10px] bg-f2f2f2 my-7 md:my-12'></div>
                    <div className='px-[35px] md:px-12'>
                        <p className='font-medium font-general text-base text-1c0e0eb3 mb-2 max-md:text-sm capitalize'>Images of amenities</p>
                        <div className=''>
                            <Swiper
                                pagination={true}
                                modules={[Mousewheel]}
                                className="mySwiper"
                                slidesPerView={2.4}
                                spaceBetween={10}
                                allowTouchMove={true}
                                grabCursor={true}
                                touchRatio={1.5}
                                simulateTouch={true}
                                mousewheel={true}
                                breakpoints={{
                                    768: {
                                        slidesPerView: 3.2,
                                    },
                                }}
                                style={{
                                    '--swiper-pagination-color': '#244CB4',
                                    '--swiper-pagination-bullet-inactive-color': '#fff',
                                    '--swiper-pagination-bullet-inactive-opacity': '0.5',
                                    '--swiper-pagination-bullet-horizontal-gap': '0.19rem',
                                }}
                            >
                                {courts.map((court, index) => (
                                    <SwiperSlide key={nanoid()} onClick={() => handleViewOpen(true, index)} className='cursor-pointer'>
                                        <LayoutImageCard court={court} courtWidthCss={''} />
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                        </div>
                    </div>
                </>
            ) : (
                <div className='hidden'></div>
            )}

            {/* Popup Modal */}
            <Popup isOpen={isOpen} className='bg-[#0000007a] inset-0 z-20 fixed grid place-items-center' handleViewOpen={handleViewOpen}>
                <div className='bg-white w-[90%] md:w-[50%] min-w-[340px] mt-13 p-4 rounded-lg pt-9 pb-9 relative shadow-2xl max-h-[80vh] overflow-auto'>
                    <Swiper
                        modules={[Pagination, Navigation]}
                        navigation={true}
                        className="mySwiper"
                        slidesPerView={1}
                        spaceBetween={10}
                        initialSlide={activeIndex} // Start from clicked index
                        style={{
                            '--swiper-navigation-size': '30px',
                            '--swiper-theme-color': '#383838',
                            '--swiper-pagination-bullet-inactive-opacity': '0.5',
                            '--swiper-pagination-bullet-horizontal-gap': '0.19rem',
                        }}
                    >
                        {courts.map((court) => (
                            <SwiperSlide key={nanoid()}>
                                 <LayoutImageCard court={court} courtWidthCss="w-[100%] md:w-[90%]" />
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            </Popup>
        </div>
    );
}

export default LayoutImage;

import { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import { nanoid } from 'nanoid';
import { useRef } from 'react';
import { SwiperButton } from '../../assets';
import { useGetAboutUs } from '../../hooks/AboutUsHooks';
import Loader from '../Loader/Loader';

const MissionVision = () => {
    const { data, isLoading, error } = useGetAboutUs({ sectionName: 'missionVision' });
    const [sectionData, setSectionData] = useState(null);
    const swiperRef = useRef(null);

    useEffect(() => {
        if (data) {
            setSectionData(data);
        }
    }, [data]);

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

    // Show loading state
    if (isLoading) {
        return (
            <div className='bg-white w-full pt-13 pb-10 px-4 md:px-[50px] flex justify-center items-center'>
                <Loader />
            </div>
        );
    }

    // Show error state
    if (error) {
        return null;
    }

    // If no data or mission vision array is missing, show fallback
    if (!sectionData || !sectionData.missionVision || sectionData.missionVision.length === 0) {
        return null
    }

    return (
        <div className='bg-white w-full pt-13 pb-10 px-4 md:px-[50px]'>
            <div className='flex items-center gap-3 mb-11 px-5 md:px-6 justify-between'>
                <p className='font-author font-medium text-2xl text-383838 capitalize whitespace-nowrap'>{sectionData?.sectionTitle}</p>
                <div className="flex items-center justify-between gap-3">
                    <button
                        className="flex w-[41px] h-[41px] items-center justify-center p-3 border-2 border-f2f2f2 rounded-full cursor-pointer hover:bg-gray-100"
                        onClick={handlePrevClick}
                    >
                        <img src={SwiperButton} alt="Previous" className="rotate-180" />
                    </button>
                    <button
                        className="flex w-[41px] h-[41px] items-center justify-center p-3 border-2 border-f2f2f2 rounded-full cursor-pointer hover:bg-gray-100"
                        onClick={handleNextClick}
                    >
                        <img src={SwiperButton} alt="Next" />
                    </button>
                </div>
            </div>
            <Swiper
                onSwiper={(swiper) => {
                    swiperRef.current = swiper;
                }}
                modules={[Navigation]}
                breakpoints={{
                    320: {
                        slidesPerView: 2.4,
                        spaceBetween: 30,
                    },
                    768: {
                        slidesPerView: 3.5,
                        spaceBetween: 20,
                    },
                }}
            >
                {sectionData?.missionVision.map((slide, index) => (
                    <SwiperSlide key={nanoid()} className="">
                        <div className='flex items-start gap-2'>
                            {slide?.image && slide?.image.trim() !== "" ? (
                                <div className='w-[33px] h-[35px] flex-none mr-2'>
                                    <img src={slide.image} alt="how-it-works" className='w-full h-auto object-cover' />
                                </div>
                            ) : (
                                <p className='font-author font-medium text-[34px] text-383838 opacity-20 leading-none mr-2'>
                                    {slide?.position || index + 1} {/* Fallback in case position is also missing */}
                                </p>
                            )}

                            <div className="relative before:absolute before:h-[90%] before:w-px before:bg-f2f2f2 before:left-[-8px] before:content-['']">
                                <p className='font-general font-semibold text-383838 text-sm mb-2 line-clamp-2'>{slide?.heading}</p>
                                <p className='font-general font-medium text-383838 opacity-70 text-sm line-clamp-4'>{slide?.subHeading}</p>
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
};

export default MissionVision;
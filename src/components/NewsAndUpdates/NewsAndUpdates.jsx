import React, { useState, useEffect } from "react";
import { SwiperButton } from "../../assets";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Navigation } from "swiper/modules";
import "swiper/css/navigation";
import { useRef } from "react";
import { nanoid } from "nanoid";
import { useMediaQuery } from "react-responsive";
import axios from "axios";
import { Link } from "react-router";

const NewsAndUpdates = () => {
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
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


  const baseURL = import.meta.env.VITE_DEV_URL; // Access environment variable

  const [newsAndUpdatesObj, setNewsAndUpdatesObj] = useState({});

  const getWhyChoosePickleBayDetails = async () => {
    try {
      const response = await axios.get(
        `${baseURL}/api/public/homepage-sections?section=news`
      );
      setNewsAndUpdatesObj({
        sectionTitle: response?.data?.data[0]?.sectionTitle,
        news: response?.data?.data[0]?.news,
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getWhyChoosePickleBayDetails();
  }, []);
  if (!newsAndUpdatesObj || newsAndUpdatesObj.length === 0 || !newsAndUpdatesObj.news) return null;
  return (
    <>
      <style>
        {`
                .news-and-updates .swiper {
                    padding-left: 140px;
                }
                @media (max-width: 768px) {
                    .news-and-updates .swiper {
                        padding-left: 18px;
                    }
                }
            `}
      </style>
      <div className="news-and-updates mb-20">
        <div className="flex items-center justify-between px-[37px] md:px-[140px] mb-5">
          <p className="text-base text-1c0e0eb3 font-general font-medium capitalize">
            {newsAndUpdatesObj?.sectionTitle}
          </p>
          {!isMobile && (
            <div className="flex items-center justify-between gap-3">
              <button
                className="flex w-[35px] h-[35px] items-center justify-center p-3 border rounded-full cursor-pointer hover:bg-gray-100"
                onClick={handlePrevClick}
              >
                <img src={SwiperButton} alt="Previous" className="rotate-180" loading='lazy' />
              </button>
              <button
                className="flex w-[35px] h-[35px] items-center justify-center p-3 border rounded-full cursor-pointer hover:bg-gray-100"
                onClick={handleNextClick}
              >
                <img src={SwiperButton} alt="Next" loading='lazy' />
              </button>
            </div>
          )}
        </div>
        {isMobile ? (
          // For Mobile: Render as simple cards
          <div className="flex flex-wrap gap-4 px-[18px]">
            {newsAndUpdatesObj?.news?.map((news) => (
              <div key={nanoid()} className="w-full">
                <Link to={`${news.link}`} target="_blank" className="cursor-pointer">
                  <div className="w-full flex items-center gap-1.5">
                    <div className="overflow-hidden rounded-[10px] aspect-112/77 flex-none w-[32%]">
                      <img
                        src={news?.image}
                        alt="news"
                        className="w-full h-auto object-cover object-center rounded-[10px]"
                        loading='lazy'
                      />
                    </div>
                    <div className="flex flex-col-reverse items-start">
                      <p className="font-general font-medium text-xs md:text-sm text-244cb4 capitalize line-clamp-1">
                        {news.title}
                      </p>
                      <p className="font-general font-medium text-[10px] md:text-sm text-383838 opacity-70 capitalize">
                        {news.date}
                      </p>
                      <p className="font-medium font-general text-xs md:text-sm opacity-100 md:opacity-70 text-383838 capitalize line-clamp-2">
                        {news.description}
                      </p>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        ) : (
          // For larger screens: Render the Swiper component
          <div>
            <Swiper
              onSwiper={(swiper) => {
                swiperRef.current = swiper;
              }}
              modules={[Navigation]}
              spaceBetween={15}
              breakpoints={{
                320: {
                  slidesPerView: 1,
                },
                389: {
                  slidesPerView: 1.2,
                },
                768: {
                  slidesPerView: 3.3,
                },
                1100: {
                  slidesPerView: 4.5,
                },
              }}
            >
              {newsAndUpdatesObj?.news?.map((news) => (
                <SwiperSlide key={nanoid()}>
                  <Link to={`${news.link}`} target="_blank" className="cursor-pointer">
                    <div className="aspect-260/179 w-full overflow-hidden rounded-r-20 cursor-pointer">
                      <img
                        src={news?.image}
                        alt="news"
                        className="w-full h-auto object-cover object-center"
                        loading='lazy'
                      />
                    </div>
                    <div>
                      <p className="font-general font-medium text-xs md:text-sm text-244cb4 capitalize line-clamp-1">
                        {news.title}
                      </p>
                      <p className="font-general font-medium text-[10px] md:text-sm text-383838 opacity-70 capitalize ">
                        {news.date}
                      </p>
                      <p className="font-medium font-general text-xs md:text-sm opacity-100 md:opacity-70 text-383838 capitalize line-clamp-2">
                        {news.description}
                      </p>
                    </div>
                  </Link>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        )}
      </div>
    </>
  );
};

export default NewsAndUpdates;

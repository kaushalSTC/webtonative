import React, { useState, useEffect } from "react";
import { WhyChoosePicklebayImg } from "../../assets";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Mousewheel, A11y } from "swiper/modules";
import { nanoid } from "nanoid";
import axios from "axios";

const ChoosePicklebay = () => {
  const baseURL = import.meta.env.VITE_DEV_URL;
  const [choosePicklebayObj, setChoosePicklebayObj] = useState({});

  const getWhyChoosePickleBayDetails = async () => {
    try {
      const response = await axios.get(
        `${baseURL}/api/public/homepage-sections?section=whyChoosePicklebay`
      );
      setChoosePicklebayObj({
        sectionTitle: response?.data?.data[0]?.sectionTitle,
        steps: response?.data?.data[0]?.steps,
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getWhyChoosePickleBayDetails();
  }, []);

  if (!choosePicklebayObj || choosePicklebayObj.length === 0 || !choosePicklebayObj.steps) return null;
  return (
    <>
      <style>
        {`
        .main .swiper-slide:after {
          content: '';
          position: absolute;
          top: 33%;
          width: 100%;
          display: block;
          left: 50%;
          z-index: -1;
          border-radius: 5px;
          height: 2px;
          background: repeating-linear-gradient(to right, #56b918 0, #56b918 4px, transparent 4px, transparent 8px);
        }
        .main .swiper-slide:last-child::after {
          display: none;
        }
        .main .swiper {
          padding-left: 150px;
        }
        @media (max-width: 768px) {
          .main .swiper {
            padding-left: 35px;
          }
        }
        `}
      </style>

      <div 
        className="main relative mb-20" 
        style={{
          background: "linear-gradient(180deg, rgba(255, 255, 255, 0.8) 0%, #DBE0FC 56%, rgba(255, 255, 255, 0.8) 91%)",
        }}
      >
        <h2 className="font-author font-medium text-[34px] md:text-[44px] text-383838 text-left md:text-center pl-[35px] md:pl-0 leading-none my-6">
          {choosePicklebayObj?.sectionTitle}
        </h2>
        <div>
          <Swiper
            modules={[A11y, Mousewheel]}
            className="mySwiper choose-picklebay"
            slidesPerView={1.2}
            spaceBetween={20}
            allowTouchMove={true}
            grabCursor={true}
            // mousewheel={true}
            pagination={{
              clickable: true,
            }}
            breakpoints={{
              380: {
                slidesPerView: 1.5,
              },
              640: {
                slidesPerView: 1.9,
              },
              768: {
                slidesPerView: 3,
              },
              1100: {
                slidesPerView: 4.5,
              },
            }}
          >
            {choosePicklebayObj.steps?.map((step, index) => (
              <SwiperSlide key={nanoid()} className="z-10 pr-[30px]">
                <div>
                  <div className="aspect-square w-full h-full relative overflow-hidden">
                    <img
                      src={step.image}
                      alt="Venue Image"
                      className="w-full h-auto object-cover"
                      loading='lazy'
                    />
                  </div>
                  <div>
                    <p className="font-author font-medium text-383838 text-[34px] md:text-[44px] opacity-20">
                      {index + 1}
                    </p>
                    <p className="font-author font-medium text-383838 text-2xl w-[70%] leading-none">
                      {step.heading}
                    </p>
                    <p className="font-general font-medium text-383838 opacity-70 text-xs md:text-sm">
                      {step.subHeading}
                    </p>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </>
  );
};

export default ChoosePicklebay;
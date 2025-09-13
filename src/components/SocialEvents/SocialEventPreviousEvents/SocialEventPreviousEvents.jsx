import { nanoid } from "nanoid";
import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";

/* eslint-disable react/prop-types */
const SocialEventPreviousEvents = ({ event }) => {
  const [playingIndex, setPlayingIndex] = useState(null);

  if (!event.previousEventVideos || event.previousEventVideos.length === 0) return null;

  const { previousEventVideos } = event;

  return (
    <div className="w-full bg-f4f5ff px-9 md:px-20 py-12 pb-8 gap-[18px] flex flex-col">
      <h2 className="font-general font-medium text-base text-1c0e0e opacity-70 capitalize">
        Previous Events
      </h2>
      <Swiper
        spaceBetween={20}
        slidesPerView={1.2}
        className="w-full"
        breakpoints={{
          768: {
            spaceBetween: 24,
            slidesPerView: 2.5,
          },
        }}
      >
        {previousEventVideos.map((videoData, index) => (
          <SwiperSlide key={nanoid()} className="relative">
            <div className="relative aspect-[9/16] overflow-hidden rounded-2xl flex items-center justify-center bg-black">
              {playingIndex === index ? (
                <video
                  src={videoData.video}
                  poster={videoData.thumbnailImage || ""}
                  className="w-full h-full object-contain bg-black"
                  controls
                  autoPlay
                  preload="auto"
                />
              ) : (
                <div
                  className="relative w-full h-full cursor-pointer"
                  onClick={() => setPlayingIndex(index)}
                >
                  <video
                    className="w-full h-full object-cover"
                    poster={videoData.thumbnailImage || ""}
                    muted
                    preload="metadata"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 bg-white bg-opacity-90 rounded-full flex items-center justify-center hover:bg-opacity-100 transition-all">
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        className="ml-1"
                      >
                        <path d="M8 5V19L19 12L8 5Z" fill="#383838" />
                      </svg>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default SocialEventPreviousEvents;

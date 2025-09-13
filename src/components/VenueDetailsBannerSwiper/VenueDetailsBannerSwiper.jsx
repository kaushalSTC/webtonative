import { nanoid } from 'nanoid';
import React, { useState, useEffect } from 'react';
import 'swiper/css';
import 'swiper/css/pagination';
import { Mousewheel, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import { VenueImage } from '../../assets';

const ZoomInIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z M10.5 7.5v6m3-3h-6" />
  </svg>
);

function VenueDetailsBannerSwiper({ data }) {
  const bannerImages = data?.data?.bannerImages;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const openModal = (index) => {
    setCurrentImageIndex(index);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const goToPrevious = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex > 0 ? prevIndex - 1 : bannerImages.length - 1
    );
  };

  const goToNext = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex < bannerImages.length - 1 ? prevIndex + 1 : 0
    );
  };

  useEffect(() => {
    if (isModalOpen) {
      // Add class to prevent scrolling
      document.body.classList.add('overflow-hidden');
    } else {
      // Remove class to allow scrolling
      document.body.classList.remove('overflow-hidden');
    }

    // Cleanup function to ensure the class is removed when the component unmounts
    return () => {
      document.body.classList.remove('overflow-hidden');
    };
  }, [isModalOpen]); // Dependency array ensures this runs only when isModalOpen changes


  if (!bannerImages || bannerImages.length === 0) {
    return (
      <div className="p-2.5 md:p-5">
        <img
          src={VenueImage}
          alt="Default Venue"
          className="w-full h-auto object-cover max-h-[450px] rounded-2xl" // Added rounded-2xl for consistency
        />
      </div>
    );
  }

  return (
    <div className="p-2.5 md:p-5">
      <Swiper
        pagination={true}
        modules={[Pagination, Mousewheel]}
        className="mySwiper"
        slidesPerView={1}
        spaceBetween={10}
        allowTouchMove={true}
        grabCursor={true}
        touchRatio={1}
        simulateTouch={true}
        mousewheel={{
          forceToAxis: true,
          releaseOnEdges: true,
          invert: false,
          sensitivity: 1,
          thresholdDelta: 100,
        }}
        style={{
          '--swiper-pagination-color': '#244CB4',
          '--swiper-pagination-bullet-inactive-color': '#fff',
          '--swiper-pagination-bullet-inactive-opacity': '0.5',
          '--swiper-pagination-bullet-horizontal-gap': '0.19rem',
        }}
      >
        {bannerImages.map((media, index) => {
          const isVideo = media.type == "video";

          return (
            <SwiperSlide key={nanoid()} className="relative">
              {isVideo ? (
                <video
                  controls
                  src={media.url}
                  className="w-full h-auto object-cover max-h-[450px] rounded-2xl"
                  loop
                  muted
                />
              ) : (
                <img
                  src={media.url}
                  alt={`Venue Image ${index + 1}`}
                  className="w-full h-auto object-cover max-h-[450px] rounded-2xl"
                />
              )}
              <button
                onClick={() => openModal(index)}
                className="absolute top-2 right-2 bg-black bg-opacity-50 text-white p-1.5 rounded-full hover:bg-opacity-75 transition-opacity z-10"
                aria-label="Zoom In"
              >
                <ZoomInIcon />
              </button>
            </SwiperSlide>
          );
        })}
      </Swiper>

         
      {isModalOpen && bannerImages.length > 0 && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50 p-0 md:p-4"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.9)' }}
          onClick={closeModal}
        >
          <div
            className="relative bg-transparent w-full h-full md:w-auto md:h-auto md:max-w-4xl md:max-h-[90vh] flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative w-full h-full flex items-center justify-center">
              <div className="relative max-w-full max-h-full px-[15px]">
                {bannerImages[currentImageIndex].type === 'video' ? (
                  <video
                    controls
                    src={bannerImages[currentImageIndex].url}
                    autoPlay
                    className="w-full h-full object-contain md:max-w-full md:max-h-[80vh] rounded-none md:rounded-lg"
                    loop
                  />
                ) : (
                  <img
                    src={bannerImages[currentImageIndex].url}
                    alt={`Venue Image ${currentImageIndex + 1} zoomed`}
                    className="w-full h-full object-contain md:max-w-full md:max-h-[80vh] rounded-none md:rounded-lg"
                  />
                )}
                
                <button
                  onClick={closeModal}
                  className="absolute top-[-24px] right-2 bg-white text-black rounded-full p-1 z-20"
                  aria-label="Close modal"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                  </svg>
                </button>
                
                {bannerImages.length > 1 && (
                  <div className="absolute bottom-[-55px] right-[18px] flex gap-2 md:hidden">
                    <button
                      onClick={goToPrevious}
                      className="bg-white bg-opacity-70 text-black rounded-full p-2 hover:bg-opacity-90 z-10"
                      aria-label="Previous image"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                      </svg>
                    </button>

                    <button
                      onClick={goToNext}
                      className="bg-white bg-opacity-70 text-black rounded-full p-2 hover:bg-opacity-90 z-10"
                      aria-label="Next image"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>
            </div>

            {bannerImages.length > 1 && (
              <>
                <button
                  onClick={goToPrevious}
                  className="hidden md:block absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-70 text-black rounded-full p-2 hover:bg-opacity-90 z-10"
                  aria-label="Previous image"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                  </svg>
                </button>

                <button
                  onClick={goToNext}
                  className="hidden md:block absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-70 text-black rounded-full p-2 hover:bg-opacity-90 z-10"
                  aria-label="Next image"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                  </svg>
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default VenueDetailsBannerSwiper;
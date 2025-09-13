
import { useState } from 'react';
import { nanoid } from "nanoid";
import Popup from "../../Popup/Popup";
import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation, Mousewheel } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

const TournamentGallery = ({ tournament }) => {
  const tournamentGalleryData = tournament.tournamentGallery || [];
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  if (tournamentGalleryData.length <= 0) return null;

  const handleViewOpen = (state, index = 0) => {
    setIsOpen(state);
    setActiveIndex(index);
  };

  return (
    <>
      <div className="w-full bg-white py-10 pb-8 gap-[18px] flex flex-col mt-[10px]">
        <h2 className="font-general px-9 md:px-20 font-medium text-base text-1c0e0e opacity-70 capitalize">Gallery</h2>
        <div className="flex flex-row justify-between items-center md:gap-[10px] gap-[18px] overflow-x-auto md:pl-[80px] md:pr-[10px] pl-[30px] pr-[6px] [&::-webkit-scrollbar]:hidden">
          {tournamentGalleryData.map((image, index) => (
            <div 
              key={nanoid()} 
              className="md:min-w-[40%] min-w-[60%] overflow-hidden cursor-pointer"
              onClick={() => handleViewOpen(true, index)}
            >
              <img
                src={image}
                alt="Tournament Gallery"
                width="100%"
                height="auto"
                className="w-full h-auto object-cover max-h-[450px] rounded-2xl"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Popup Modal */}
      <Popup isOpen={isOpen} className='bg-[#0000007a] inset-0 z-50 fixed grid place-items-center' handleViewOpen={handleViewOpen}>
        <div className='bg-white w-[90%] md:w-[50%] min-w-[340px] mt-13 p-4 rounded-lg relative shadow-2xl max-h-[80vh] overflow-auto'>
          <Swiper
            modules={[Navigation, Mousewheel]}
            navigation={true}
            className="mySwiper"
            slidesPerView={1}
            spaceBetween={10}
            initialSlide={activeIndex}
            style={{
              '--swiper-navigation-size': '30px',
              '--swiper-theme-color': '#383838'
            }}
          >
            {tournamentGalleryData.map((image) => (
              <SwiperSlide key={nanoid()}>
                <img
                  src={image}
                  alt="Tournament Gallery"
                  className="w-full h-auto object-contain max-h-[60vh] rounded-lg"
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </Popup>
    </>
  );
};

export default TournamentGallery;
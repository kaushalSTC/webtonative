import { nanoid } from 'nanoid';
import { useRef, useState, useEffect } from 'react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Navigation } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import { LogoLightMode, SwiperButton, TournamentCardImg } from '../../assets';
import JournalCard from '../JournalCard/JournalCard';
import axios from 'axios';

const PicklebayJournal = () => {
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

  const [journalObj, setjournalObj] = useState({});

  const getjournalDetails = async () => {
    try {
      const response = await axios.get(
        `${baseURL}/api/public/homepage-sections?section=journal`
      );
      setjournalObj({
        journals: response?.data?.data[0]?.journals,
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getjournalDetails();
  }, []);

if (
  !journalObj ||
  !Array.isArray(journalObj.journals) ||
  journalObj.journals.length === 0 ||
  !journalObj.journals.some(journal => journal.blogID?.isVisible)
) {
  return null;
}


  return (
    <>
      <style>{`
        .journal-listing .swiper {
            padding-left: 120px;
            padding-right: 0px;
            padding-bottom: 20px;
        }
        @media (max-width: 768px) {
            .journal-listing .swiper {
                padding-left: 16px;
                padding-right: 16px;
            }
        }
     `}</style>
      <div className="py-10 journal-listing mb-10" style={{
      background: "linear-gradient(180deg, rgba(255, 255, 255, 0.8) 0%, #DBE0FC 56%, rgba(255, 255, 255, 0.8) 91%)",
    }}>
       <div className='flex items-center justify-between px-[30px] mb-5 md:px-[215px]'>
          <img src={LogoLightMode} alt="logo-light-mode" className="w-[191px] h-auto object-cover" loading='lazy'/>
          <div className="flex items-center justify-between gap-3">
            <button
              className="flex w-[35px] h-[35px] items-center justify-center p-3 border rounded-full cursor-pointer hover:bg-gray-100"
              onClick={handlePrevClick}
            >
              <img src={SwiperButton} alt="Previous" className="rotate-180" loading='lazy'/>
            </button>
            <button
              className="flex w-[35px] h-[35px] items-center justify-center p-3 border rounded-full cursor-pointer hover:bg-gray-100"
              onClick={handleNextClick}
            >
              <img src={SwiperButton} alt="Next" loading='lazy'/>
            </button>
          </div>
        </div>

        <div className="">
          <div className="">
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
                840: {
                  slidesPerView: 2.3,
                },
                1100: {
                  slidesPerView: 3.4,
                },
              }}
            >
              {journalObj?.journals?.map((journal) => (
                <SwiperSlide key={nanoid()}>
                  <JournalCard data={journal} />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </div>
    </>
  );
};

export default PicklebayJournal;

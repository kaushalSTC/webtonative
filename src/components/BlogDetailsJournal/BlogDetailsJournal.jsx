import { nanoid } from 'nanoid';
import { useRef, useState, useEffect } from 'react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Navigation } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import { SwiperButton } from '../../assets';
import JournalCard from '../JournalCard/JournalCard';
import axios from 'axios';

const BlogDetailsJournal = () => {
  const swiperRef = useRef(null);
  const [journals, setJournals] = useState([]);

  const baseURL = import.meta.env.VITE_DEV_URL;

  const handlePrevClick = () => {
    swiperRef.current?.slidePrev();
  };

  const handleNextClick = () => {
    swiperRef.current?.slideNext();
  };

  const getJournalDetails = async () => {
    try {
      const response = await axios.get(
        `${baseURL}/api/public/homepage-sections?section=journal`
      );
      setJournals(response?.data?.data[0]?.journals || []);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getJournalDetails();
  }, []);

  if (!journals.length) return null;

  return (
    <div className="py-10 journal-listing">
      <div className="flex items-center justify-between md:py-[35px] py-[25px]">
        <p className="font-general font-medium text-sm md:text-base text-gray-500">
          More From This Author
        </p>
        <div className="flex items-center justify-between gap-3">
          <button
            className="flex w-[35px] h-[35px] items-center justify-center p-3 border rounded-full cursor-pointer hover:bg-gray-100"
            onClick={handlePrevClick}
          >
            <img src={SwiperButton} alt="Previous" className="rotate-180" />
          </button>
          <button
            className="flex w-[35px] h-[35px] items-center justify-center p-3 border rounded-full cursor-pointer hover:bg-gray-100"
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
        spaceBetween={15}
        breakpoints={{
          320: {
            slidesPerView: 1.2,
          },
          640: {
            slidesPerView: 2.2,
          },
        }}
      >
        {journals.map((journal) => (
          <SwiperSlide key={nanoid()}>
            <JournalCard data={journal} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default BlogDetailsJournal;

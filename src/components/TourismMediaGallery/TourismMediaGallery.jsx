
import { MediaGalleryImage } from '../../assets'
import 'swiper/css';
import { Swiper, SwiperSlide } from 'swiper/react';
import { useTourismSection } from '../../hooks/TourismHooks';
import { Mousewheel, Navigation, FreeMode } from 'swiper/modules';
import 'swiper/css/mousewheel';
import 'swiper/css/navigation';
import 'swiper/css/free-mode';

const TourismMediaGallery = () => {
  const { data, isLoading, error } = useTourismSection({ sectionName: 'mediaGallery' });

  if (isLoading) {
    return (
      <div className='bg-white w-full pt-13 pb-10 px-4 md:px-[50px] flex justify-center items-center'>
        <div className='animate-pulse w-full h-[250px] md:h-[400px] bg-f2f2f2 rounded-[20px]'></div> 
      </div>
    );
  }

  if (error || !data || data.mediaGallery.length === 0) {
    return null;
  }

  return (
    <>
      <style>
        {`
         .swiper.tourism-gallery-swiper {
            padding-left: 120px;
            padding-right: 0px;
            padding-bottom: 20px;
        }
        @media (max-width: 768px) {
            .swiper.tourism-gallery-swiper {
                padding-left: 16px;
                padding-right: 16px;
            }
        }
        .swiper.tourism-gallery-swiper .swiper-wrapper {
            cursor: grab;
        }
        .swiper.tourism-gallery-swiper .swiper-wrapper:active {
            cursor: grabbing;
        }
     `}
      </style>
      <div className='bg-white w-full py-7'>
        <p className='font-general font-medium text-sm md:text-base text-1c0e0eb3 md:text-383838 pl-9 md:pl-[159px] mb-4'>{data?.sectionTitle}</p>
        <div>
          <Swiper 
            className='tourism-gallery-swiper' 
            spaceBetween={15} 
            modules={[Mousewheel, Navigation, FreeMode]}
            mousewheel={{
              sensitivity: 1,
              forceToAxis: true
            }}
            freeMode={{
              enabled: true,
              sticky: true,
              momentumRatio: 0.25,
              momentumBounce: true,
              momentumBounceRatio: 1
            }}
            slidesOffsetBefore={0}
            slidesOffsetAfter={0}
            allowTouchMove={true}
            resistance={true}
            resistanceRatio={0}
            touchRatio={1}
            touchAngle={45}
            breakpoints={{
              320: { slidesPerView: 1.1 },
              389: { slidesPerView: 1.1 },
              840: { slidesPerView: 2.3 },
              1100: { slidesPerView: 3.4 }
            }}
          >
            {data?.mediaGallery.map((mediaGallery) => (
              <SwiperSlide key={mediaGallery?.position}>
                <div className='relative'>
                  <img src={mediaGallery?.image || MediaGalleryImage} alt="Media Gallery" className='w-full h-auto object-cover' loading='lazy' />
                  <p className='absolute bottom-5 left-4 font-general font-medium text-[10px] md:text-xs text-f2f2f2 md:text-white bg-383838cc py-1 px-2 mt-2 rounded-[10px] capitalize'>{mediaGallery?.description}</p>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </>
  )
}

export default TourismMediaGallery
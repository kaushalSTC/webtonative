import { useNavigate } from 'react-router'
import 'swiper/css';
import { Swiper, SwiperSlide } from 'swiper/react';
import { useTourismSection } from '../../hooks/TourismHooks';
import { Mousewheel, Navigation, FreeMode } from 'swiper/modules';
import 'swiper/css/mousewheel';
import 'swiper/css/navigation';
import 'swiper/css/free-mode';

const TourismPackage = ({scrollToForm}) => {
  const {data, isLoading, error } = useTourismSection({ sectionName: 'packages' });
  const navigate = useNavigate();

  const handleLinkClick = (link) => {
    const isTourismPageLink = link === '/pages/tourism';
    if(isTourismPageLink) {
      scrollToForm();
    } else {
      navigate(link);
    }  
  }

  if(isLoading) {
    return (
      <div className='bg-white w-full pt-13 pb-10 px-4 md:px-[50px] flex justify-center items-center'>
        <div className='animate-pulse w-full h-[400px] bg-f2f2f2 rounded-[20px]'></div>
      </div>
    );
  }

  if (error) {
    return null;
  }

  if (!data) {
    return null
  }
  return (
    <>
      <style>
        {`
         .swiper.tourism-package {
            padding-left: 120px;
            padding-right: 0px;
            padding-bottom: 20px;
          }
          @media (max-width: 768px) {
            .swiper.tourism-package {
                padding-left: 16px;
                padding-right: 16px;
            }
          }
          .swiper.tourism-package .swiper-wrapper {
            cursor: grab;
          }
          .swiper.tourism-package .swiper-wrapper:active {
            cursor: grabbing;
          }
        `}
      </style>

      <div className='pt-5 bg-white'>
        {data?.packages.map((packageData) => (
          <div className={`w-full ${packageData?.position % 2 === 0 ? "bg-f2f2f2" : "bg-white"} py-5`}>
            <p className='font-author font-medium text-383838 text-2xl pl-9 md:pl-[159px] mb-2'>{packageData?.locationName}</p>
            <div>
              <Swiper className='tourism-package' spaceBetween={15} modules={[Mousewheel, Navigation, FreeMode]}
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
                {packageData?.packageImages.map((packageImage) => (
                  <SwiperSlide>
                    <img src={packageImage} alt="Package Image" className='w-full h-auto object-cover' loading='lazy' />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
            <p className='font-general font-medium text-xs md:text-sm text-383838 pl-9 md:pl-[140px]'>{packageData?.description}</p>
            <p to={packageData?.link} className='font-general font-medium text-xs md:text-sm text-244cb4 capitalize underline pl-9 md:pl-[140px] cursor-pointer' onClick={() => handleLinkClick(packageData?.link)}>{packageData?.linkText}</p>
          </div>
        ))}
      </div>
    </>
  )
}

export default TourismPackage
import { TourismDesktopBanner, TourismMobileBanner } from '../../assets'
import { useTourismSection } from '../../hooks/TourismHooks';

const TourismTopBanner = () => {
  const {data, isLoading, error } = useTourismSection({ sectionName: 'topTourismSection' });

  if (isLoading) {
    return (
      <div className='bg-white w-full pt-13 pb-10 px-4 md:px-[50px] flex justify-center items-center'>
        <div className='animate-pulse w-full h-[250px] md:h-[400px] bg-f2f2f2 rounded-[20px]'></div> 
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
    <div className='relative'>
      <div>
        <img src={data?.DesktopBannerImage || TourismDesktopBanner} alt="Desktop Banner" className='hidden md:block w-full h-auto object-cover' />
        <img src={data?.MobileBannerImage || TourismMobileBanner} alt="Mobile Banner" className='block md:hidden w-full h-auto object-cover' />
      </div>
      <div className='absolute left-[36px] bottom-[36px] md:left-[130px] md:bottom-[100px] max-w-[250px] md:max-w-[434px]'>
        <p className='font-author font-medium text-[34px] text-white capitalize w-full leading-none'>{data?.heading}</p>
        <div className='w-full h-[2px] bg-abe400 mb-2'></div>
        <p className='font-general font-medium text-xs md:text-sm text-fcfdff md:text-f2f2f2 w-full'>{data?.subHeading}</p>
      </div>
    </div>
  )
}

export default TourismTopBanner
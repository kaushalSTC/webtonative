import { TourismDesktopInstaBanner, TourismMobileInstaBanner } from '../../assets'
import { NavLink } from 'react-router'
import { useTourismSection } from '../../hooks/TourismHooks';

const TourismInsta = () => {
  const { data, isLoading, error } = useTourismSection({ sectionName: 'keepUpInstagram' });

  if (isLoading) {
    return ( 
      <div className='w-full h-[400px] bg-f2f2f2 flex items-center justify-center '>
        <div className='h-full w-[720px] bg-white px-4 py-6 md:p-[50px]'>
          <div className='rounded animate-pulse w-full h-full bg-gray-200'></div>
        </div>
      </div>  
    )
  }

  if(error || !data || !data.DesktopBannerImage) {
    return null;
  }

  return (
    <div className='bg-white w-full'>
      <div className='max-w-[720px] mx-auto bg-f4f5ff md:bg-white'>
        <p className='font-general font-medium text-sm md:text-base text-1c0e0eb3 md:text-383838 pl-6 pt-6 md:pl-9 mb-2 md:mb-0 md:p-6'>{data?.sectionTitle}</p>
        <div>
          <NavLink to={data?.link}>
            <img src={data?.DesktopBannerImage || TourismDesktopInstaBanner} alt="Desktop Banner" className='hidden md:block w-full h-auto object-cover' loading='lazy' />
            <img src={data?.MobileBannerImage || TourismMobileInstaBanner} alt="Mobile Banner" className='block md:hidden w-full h-auto object-cover' loading='lazy' />
          </NavLink>
        </div>
      </div>
    </div>
  )
}

export default TourismInsta
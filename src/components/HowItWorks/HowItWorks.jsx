import { useEffect, useState } from 'react';
import { useGetAboutUs } from '../../hooks/AboutUsHooks'
import Loader from '../Loader/Loader';
import { AboutHowItWork, DottedLine } from '../../assets';
import { nanoid } from 'nanoid';

const HowItWorks = () => {
  const { data, isLoading, error } = useGetAboutUs({ sectionName: 'howItWorks' });
  const [sectionData, setSectionData] = useState(null);

  useEffect(() => {
    if (data) {
      setSectionData(data);
    }
  }, [data]);

  if (isLoading) {
    return (
      <div className='bg-white w-full pt-13 pb-10 px-4 md:px-[50px] flex justify-center items-center'>
        <Loader />
      </div>
    );
  }

  if (error) {
    return null;
  }

  if (!sectionData || !sectionData.isVisible) {
    return null
  }
  return (
    <div className='px-5 md:px-[74px] py-[65px] bg-white'>
      <div className='mb-10 px-[15px] md:px-0 relative'>
        <img src={DottedLine} alt="dotted-line" className='w-full' />
        <p className='font-general font-medium text-sm md:text-base text-1c0e0eb3 bg-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 px-3'>How it works</p>
      </div>

      <div>
        {sectionData?.howItWorks.map((slide) => {
          return (
            <div className={`flex items-center gap-5 justify-center mb-10 ${slide.position % 2 === 0 ? 'flex-row-reverse' : 'flex-row'}`} key={nanoid()}>
              <div className='aspect-square max-w-[126px]'>
                <img src={slide?.image || AboutHowItWork} alt="how-it-works" className='w-full h-auto object-cover' />
              </div>
              <div className='max-w-[200px]'>
                {slide?.svg ? (
                  <div className='max-w-[35px]'>
                    <img src={slide?.svg} alt="how-it-works" className='w-full h-auto object-cover' />
                  </div>
                ) : (
                  <p className='font-author font-medium text-[34px] text-383838 opacity-20 leading-none'>{slide?.position}</p>
                )}
                <p className='font-author font-medium text-2xl text-383838 leading-none mb-2'>{slide?.heading}</p>
                <p className='font-general font-medium text-[12px] text-383838 opacity-70 leading-none'>{slide?.subHeading}</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default HowItWorks
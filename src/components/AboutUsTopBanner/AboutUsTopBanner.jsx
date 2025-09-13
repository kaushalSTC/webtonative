import React, { useEffect, useState } from 'react'
import { useGetAboutUs } from '../../hooks/AboutUsHooks';
import Loader from '../Loader/Loader';
import { NavLink } from 'react-router';
import { AboutTopBannerImg } from '../../assets';

const AboutUsTopBanner = () => {
  const { data, isLoading, error } = useGetAboutUs({ sectionName: 'topAboutUsSection' });
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

  if (!sectionData) {
    return null
  }
  return (
    <div className='bg-f8f8f8 py-[40px] px-[36px] md:px-[73px]'>
      <div className='flex items-center justify-between'>
        <div className='max-w-[105px]'>
          <p className='font-author font-medium text-[34px] text-383838 leading-none'>{sectionData?.title}</p>
          <NavLink to={sectionData?.link} className='font-general font-medium text-sm md:text-base text-244cb4 capitalize underline'> 
            {sectionData?.linkText}
          </NavLink>
        </div>
        <div className='max-w-[95px]'>
          <img src={sectionData?.image || AboutTopBannerImg } alt="about-us-top-banner" className='w-full h-auto object-cover' />
        </div>
      </div>
    </div>
  )
}

export default AboutUsTopBanner
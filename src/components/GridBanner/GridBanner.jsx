import React from 'react';
import { GridBanner as GridBannerImage, GridBannerMobile } from '../../assets';
import { Link } from 'react-router';

function GridBanner() {
  return (
    <div className='md:px-[120px] cursor-pointer pb-2'>
      <Link to='/pages/contactUs'>
        <img src={GridBannerImage} alt="grid-banner" className="w-full h-auto object-cover max-md:hidden " />
        <img src={GridBannerMobile} alt="grid-banner" className="w-full h-auto object-cover md:hidden " />
      </Link>
    </div>
  )
}

export default GridBanner
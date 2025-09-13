import React from 'react'
import { BottomBanner } from '../../assets'
import { NavLink } from 'react-router'
function VenueDetailsBottomBanner() {
  return (
    <>
      <div className='px-[10px] md:px-12 my-7 md:my-12 pb-7 md:pb-12'>
        <NavLink to={'/pages/contactUs'} className="font-medium text-base font-general text-244cb4 underline">
          <img src={BottomBanner} alt="bottom-banner" className="w-full h-full " />
        </NavLink>
      </div>
    </>
  )
}

export default VenueDetailsBottomBanner
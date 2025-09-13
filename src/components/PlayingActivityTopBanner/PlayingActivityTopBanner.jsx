import React from 'react'
import { PlayingActivityImage } from '../../assets'

const PlayingActivityTopBanner = () => {
  return (
    <>
      <div className='flex items-center justify-between pb-10 relative'>
        <div className='pl-[33px] md:pl-[73px]'>
          <p className='font-author font-medium text-383838 text-2xl md:text-3xl mt-15'>Playing activity</p>
          <p className='font-general font-medium text-black text-xs md:text-sm opacity-80 mt-1'>Keep a track of all your scores in one place</p>
        </div>
        <div className='absolute right-0 top-0'>
          <img src={PlayingActivityImage} alt="banner-img" className='max-w-[217px] md:max-w-[295px]' />
        </div>
      </div>
    </>
  )
}

export default PlayingActivityTopBanner
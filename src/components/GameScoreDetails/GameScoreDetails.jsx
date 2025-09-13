import { useEffect } from 'react'
import { tournamentSkillLevelDefaults } from '../../utils/utlis';
import ThunderboltIcon from '../ThunderboltIcon/ThunderboltIcon';
import { Calendar } from '../../assets';
import Skeleton from 'react-loading-skeleton';

const GameScoreDetails = ({ game, isLoading }) => {
  const skillLevel = game?.skillLevel;
  const gameName = game?.name;
  const date = game?.date;
  const time = game?.time;
  const location = game?.location?.address?.line1;
  const skillValue = tournamentSkillLevelDefaults.findIndex((skill) => skill == skillLevel);

  return (
    <div className='bg-white-to-f4f5ff'>
      <div className='pt-10 md:pt-20 px-[33px] md:px-[73px]'>
        {isLoading ? <Skeleton height={30} width={150} /> : (
          <div className='flex items-start gap-4 md:gap-10'>
            <span className='border border-383838 rounded-2xl bg-white px-2 py-1 capitalize text-[10px] md:text-xs text-383838 '>game joined</span>
            <div className='flex items-center gap-2'>
              <ThunderboltIcon value={skillValue} />
              <p className='font-general font-regular text-xs md:text-sm opacity-70 text-383838 capitalize'>{skillLevel}</p>
            </div>
          </div>
        )}
        <p className='font-author font-medium text-383838 text-2xl md:text-3xl capitalize mt-2'>{gameName}</p>
        <div className='mt-6 md:mt-7'>
          <div className='flex items-center gap-2'>
            <img src={Calendar} alt="calendar" className='w-auto h-[14px] object-cover' loading='lazy' />
            <p className='font-general font-medium text-xs md:text-sm text-383838 opacity-70 capitalize'>{date}</p>
          </div>
          <div className='flex items-center gap-2 mt-5'>
            <p className='font-general font-medium text-383838 text-sm md:text-base capitalize'>{time?.startTime} IST</p>
            <p className='font-general font-medium text-383838 text-sm md:text-base capitalize'>to</p>
            <p className='font-general font-medium text-383838 text-sm md:text-base capitalize'>{time?.endTime} IST</p>
          </div>
        </div>
        <p className='font-general font-medium text-sm md:text-base text-1c0e0eb3 captalize mt-5 '>Venue</p>
        <p className='font-author font-medium text-383838 text-2xl md:text-3xl capitalize mt-5'>{location}</p>
      </div>
    </div>
  )
}

export default GameScoreDetails
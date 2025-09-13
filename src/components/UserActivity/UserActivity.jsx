import React, { useEffect } from 'react'
import { useSelector } from 'react-redux';
import { useGetPlayerActivity } from '../../hooks/PlayerHooks';
import { Link } from 'react-router';
import Skeleton from 'react-loading-skeleton';
import { createErrorToast } from '../../utils/utlis';

const UserActivity = () => {
  const player = useSelector((state) => state.player);
  const playerId = player?.id;
  const {data, isLoading, error} = useGetPlayerActivity(playerId);

  if(error) {
    createErrorToast(error.message);
    return
  }
  

  return (
    <div className='px-[33px] md:px-[73px] pb-[30px]'>
      <div className='flex items-center justify-between mb-5'>
        <p className='font-medium font-general text-sm md:text-base text-1c0e0eb3 capitalize'>Playing Activity</p>
        <Link className='font-general font-medium text-xs md:text-sm text-244cb4 capitalize underline' to={`/playing-activity/${playerId}`}>View All Activity</Link> 
      </div>
      <div className='flex gap-2 items-center'>
        <div className='p-3 md:px-5 md:py-6 border border-244cb44d rounded-2xl flex-none w-[50%]'>
          <p className='font-general font-medium text-xs md:text-base text-383838 opacity-70 mb-1 capitalize'>Games Won</p>
          <p className='font-general font-medium text-383838 text-4xl md:text-5xl'>
            {isLoading ? <Skeleton width={100} height={40} /> :data?.matchesWon}
          </p>
        </div>
        <div className='p-3 md:px-5 md:py-6 border border-244cb44d rounded-2xl flex-none w-[50%]'>
          <p className='font-general font-medium text-xs md:text-base text-383838 opacity-70 mb-1 capitalize'>Games played</p>
          <p className='font-general font-medium text-383838 text-4xl md:text-5xl'>
            {isLoading ? <Skeleton width={100} height={40} /> :data?.totalMatchesPlayed}
          </p>
        </div>
      </div>
    </div>
  )
}

export default UserActivity
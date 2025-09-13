import React from 'react'
import { GameActivityDesktop, GameActivityMobile } from '../assets'
import { useGetGameById } from '../hooks/GameHooks';
import { useSelector } from 'react-redux';
import PlayingActivityListing from '../components/PlayingActivityListing/PlayingActivityListing';
import { Link, useParams } from 'react-router';
import PlayingActivityListingCard from '../components/PlayingActivityListingCard/PlayingActivityListingCard';
import Skeleton from 'react-loading-skeleton';

const GameActivityRecorded = () => {
  const param = useParams();
  const handle = param?.handle;
  const playerId = useSelector((state) => state.player.id);
  const { data: game, isLoading, error, refetch } = useGetGameById(playerId, handle);
  return (
    <div className='bg-f8f8f8'>
      <div className='max-w-[720px] mx-auto px-0 w-full container bg-white'>
        <div className='relative'>
          <div>
            <img src={GameActivityDesktop} alt="game-activity-recorded" className='w-full h-auto hidden md:block' />
            <img src={GameActivityMobile} alt="game-activity-recorded" className='w-full h-auto block md:hidden' />
          </div>
          <div className='text-center absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[50%] md:w-[80%]'>
            <p className='font-author font-medium text-white text-[34px] md:text-[44px] capitalize text-center'>Activity Recorded</p>
            <p className='font-general font-medium text-xs md:text-sm text-white capitalize text-center'>Your activity will be verified and visible to others once all players have approved.</p>
          </div>
        </div>
        <div className='px-[20px] md:px-[76px] pt-[40px]'>
          {isLoading ? <Skeleton height={200} width='100%' /> : (
            <>
              <PlayingActivityListingCard game={game} disabled={true} />
              <div className='flex items-center mt-5 pb-6'>
                <Link to={`/playing-activity/${playerId}`} className='font-general font-medium text-xs md:text-sm text-244cb4 capitalize underline text-center m-auto w-full'>View All Activity</Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default GameActivityRecorded
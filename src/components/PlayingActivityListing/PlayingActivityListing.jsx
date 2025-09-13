import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { useGetAllPlayingActivity } from '../../hooks/GameHooks';
import PlayingActivityListingCard from '../PlayingActivityListingCard/PlayingActivityListingCard';
import PlayerActivityFilter from '../PlayerActivityFilter/PlayerActivityFilter';
import Skeleton from 'react-loading-skeleton';

const PlayingActivityListing = () => {
  const playerID = useSelector((state) => state.player.id);
  const [filter, setFilter] = useState('all');
  const { data: allPlayingActivity, isLoading, error, refetch } = useGetAllPlayingActivity(playerID, filter);

  useEffect(() => {
    refetch();
  }, [filter, refetch]);

  const renderContent = () => {
    if (isLoading) {
      return <Skeleton width="100%" height={200} />;
    }

    if (!allPlayingActivity || allPlayingActivity.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-12 px-4">
          <div className="text-center">
            <p className="font-general font-medium text-lg text-383838 mb-2">
              No games found
            </p>
            <p className="font-general text-sm text-383838 opacity-70">
              {filter === 'all' 
                ? 'You haven\'t played any games yet. Start playing to see your activity here!'
                : `No games found for the selected filter "${filter}". Try changing the filter or play some games!`
              }
            </p>
          </div>
        </div>
      );
    }

    return allPlayingActivity.map((game, index) => (
      <div className="my-3 md:my-6" key={index}>
        <PlayingActivityListingCard game={game} />
      </div>
    ));
  };

  return (
    <div className='px-[33px] md:px-[73px]'>
      <PlayerActivityFilter selected={filter} onFilterChange={setFilter} />
      {renderContent()}
    </div>
  )
}

export default PlayingActivityListing
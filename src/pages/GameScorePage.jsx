import React, { useEffect } from 'react'
import { useSelector } from 'react-redux';
import { useParams } from 'react-router';
import { useGetGameById } from '../hooks/GameHooks';
import GameScoreDetails from '../components/GameScoreDetails/GameScoreDetails';
import GameScoreWrapper from '../components/GameScoreWrapper/GameScoreWrapper';

  const GameScorePage = () => {
    const params = useParams();
    const player = useSelector((state) => state.player);
    const playerId = player?.id;
    const handle = params?.handle;
    const { data: game, isLoading, error, refetch } = useGetGameById(playerId, handle);

  return (
    <div className="main-container bg-f2f2f2">
      <div className='max-w-[720px] mx-auto px-0 w-full container bg-white'>
        <GameScoreDetails game={game} isLoading={isLoading} />
        <GameScoreWrapper game={game} isLoading={isLoading} error={error} refetch={refetch} />
      </div>
    </div>
  )
}

export default GameScorePage
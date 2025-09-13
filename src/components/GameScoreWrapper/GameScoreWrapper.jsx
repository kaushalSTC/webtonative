import { StatsIcon } from '../../assets'
import TrackGameScores from '../TrackGameScores/TrackGameScores'

const GameScoreWrapper = ({ game, isLoading, error, refetch }) => {
  const gameId = game?.gameId;
  const matches = game?.matches;
  const players = game?.players;
  const gameHandle = game?.handle;
  const format = game?.format;
  return (
    <div className='pt-10 px-[33px] md:px-[73px]'>
      <div className='flex items-start gap-2 mb-7'>
        <img src={StatsIcon} alt="stats-icon" className='w-[15px] h-[15px] inline-block mr-[6px] mb-[10px]' />
        <span className='font-general font-medium text-sm md:text-base text-1c0e0eb3 opacity-80 capitalize inline'>
          Score details
        </span>
      </div>
      <TrackGameScores gameId={gameId} matches={matches} gameType={format} isLoading={isLoading} error={error} refetch={refetch} players={players} gameHandle={gameHandle}/>
    </div>
  )
}

export default GameScoreWrapper
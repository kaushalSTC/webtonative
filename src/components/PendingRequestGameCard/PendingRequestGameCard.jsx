import { useNavigate } from 'react-router';
import { AcceptIcon, Calendar, Clock, InfoIcon, Location, RejectIcon } from '../../assets';
import { convertTo12HourFormat, createErrorToast, createToast, parseTimeStampForDateLongMonth, tournamentSkillLevelDefaults } from '../../utils/utlis';
import ThunderboltIcon from '../ThunderboltIcon/ThunderboltIcon';
import { useSelector } from 'react-redux';
import { useAcceptGameInvite, useRejectGameInvite } from '../../hooks/GameHooks';

const PendingRequestGameCard = ({ game, disableHover = false, imageLoading = 'lazy', handleRefresh }) => {
  const navigate = useNavigate();
    let skillLevel = tournamentSkillLevelDefaults.findIndex((skill) => skill == game.skillLevel);
    const playerID = useSelector((state) => state.player.id);
    const { mutate: acceptGameInvite, isLoading: isAcceptGameInviteLoading, isError: isAcceptGameInviteError, error: acceptGameInviteError } = useAcceptGameInvite();
    const { mutate: rejectGameInvite, isLoading: isRejectGameInviteLoading, isError: isRejectGameInviteError, error: rejectGameInviteError } = useRejectGameInvite();

    const handleAcceptGameInvite = (gameHandle) => {
      acceptGameInvite({ playerID: playerID, gameHandle: gameHandle, acceptObj: { "response": "ACCEPTED" } },
        {
          onSuccess: (data) => {
            createToast('Player invite accepted successfully');
            handleRefresh();
          },
          onError: (error) => {
            console.log(error, 'error');
            createErrorToast(error?.response?.data?.message || 'Failed to accept player invite');
          }
        }
      );
    }

    const handleRejectGameInvite = (gameHandle) => {
      rejectGameInvite({ playerID: playerID, gameHandle: gameHandle, rejectObj: { "response": "REJECTED" } },
        {
          onSuccess: (data) => {
            console.log(data, 'data');
            createToast('Player invite rejected successfully');
            handleRefresh();
          },
          onError: (error) => {
            console.log(error, 'error');
            createErrorToast(error?.response?.data?.message || 'Failed to reject player invite');
          }
        }
      );
    }
  
    return (
      <div className={`${!disableHover ? 'hover:shadow-2xl transition-shadow duration-500' : ''} w-full border border-f0f0f0 rounded-r-20 p-4 md:p-5 mt-[1px] max-h-[max-content]`}>
        <p className="capitalize font-author font-medium text-383838 text-2xl">{game.name}</p>
  
        <div className="flex items-center gap-2 mt-2">
          {skillLevel > 0 && (
            <div className="flex items-center gap-1">
              <ThunderboltIcon value={skillLevel} iconClassName="w-[15px] h-[20x] object-cover " />
              <p className="font-general font-medium text-xs md:text-sm text-383838 opacity-70 capitalize">
                {game.skillLevel}
              </p>
            </div>
          )}
        </div>
  
        <div className="flex flex-nowrap items-center border-y border-dbe0fc justify-center mt-4">
          <div className="flex flex-nowrap items-center gap-1">
            <img src={Clock} alt="clock" className="w-auto h-[14px] object-cover" loading='lazy' />
            <p className="font-general font-medium text-383838 opacity-70 text-xs md:text-sm">
              {convertTo12HourFormat(game.time.startTime)} IST
            </p>
          </div>
          <div className="flex flex-nowrap items-center gap-1 border-x border-dbe0fc py-1 px-2 mx-3">
            <img src={Calendar} alt="Calendar" className="w-auto h-[14px] object-cover" loading='lazy' />
            <p className="font-general font-medium text-383838 opacity-70 text-xs md:text-sm">
              {parseTimeStampForDateLongMonth(game.date)}
            </p>
          </div>
          <div className="flex flex-nowrap items-center gap-1">
            <img src={Location} alt="Location" className="w-auto h-[17px]" loading='lazy' />
            <p className="font-general font-medium text-383838 opacity-70 text-xs md:text-sm">
              {game.gameLocation.address.city}
            </p>
          </div>
        </div>
  
        <div className="flex items-center justify-between gap-2 mt-4">
          <button onClick={() => navigate(`/games/${game.handle}`)}
            className="flex items-center gap-2">
            <img src={InfoIcon} alt="Game-info" className='w-[20px] h-[20x]' />
            <span className='font-general font-medium text-xs text-383838 opacity-70'>View Game</span>
          </button>
          <button onClick={() => handleRejectGameInvite(game.handle)}
            className="flex items-center gap-2"
            disabled={isRejectGameInviteLoading || isRejectGameInviteError || isAcceptGameInviteLoading || isAcceptGameInviteError}>
            <img src={RejectIcon} alt="Game-info" className='w-[20px] h-[20x]' />
            <span className='font-general font-medium text-xs text-383838 opacity-70'>{isRejectGameInviteLoading ? 'Rejecting...' : 'Reject'}</span>
          </button>
          <button onClick={() => handleAcceptGameInvite(game.handle)}
            className="flex items-center gap-2"
            disabled={isRejectGameInviteLoading || isRejectGameInviteError || isAcceptGameInviteLoading || isAcceptGameInviteError}>
            <img src={AcceptIcon} alt="Game-info" className='w-[20px] h-[20x]' />
            <span className='font-general font-medium text-xs text-383838'>{isAcceptGameInviteLoading ? 'Accepting...' : 'Accept'}</span>
          </button>
        </div>
      </div>
    );
}

export default PendingRequestGameCard
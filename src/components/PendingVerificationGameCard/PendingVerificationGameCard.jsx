import { DummyProfileImage, GreenArrow, PendingIcon, InfoIcon, AcceptIcon, RejectIcon } from '../../assets';
import { formatDateObject, createToast, createErrorToast } from '../../utils/utlis';
import { useNavigate } from 'react-router';
import { useSelector } from 'react-redux';
import { useAcceptGameScore, useRejectGameScore } from '../../hooks/GameHooks';

const PendingVerificationGameCard = ({ game, index, handleRefresh, showButtons }) => {
  const navigate = useNavigate();
  const playerID = useSelector((state) => state.player.id);
  const gameId = game?.gameId;
  const gameHandle = game?.handle;
  const { mutate: acceptGameScore } = useAcceptGameScore();
  const { mutate: rejectGameScore } = useRejectGameScore();

  const handleAcceptGameScore = () => {
    acceptGameScore({ playerID: playerID, gameHandle: gameHandle, acceptObj: { "action": "accept" } }, {
      onSuccess: () => { createToast('Game scores accepted successfully'); handleRefresh(); },
      onError: (error) => { createErrorToast(error?.response?.data?.message || 'Failed to accept game scores'); }
    });
  };
  const handleRejectGameScore = () => {
    rejectGameScore({ playerID: playerID, gameHandle: gameHandle, rejectObj: { "action": "reject" } }, {
      onSuccess: () => { createToast('Game scores rejected successfully'); handleRefresh(); },
      onError: (error) => { createErrorToast(error?.response?.data?.message || 'Failed to reject game scores'); }
    });
  };

  return (
    <div className='border border-f0f0f0 rounded-3xl p-5 md:px-4 shadow-lg mb-6 bg-white'>
      <p className='font-general font-medium text-sm md:text-base text-383838 capitalize'>{game?.name}</p>
      <div className='flex items-center justify-between'>
        <p className='font-general font-medium text-xs md:text-sm text-383838 capitalize opacity-70'>{formatDateObject(game?.date, { day: 'numeric', month: 'long', year: 'numeric' })}</p>
        <p className='font-general font-medium text-xs md:text-sm text-383838 capitalize opacity-70'>{game?.skillLevel}</p>
        <p className='font-general font-medium text-xs md:text-sm text-383838 capitalize border border-383838 py-1 px-2 rounded-2xl'>Game Joined</p>
      </div>
      <div className='flex items-center justify-between mt-5 pt-4 border-t border-f2f2f2'>
        <p className='font-general font-medium text-xs md:text-sm text-383838 capitalize opacity-70'>Players</p>
        <p className='font-general font-medium text-xs md:text-sm text-383838 capitalize opacity-70'>Scores</p>
      </div>
      <div className='matches'>
        <div>
          {game?.matches?.[0] && (() => {
            const match = game.matches[0];
            return (
              <div className='match 1 flex flex-col gap-7 divide-y divide-f4f5ff'>
                <div className='team1 flex items-center justify-between py-4'>
                  <div className='players'>
                    {match?.team1?.map((player, index) => (
                      <div key={index} className='flex items-center gap-3 pb-2'>
                        <div>
                          <img
                            src={player?.profilePic || player?.playerDetails?.profilePic || DummyProfileImage}
                            alt="profile-image"
                            className='w-10 h-10 rounded-full'
                          />
                        </div>
                        <p className={`font-general font-semibold text-sm md:text-base capitalize ${player?.playerId === playerID ? 'text-244cb4' : 'text-383838'}`}>
                          {player?.name || player?.playerDetails?.name || 'Picklebay Player'}
                          {(player?.status === 'PENDING' || player?.playerDetails?.status === 'PENDING') && (
                            <img src={PendingIcon} alt="pending-icon" className="w-4 h-4 inline-block ml-3 align-middle" />
                          )}
                          {(player?.status === 'REJECTED' || player?.playerDetails?.status === 'REJECTED') && (
                            <img src={RejectIcon} alt="rejected-icon" className="w-4 h-4 inline-block ml-3 align-middle" />
                          )}
                          {(player?.status === 'ACCEPTED' || player?.playerDetails?.status === 'REJECTED') && (
                            <img src={AcceptIcon} alt="rejected-icon" className="w-4 h-4 inline-block ml-3 align-middle" />
                          )}
                        </p>
                      </div>
                    ))}
                  </div>
                  <div className='scores flex items-center gap-2'>
                    {match.matchWinner === 1 && (
                      <img src={GreenArrow} alt="profile-activity" className="w-auto h-[15px] inline-block mr-[6px] " />
                    )}
                    <div className='flex items-center gap-3'>
                      {match.sets?.map((set, index) => (
                        <p key={index}>{set?.scoreTeam1}</p>
                      ))}
                    </div>
                  </div>
                </div>
                <div className='team2 flex items-center justify-between'>
                  <div className='player'>
                    {match?.team2?.map((player, index) => (
                      <div key={index} className='flex items-center gap-3 pb-2'>
                        <div>
                          <img src={player?.profilePic || player?.playerDetails?.profilePic || DummyProfileImage} alt="profile-image" className='w-10 h-10 rounded-full' />
                        </div>
                        <p className={`font-general font-semibold text-sm md:text-base capitalize ${player?.playerId === playerID ? 'text-244cb4' : 'text-383838'}`}>
                          {player?.name || player?.playerDetails?.name || 'Picklebay Player'}
                          {(player?.status === 'PENDING' || player?.playerDetails?.status === 'PENDING') && (
                            <img src={PendingIcon} alt="pending-icon" className="w-4 h-4 inline-block ml-3 align-middle" />
                          )}
                          {(player?.status === 'REJECTED' || player?.playerDetails?.status === 'REJECTED') && (
                            <img src={RejectIcon} alt="rejected-icon" className="w-4 h-4 inline-block ml-3 align-middle" />
                          )}
                          {(player?.status === 'ACCEPTED' || player?.playerDetails?.status === 'REJECTED') && (
                            <img src={AcceptIcon} alt="rejected-icon" className="w-4 h-4 inline-block ml-3 align-middle" />
                          )}
                        </p>
                      </div>
                    ))}
                  </div>
                  <div className='scores flex items-center gap-2'>
                    {match.matchWinner === 2 && (
                      <img src={GreenArrow} alt="profile-activity" className="w-auto h-[15px] inline-block mr-[6px] " />
                    )}
                    <div className='flex items-center gap-3'>
                      {match.sets?.map((set, index) => (
                        <p key={index}>{set?.scoreTeam2}</p>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      </div>
      {showButtons && (
        <div className="flex items-center justify-between gap-2 mt-6">
          <button onClick={() => navigate(`/games/${gameHandle}/score-details`)} className="flex items-center gap-2">
            <img src={InfoIcon} alt="Game-info" className='w-[20px] h-[20x]' />
            <span className='font-general font-medium text-xs text-383838 opacity-70'>View Game</span>
          </button>
          <button onClick={handleRejectGameScore} className="flex items-center gap-2">
            <img src={RejectIcon} alt="Game-info" className='w-[20px] h-[20x]' />
            <span className='font-general font-medium text-xs text-383838 opacity-70'>Reject</span>
          </button>
          <button onClick={handleAcceptGameScore} className="flex items-center gap-2">
            <img src={AcceptIcon} alt="Game-info" className='w-[20px] h-[20x]' />
            <span className='font-general font-medium text-xs text-383838'>Accept</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default PendingVerificationGameCard;
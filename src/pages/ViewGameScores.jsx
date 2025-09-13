import React, { useEffect } from 'react'
import { useGetGameById, useResendScoreVerification } from '../hooks/GameHooks';
import { useSelector } from 'react-redux';
import { Link, useParams } from 'react-router';
import { createErrorToast, createToast, tournamentSkillLevelDefaults } from '../utils/utlis';
import ThunderboltIcon from '../components/ThunderboltIcon/ThunderboltIcon';
import { Calendar, DummyProfileImage, EditProfile, GreenArrow, Location, MapIcon } from '../assets';
import Skeleton from 'react-loading-skeleton';

const ViewGameScores = () => {
  const playerId = useSelector((state) => state.player.id);
  const params = useParams();
  const handle = params?.handle;
  const { data: game, isLoading, error } = useGetGameById(playerId, handle);
  const { mutate: resendScoreVerification, isLoading: isResendScoreVerificationLoading } = useResendScoreVerification();
  const skillLevel = game?.skillLevel;
  const skillValue = tournamentSkillLevelDefaults.findIndex((skill) => skill == skillLevel);
  const fullAddress = `${game?.location?.address?.line1 ?? ""}, ${game?.location?.address?.line2 ?? ""}, ${game?.location?.address?.city ?? ""}, ${game?.location?.address?.state ?? ""}, ${game?.location?.address?.postalCode ?? ""}`.trim();

  const handleOpenMap = () => {
    if (!fullAddress.trim()) return;
    const googleMapUrl = `https://www.google.com/maps?q=${encodeURIComponent(fullAddress)}`;
    window.open(googleMapUrl, "_blank");
  };

  const handleReverification = () => {
    resendScoreVerification({playerId: playerId, gameHandle: handle}, 
      {
        onSuccess: () => {
          createToast('Score Verification Resent successfully');
        }
      },
      {
        onerror: (error) => {
          createErrorToast('Score Verification Resent failed');
        }
      }
    );
  }

  useEffect(() => {
    console.log(game, 'game')
  }, [game])

  return (
    <div className='bg-f8f8f8'>
      <div className='max-w-[720px] mx-auto px-0 w-full container bg-white'>
        <div className='px-[33px] md:px-[73px] py-[60px]'>
          <div className='flex items-center justify-between'>
            <div className='flex items-start gap-4 md:gap-10'>
              {isLoading ? <Skeleton height={20} width={150} /> : (
                <p className='font-general font-medium text-xs md:text-sm text-383838 capitalize border border-383838 py-1 px-2 rounded-2xl'>{game?.isCreator ? 'game created' : 'game joined'}</p>
              )}
              {isLoading ? <Skeleton height={20} width={200} /> : (
                <div className='flex items-center gap-2'>
                  <ThunderboltIcon value={skillValue} />
                  <p className='font-general font-regular text-xs md:text-sm opacity-70 text-383838 capitalize'>{skillLevel}</p>
                </div>
              )}
            </div>
            <div className='flex items-center gap-2'>
              {game?.isCreator && game?.matches?.some((match) =>
                [...(match.team1 || []), ...(match.team2 || [])].some((player) => player.status === "REJECTED")
              ) && (
                  <button className='bg-383838 text-white py-2 px-3 rounded-xl font-general capitalize text-sm' onClick={handleReverification}>{isResendScoreVerificationLoading ? 'Sending...' : 'Re-Verify Scores'}</button>
                )}

              {game?.isCreator && (
                <Link to={`/games/${game?.handle}/score`}>
                  <div className='border border-f2f2f2 rounded-full p-2 cursor-pointer'>
                    <img src={EditProfile} alt="edit-button" className='w-4 h-4' />
                  </div>
                </Link>
              )}
            </div>
          </div>

          {isLoading ? <Skeleton width="100%" height="200px" /> : (
            <p className='font-author font-medium text-383838 text-2xl md:text-3xl capitalize mt-2 mb-5 md:mb-7'>{game?.name}</p>
          )}

          <div className='w-full h-[2px] bg-f2f2f2 mb-6'></div>

          {isLoading ? <Skeleton width={200} height={100} /> : (
            <p className='font-general font-medium text-sm md:text-base text-1c0e0eb3 capitalize'>Game Details</p>
          )}

          {isLoading ? <Skeleton width="100%" height={200} /> : (
            <div className='flex items-center gap-2 mt-5'>
              <img src={Calendar} alt="calendar" className='w-auto h-[14px] object-cover' loading='lazy' />
              <p className='font-general font-medium text-xs md:text-sm text-383838 opacity-70 capitalize'>{game?.date}</p>
            </div>
          )}

          <div className='flex items-center gap-2 my-5'>
            <p className='font-general font-medium text-383838 text-sm md:text-base capitalize'>{game?.time?.startTime} IST</p>
            <p className='font-general font-medium text-383838 text-sm md:text-base capitalize'>to</p>
            <p className='font-general font-medium text-383838 text-sm md:text-base capitalize'>{game?.time?.endTime} IST</p>
          </div>

          <div className='w-full h-[2px] bg-f2f2f2 mb-6'></div>
          {isLoading ? <Skeleton width="100%" height="200px" /> : (
            <p className='font-general font-medium text-sm md:text-base text-1c0e0eb3 capitalize'>venue</p>
          )}
          <p className='font-author font-medium text-383838 text-2xl md:text-3xl capitalize mt-2 mb-5 md:mb-7'>{game?.location?.address?.line1}</p>
          {isLoading ? <Skeleton width="100%" height="300px" /> : (
            <div className="flex justify-between mb-6">
              <div className="flex items-baseline gap-2">
                <span>
                  <img src={Location} alt="Location-icon" className="w-4 h-4 " />
                </span>
                <p className="font-general font-medium text-base text-1c0e0e max-w-[230px] max-md:text-sm max-md:max-w-[220px] capitalize">
                  {[
                    game?.location?.address?.line2,
                    game?.location?.address?.city,
                    game?.location?.address?.state,
                    game?.location?.address?.postalCode
                  ].filter(Boolean).join(', ')}
                </p>
              </div>
              <div onClick={handleOpenMap} data-google-map-url={`https://www.google.com/maps?q=${encodeURIComponent(fullAddress)}`}
                className="venue-map-btn cursor-pointer">
                <span className="w-6 h-6 ml-auto block">
                  <img src={MapIcon} alt="map-icon" className="w-6 h-6 " />
                </span>
                <p className="venue-map-textfont-medium font-general text-sm text-244cb4 underline max-md:text-[12px]">
                  Map View
                </p>
              </div>
            </div>
          )}
          <div className='w-full h-[2px] bg-f2f2f2 mb-6'></div>
          <div className='match-wraper'>
            {game?.matches?.map((match, index) => (
              <div key={match.matchId} className="mb-10">
                {/* Match Heading */}
                <p className="font-general font-semibold text-base md:text-lg text-383838 capitalize mb-4">
                  Match {index + 1}
                </p>

                {/* Team 1 */}
                <p className='font-general font-medium text-sm md:text-base text-1c0e0eb3 capitalize mb-3'>{game?.format === "SE" ? "Player" : "Team"} 1</p>
                {match?.team1?.map((player) => (
                  <div key={player.playerId} className='flex items-center gap-2 mb-2'>
                    <img src={player?.playerDetails?.profilePic || DummyProfileImage} alt="profile" className='w-[50px] md:w-[75px] aspect-square rounded-full' />
                    <p className={`font-general font-medium text-sm md:text-base capitalize ${player?.playerId === playerId ? 'text-244cb4' : 'text-383838'}`}>{player?.playerDetails?.name}</p>
                  </div>
                ))}

                {/* Team 1 Score */}
                <div className='flex items-center justify-center gap-3 mb-4'>
                  {match.matchWinner === 1 && (
                    <img src={GreenArrow} alt="winner" className='w-auto h-[20px] object-cover' loading='lazy' />
                  )}
                  {match?.sets?.map((set, idx) => (
                    <p key={idx} className='font-general font-medium text-383838 text-sm md:text-base capitalize'>{set?.scoreTeam1}</p>
                  ))}
                </div>

                <div className='bg-dbe0fc h-[1px] w-[80%] mx-auto my-6'></div>

                {/* Team 2 */}
                <p className='font-general font-medium text-sm md:text-base text-1c0e0eb3 capitalize mb-3'>{game?.format === "SE" ? "Player" : "Team"} 2</p>
                {match?.team2?.map((player) => (
                  <div key={player.playerId} className='flex items-center gap-2 mb-2'>
                    <img src={player?.playerDetails?.profilePic || DummyProfileImage} alt="profile" className='w-[50px] md:w-[75px] aspect-square rounded-full' />
                    <p className={`font-general font-medium text-sm md:text-base capitalize ${player?.playerId === playerId ? 'text-244cb4' : 'text-383838'}`}>{player?.playerDetails?.name}</p>
                  </div>
                ))}

                {/* Team 2 Score */}
                <div className='flex items-center justify-center gap-3'>
                  {match.matchWinner === 2 && (
                    <img src={GreenArrow} alt="winner" className='w-auto h-[20px] object-cover' loading='lazy' />
                  )}
                  {match?.sets?.map((set, idx) => (
                    <p key={idx} className='font-general font-medium text-383838 text-sm md:text-base capitalize'>{set?.scoreTeam2}</p>
                  ))}
                </div>

                {/* Divider */}
                {index !== game.matches.length - 1 && (
                  <div className='bg-dbe0fc h-[2px] w-full my-6'></div>
                )}
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  )
}

export default ViewGameScores
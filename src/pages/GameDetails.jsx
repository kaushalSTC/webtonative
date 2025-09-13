import { useParams } from 'react-router'
import { useGameDetails, useInvitePlayer, useJoinGame, useLeaveGame, useRemovePlayer, useCreateGamePost, useChangeGameStatus } from '../hooks/GameHooks';
import { SuccessGameBanner, EditButton, CalendarIcon, Location, MapIcon, DummyProfileImage, DownArrow, InviteSend, InviteSendIcon } from '../assets';
import ThunderboltIcon from '../components/ThunderboltIcon/ThunderboltIcon';
import { parseTimeStampForDateLongMonth, tournamentSkillLevelDefaults, formatVenueName, formatAddress, createErrorToast, isPastDate } from '../utils/utlis';
import Loader from '../components/Loader/Loader';
import { useSelector } from 'react-redux';
import GamePartnerSearch from '../components/GamePartnerSearch/GamePartnerSearch';
import SetGamePublic from '../components/SetGamePublic/SetGamePublic';
import { useEffect, useState } from 'react';
import InvitedPlayers from '../components/InvitedPlayers/InvitedPlayers';
import { useNavigate } from 'react-router';
import ShareGame from '../components/ShareGame/ShareGame';
import Popup from '../components/Popup/Popup';
import { motion } from 'motion/react';
import { WhatsappIcon } from '../assets'
import { useLocation } from 'react-router-dom';
import { createToast } from '../utils/utlis';
import CommunityButton from '../components/CommunityButton/CommunityButton';

const GameDetails = () => {
    const { handle } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const previousPage = location.state?.from;
    const { data: GameDetails, isLoading, isError, error, isSuccess } = useGameDetails(handle);
    const { mutate, isLoading: isInviting, isError: isInviteError, error: inviteError } = useInvitePlayer();
    const { mutate: joinGame, isLoading: isJoining, isError: isJoinError, error: joinError } = useJoinGame();
    const { mutate: leaveGame, isLoading: isLeaving, isError: isLeavingError, error: leavingError } = useLeaveGame();
    const { mutate: removePlayer, isLoading: isRemovePlayerLoading, isError: isRemovePlayerError, error: removePlayerError } = useRemovePlayer();
    const { mutate: createGamePost, isLoading: isCreateGamePostLoading, isError: isCreateGamePostError, error: createGamePostError } = useCreateGamePost();
    const { mutate: changeGameStatus, isLoading: isChangeGameStatusLoading, isError: isChangeGameStatusError, error: changeGameStatusError } = useChangeGameStatus();
    const playerID = useSelector((state) => state.player.id);
    const joinGameLink = window.location.href;
    const playerName = useSelector((state) => state.player.name);
    const [invitedPlayers, setInvitedPlayers] = useState([]);
    const [acceptedPlayers, setAcceptedPlayers] = useState([]);
    const [inivitedPlayerDetails, setInivitedPlayerDetails] = useState({});
    const [isGameDatePast, setIsGameDatePast] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
    const isCreator = GameDetails?.data?.data?.isCreator;

    const setGameTime = (time) => {
        const timeArray = time.split(':');
        if (Number(timeArray[0]) > 12) {
            return `${timeArray[0]}:${timeArray[1]} PM`
        } else {
            return `${timeArray[0]}:${timeArray[1]} AM`
        }
    }
    // Update player lists when query data is loaded or updated
    useEffect(() => {
        if (isSuccess && GameDetails?.data?.data?.game?.players) {
            const players = GameDetails.data.data.game.players;

            // Set all players for the invited players component
            setInvitedPlayers(players.filter(player =>
                // Only show players that are not the current user
                player.playerDetails?._id !== playerID
            ));

            // Set accepted players for the joined players display
            setAcceptedPlayers(players.filter(player =>
                player.status === 'ACCEPTED'
            ));

            // Check if the game is past date
            setIsGameDatePast(isPastDate(GameDetails?.data?.data?.game?.date));
        }

    }, [GameDetails, isSuccess, playerID]);


    let skillLevel = tournamentSkillLevelDefaults.findIndex((skill) => skill == GameDetails?.data?.data?.game?.skillLevel);


    const handleMapClick = () => {
        const fullAddress = formatAddress(GameDetails?.data?.data?.game?.gameLocation?.address).trim();
        if (!fullAddress) return;
        window.open(`https://www.google.com/maps/search/?api=1&query=${fullAddress}`, '_blank');
    }

    // Creator only - Handle inviting a player
    const handleInvitePlayer = (playerToJoin) => {
        const { _id } = playerToJoin;
        setInivitedPlayerDetails(playerToJoin);
        mutate({ userID: playerID, gameHandle: handle, inviteObj: { playerIds: [_id] } },
            {
                onSuccess: (data) => {
                    // Update the invited players list with the new data
                    const updatedPlayers = data?.data?.players || [];

                    // Update both player lists
                    setInvitedPlayers(updatedPlayers.filter(player =>
                        player.playerDetails?._id !== playerID
                    ));

                    setAcceptedPlayers(updatedPlayers.filter(player =>
                        player.status === 'ACCEPTED'
                    ));

                    handleViewOpen(true);

                    createToast('Player invited successfully');
                },
                onError: (error) => {
                    console.log(error, 'error');
                    createErrorToast(error?.response?.data?.message || 'Failed to invite player');
                }
            }
        );
    }

    const handleJoinGame = () => {
        if (isLoggedIn) {

            joinGame({ userID: playerID, handle, joinObj: { playerId: playerID } },
                {
                    onSuccess: (data) => {
                        // Update the invited players list with the new data
                        const updatedPlayers = data?.data?.players || [];

                        // Update both player lists
                        setInvitedPlayers(updatedPlayers.filter(player =>
                            player.playerDetails?._id !== playerID
                        ));

                        setAcceptedPlayers(updatedPlayers.filter(player =>
                            player.status === 'ACCEPTED'
                        ));

                        createToast('Joined game successfully');
                    },
                    onError: (error) => {
                        console.log(error, 'error');
                        createErrorToast(error?.response?.data?.message || 'Failed to Join Game');
                    }
                }
            );
        } else {
            navigate(`/login?redirect=/games/${handle}`);
        }
    }

    const handleLeaveGame = () => {
        leaveGame({ userID: playerID, handle },
            {
                onSuccess: (data) => {
                    // Update the invited players list with the new data
                    const updatedPlayers = data?.data?.players || [];

                    // Update both player lists
                    setInvitedPlayers(updatedPlayers.filter(player =>
                        player.playerDetails?._id !== playerID
                    ));

                    setAcceptedPlayers(updatedPlayers.filter(player =>
                        player.status === 'ACCEPTED'
                    ));

                    createToast('Left game successfully');
                },
                onError: (error) => {
                    console.log(error, 'error');
                    createErrorToast(error?.response?.data?.message || 'Failed to leave player');
                }
            }
        );
    }

    const handleRemovePlayer = (playerId) => {
        removePlayer({ userID: playerID, handle, removePlayerObj: { playerId } },
            {
                onSuccess: (data) => {
                    // Update the invited players list with the new data
                    const updatedPlayers = data?.data?.players || [];

                    // Update both player lists
                    setInvitedPlayers(updatedPlayers.filter(player =>
                        player.playerDetails?._id !== playerID
                    ));

                    setAcceptedPlayers(updatedPlayers.filter(player =>
                        player.status === 'ACCEPTED'
                    ));

                    createToast('Player removed successfully');
                },
                onError: (error) => {
                    console.log(error, 'error');
                    createErrorToast(error?.response?.data?.message || 'Failed to remove player');
                }
            }
        );
    }

    const handleViewOpen = (state) => {
        setIsOpen(state);
    }

    useEffect(() => {
        if (isOpen) {
            const timer = setTimeout(() => {
                handleViewOpen(false);
            }, 3000);

            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    const handleCreateGamePost = () => {
        createGamePost({ playerID, gameHandle: handle, gameLinkObj: { gameJoinLink: joinGameLink } },
            {
                onSuccess: (data) => {
                    createToast('Game post created successfully');
                    navigate('/community');
                },
                onError: (error) => {
                    console.log(error, 'error');
                    createErrorToast(error?.response?.data?.message || 'Failed to create game post');
                }
            }
        );
    }

    const handleGameDelete = () => {
        changeGameStatus({ playerID, gameHandle: handle, gameObj: { status: 'CANCELLED' } },
            {
                onSuccess: (data) => {
                    createToast('Game deleted successfully');
                    navigate('/account');
                },
                onError: (error) => {
                    console.log(error, 'error');
                    createErrorToast(error?.response?.data?.message || 'Failed to delete game');
                }
            }
        );
    }

    if (isLoading) {
        return (
            <div className='w-full h-screen flex justify-center items-center'>
                <Loader size='lg' color='loading ' />
            </div>
        )
    }

    if (isError) {
        return (
            <div className='w-full h-screen flex justify-center items-center'>
                <p className='text-base text-383838 font-general font-medium opacity-80'>Could'nt fetch the game</p>
            </div>
        )
    }

    return (
        <div className='bg-f2f2f2'>
            <div className='w-full max-w-[712px] mx-auto'>
                {/* Banner */}
                {isCreator && previousPage && previousPage === '/create-game' && (
                    <div className='relative'>
                        <img src={SuccessGameBanner} alt='Success Game Banner' className='w-full h-auto ' />
                        <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'>
                            <p className='font-author font-medium text-white text-[34px] md:text-[44px] capitalize'>Congratulations!</p>
                            <p className='font-general font-regular md:font-medium text-xs md:text-sm text-white'>
                                You have successfully created your Game
                            </p>
                        </div>
                    </div>
                )}
                {/* Game name */}
                <div className='bg-white px-9 md:px-16 pt-[35px]'>
                    <div className='border-b border-f2f2f2 pb-[30px]'>
                        <div className='flex items-center justify-between'>
                            <div className='flex items-center justify-between gap-3 md:gap-6'>
                                {/* <p className='bg-f2f2f2 rounded-[12px] px-[7px] py-[5px] font-general font-regular md:font-medium text-[10px] md:text-xs text-383838'>Friendly game</p> */}
                                <div className='flex items-center justify-between gap-1'>
                                    <ThunderboltIcon value={skillLevel} />
                                    <p className='font-general font-regular md:font-medium text-xs md:text-sm opacity-70 capitalize'>{GameDetails?.data?.data?.game?.skillLevel}</p>
                                </div>
                            </div>
                            {isCreator && (
                                <div className={`border-2 border-f2f2f2 rounded-full p-[8px] flex items-center cursor-pointer ${isGameDatePast ? 'opacity-50 pointer-events-none' : ''}`} onClick={() => navigate(`/edit-game/${handle}`)}>
                                    <img src={EditButton} alt="edit button " />
                                </div>
                            )}
                        </div>
                        <div>
                            <p className='font-author font-medium text-383838 text-2xl md:text-[34px] capitalize'>{GameDetails?.data?.data?.game?.name}</p>
                        </div>
                    </div>
                </div>
                {/* Game Details */}
                <div className='bg-white px-9 md:px-16 pt-[35px]'>
                    <div className='border-b border-f2f2f2 pb-[30px]'>
                        <p className='font-general font-medium text-sm md:text-base text-1c0e0eb3'>Game Details</p>
                        <div className='flex items-center gap-1 my-[20px]'>
                            <span><img src={CalendarIcon} alt="calendar icon " /> </span>
                            <p className='font-general font-medium text-xs md:text-sm text-383838'> {parseTimeStampForDateLongMonth(GameDetails?.data?.data?.game?.date)}</p>
                        </div>
                        <div className='flex items-center gap-2'>
                            <p className='font-general font-medium text-sm md:text-base text-383838'>{setGameTime(GameDetails?.data?.data?.game?.time?.startTime)} IST</p>
                            <p className='font-general font-medium text-sm md:text-base text-383838'>to</p>
                            <p className='font-general font-medium text-sm md:text-base text-383838'>{setGameTime(GameDetails?.data?.data?.game?.time?.endTime)} IST</p>
                        </div>
                    </div>
                </div>
                {/* Venue Details */}
                <div className='bg-white px-9 md:px-16 pt-[35px]'>
                    <div className='border-b border-f2f2f2 pb-[30px]'>
                        <p className='font-general font-medium text-sm md:text-base text-1c0e0eb3 mb-3'>Venue</p>
                        <p className='font-author font-medium text-383838 text-2xl md:text-[34px] capitalize'>{formatVenueName(GameDetails?.data?.data?.game?.gameLocation?.handle)}</p>
                        <div className='flex items-center justify-between mt-2'>
                            <div className='flex items-center gap-0'>
                                <img src={Location} alt="location" className='w-[20px] h-[20px] mr-2 ' />
                                <p className='font-general font-medium text-sm md:text-base text-1c0e0eb3 md:text-1c0e0e max-w-[210px] capitalize'>{formatAddress(GameDetails?.data?.data?.game?.gameLocation?.address)}</p>
                            </div>
                            <div onClick={handleMapClick} className='cursor-pointer'>
                                <span className="w-6 h-6 ml-auto block">
                                    <img src={MapIcon} alt="map-icon" className="w-6 h-6 " />
                                </span>
                                <p className="font-medium font-general text-sm text-244cb4 underline max-md:text-[12px]">Map View</p>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Creator's Player Details and invite players */}
                {isCreator && (
                    // Joined Players
                    <div className='bg-white px-9 md:px-16 pt-[35px]'>
                        <div className='border-b border-f2f2f2 pb-[30px]'>
                            <div className='flex items-center justify-between mb-[20px]'>
                                <p className='font-general font-medium text-sm md:text-base text-1c0e0eb3'>Players</p>
                                <p className='font-general font-medium text-[10px] md:text-xs text-383838 opacity-70'>
                                    {acceptedPlayers.length}/{GameDetails?.data?.data?.game?.maxPlayers} Joined
                                </p>
                            </div>
                            <div className='flex flex-wrap gap-5'>
                                {acceptedPlayers.length > 0 &&
                                    acceptedPlayers.map((player) => (
                                        <div key={player?.playerDetails?._id} className="flex flex-col items-center justify-center gap-2">
                                            <img
                                                src={player?.playerDetails?.profilePic || DummyProfileImage}
                                                alt="profile-image"
                                                className="w-10 h-10 rounded-full"
                                            />
                                            <p className="font-general font-medium text-xs md:text-sm text-383838">
                                                {player?.playerDetails?._id === playerID ? "You" : player?.playerDetails?.name}
                                            </p>
                                        </div>
                                    ))
                                }

                            </div>
                        </div>
                        <div className='pt-[35px] border-b border-f2f2f2 pb-[30px]'>
                            <p className='font-general font-medium text-sm md:text-base text-1c0e0eb3 capitalize mb-5'>invited players</p>
                            <InvitedPlayers players={invitedPlayers} playerID={playerID} handleRemovePlayer={handleRemovePlayer} isGameDatePast={isGameDatePast} />
                            <GamePartnerSearch handleInvitePlayer={handleInvitePlayer} isGameDatePast={isGameDatePast} />
                            <ShareGame playerName={playerName} isGameDatePast={isGameDatePast} />
                            <SetGamePublic userID={playerID} handle={handle} initialVisibility={GameDetails?.data?.data?.game?.visibility} isGameDatePast={isGameDatePast} />
                            <div className='flex items-center justify-between flex-wrap mt-6 gap-2'>
                                <div className='md:max-w-[241px] max-w-full'>
                                    <p className='font-author font-medium text-383838 text-2xl'>Let the Community know</p>
                                    <p className='font-general font-medium text-xs md:text-sm text-383838 opacity-70'>Public games can be shared with the community with just a tap</p>
                                </div>
                                <div>
                                    <CommunityButton enableLoader={true} buttonTitle={'Share On Your Feed'} handleCommunityButtonClick={handleCreateGamePost} buttonTitleStyle={`min-w-[190px] font-general font-medium text-383838 cursor-pointer text-sm md:text-base py-2 h-[52px] flex items-center justify-center px-[30px] md:px-3 md:py-5 md:px-6 border border-383838 rounded-3xl ${isGameDatePast ? 'opacity-50 pointer-events-none' : ''}`} />
                                </div>
                            </div>
                            <Popup isOpen={isOpen} className='bg-[#0000007a] inset-0 z-20 fixed grid place-items-center' handleViewOpen={handleViewOpen}>
                                <motion.div transition={{ delay: 0, duration: 0.4 }}
                                    initial={{ opacity: 0, x: '50px', y: 0 }}
                                    animate={{ opacity: 1, x: '0px', y: 0 }}
                                    exit={{ opacity: 0, x: '0px', y: '50px' }} className="relative bg-ffffff w-full max-w-[344px] md:max-w-[536px] rounded-[30px]" onClick={(e) => e.stopPropagation()}>
                                    <div className='rounded-[20px] overflow-hidden'>
                                        <div className='relative'>
                                            <img src={InviteSend} alt="Invite Send" className="w-full h-auto inline-block " />
                                            <img src={InviteSendIcon} alt="Invite Send Icon" className="w-[67px] h-auto inline-block absolute top-[37px] md:top-[72px] right-[146px] md:right-[235px] " />
                                        </div>
                                        <div className='h-[200px] flex items-center justify-center flex-col'>
                                            <p className='font-general font-medium text-383838 text-[20px]'>Invitation Sent!</p>
                                            <p className='max-w-[352px] text-center font-general font-medium text-xs md:text-sm text-383838 opacity-70'>{`${inivitedPlayerDetails.name} has been notified. We will let you know when they accept the invite!`}</p>
                                        </div>
                                    </div>
                                </motion.div>
                            </Popup>
                            <button className='bg-383838 w-full text-center text-sm md:text-base text-f0f0f0 rounded-2xl p-3 md:p-4 my-7 cursor-pointer' onClick={() => navigate('/account')}>Continue</button>
                            <button className={`bg-383838 w-full text-center text-sm md:text-base text-f0f0f0 rounded-2xl p-3 md:p-4 cursor-pointer ${isGameDatePast ? 'opacity-50 pointer-events-none' : ''}`} onClick={handleGameDelete}>Delete Game</button>
                        </div>
                    </div>
                )}
                {/* player's join game */}
                {!isCreator && (
                    <div className='bg-white px-9 md:px-16 pt-[35px]'>
                        <div className='border-b border-f2f2f2 pb-[30px]'>
                            {isLoggedIn && <>
                                <div className='flex items-center justify-between mb-[20px]'>
                                    <p className='font-general font-medium text-sm md:text-base text-1c0e0eb3'>Players</p>
                                    <p className='font-general font-medium text-[10px] md:text-xs text-383838 opacity-70'>
                                        {acceptedPlayers.length}/{GameDetails?.data?.data?.game?.maxPlayers} Joined
                                    </p>
                                </div>
                                <div className='flex flex-col gap-5 mb-7 md:mb-10'>
                                    {acceptedPlayers.length > 0 && acceptedPlayers.map((player) => (
                                        <div key={player?.playerDetails?._id} className="flex items-center justify-start gap-4 w-full border border-e1e1e1 rounded-[20px] p-3 md:p-5">
                                            <img
                                                src={player?.playerDetails?.profilePic || DummyProfileImage}
                                                alt="profile-image"
                                                className="w-10 h-10 rounded-full"
                                            />
                                            <div className='flex items-start gap-0 flex-col'>
                                                <p className="font-general font-medium text-sm md:text-base text-383838 capitalize">
                                                    {player?.playerDetails?.name}
                                                    {GameDetails?.data?.data?.game?.creatorId === player?.playerDetails?._id && <span className='text-[green] text-xs md:text-sm font-general font-medium'> (Host)</span>}
                                                </p>
                                                {isLoggedIn && player?.playerDetails?.phone && <>
                                                    <div className='flex items-center'>
                                                        <img src={WhatsappIcon} alt="Whatsapp Icon" className='w-4 h-auto inline-block ' />
                                                        <p className='font-general font-medium text-xs md:text-sm text-383838 opacity-70 ml-2'>{player?.playerDetails?.phone}</p>
                                                    </div>
                                                    {/* <p className="font-general font-medium text-sm md:text-base text-383838">{player?.playerDetails?.phone}</p> */}
                                                </>}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </>}
                            {acceptedPlayers.some(player => player.playerDetails?._id === playerID) ? (
                                <button
                                    className={`capitalize cursor-pointer w-full font-general font-medium text-sm md:text-base text-383838 bg-white border border-383838 rounded-3xl md:w-full py-5 mx-auto flex justify-center items-center ${isGameDatePast ? 'opacity-50 pointer-events-none' : ''}`}
                                    onClick={handleLeaveGame}
                                >
                                    Leave game
                                </button>
                            ) : (
                                <button
                                    className={`capitalize w-full cursor-pointer font-general font-medium text-sm md:text-base text-white bg-383838 rounded-3xl md:w-full py-5 mx-auto flex justify-center items-center ${isGameDatePast ? 'opacity-50 pointer-events-none' : ''}`}
                                    onClick={handleJoinGame}
                                >
                                    Join game
                                </button>
                            )}
                        </div>
                    </div>
                )}
                {/* Terms & Conditions */}
                <div className='bg-white px-9 md:px-16 pt-[35px]'>
                    <div className='max-w-[340px] mx-auto pb-30'>
                        <div
                            className='flex items-center justify-between w-full mb-10 cursor-pointer'
                            onClick={() => navigate('/pages/guidelines')}
                        >
                            <p className='text-xs md:text-sm font-general font-medium text-383838'>Picklebay Guidelines</p>
                            <img src={DownArrow} alt="Down Arrow" className='w-[25px] h-[25px] inline-block mr-[6px] rotate-270 ' />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default GameDetails
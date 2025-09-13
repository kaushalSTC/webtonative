import React from 'react'
import { DummyProfileImage, WhatsappIcon, DeleteIcon } from '../../assets'

const InvitedPlayers = ({ players, playerID, handleRemovePlayer, isGameDatePast = false }) => {
    
    const handleRemovePlayerClick = (playerId) => {
        handleRemovePlayer(playerId);
    }
    if (!players) return null

    return (
        <div>
            {players.filter(player => player.playerId !== playerID).map(player => (
                <div key={player.playerId} className='flex items-center gap-3 mb-8'>
                    <div>
                        <img src={player?.playerDetails?.profilePic || DummyProfileImage} alt="profile-image" className='w-15 h-15 rounded-full '/>
                    </div>
                    <div>
                        <p className='font-general font-medium text-sm md:text-base text-383838'>{player?.playerDetails?.name}</p>
                        <p className='font-general font-medium text-xs md:text-sm text-383838 opacity-70'>{player?.status}</p>
                        {player?.status === 'ACCEPTED' && (
                            <div className='flex items-center'>
                                <img src={WhatsappIcon} alt="Whatsapp Icon" className='w-4 h-auto inline-block '/>
                                <p className='font-general font-medium text-xs md:text-sm text-383838 opacity-70 ml-2'>{player?.playerDetails?.phone}</p>
                            </div>
                        )}
                    </div>
                    <div className={`ml-auto ${isGameDatePast ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
                        <img src={DeleteIcon} alt="Delete Icon" className='w-9 h-auto inline-block cursor-pointer' onClick={() => handleRemovePlayerClick(player.playerId)} />
                    </div>
                </div>
            ))}
        </div>
    )
}

export default InvitedPlayers
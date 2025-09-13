import React from 'react'
import { TournamentGridImage } from '../../assets'

const TournamentGridCard = () => {
    return (
        <div className='aspect-[360/404] overflow-hidden max-h-[435px]'>
            <img src={TournamentGridImage} alt="tournament-grid-card" className="w-auto h-full object-cover "/>
        </div>
    )
}

export default TournamentGridCard
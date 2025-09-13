import React from 'react'
import { Calendar, Clock, DummyProfileImage, Location } from '../../assets'
import { convertTo12HourFormat, parseTimeStampForDateLongMonth } from '../../utils/utlis'
import { nanoid } from 'nanoid'
import { Link } from 'react-router'

const DraftGameCards = ({ game }) => {
  return (
    <div className='bg-white rounded-3xl p-5 shadow-level-1 m-2'>
      <p className='font-general md:font-author font-semibold md:font-medium text-383838 text-sm md:text-2xl capitalize line-clamp-1 mb-4'>{game.name}</p>
      <div className="flex flex-nowrap items-center border-y border-dbe0fc justify-center mb-5">
        <div className="flex flex-nowrap items-center gap-1">
          <img src={Clock} alt="clock" className="w-auto h-[14px] object-cover" loading='lazy' />
          <p className="font-general font-medium text-383838 opacity-70 text-xs md:text-sm">
            {convertTo12HourFormat(game?.time?.startTime)} IST
          </p>
        </div>
        <div className="flex flex-nowrap items-center gap-1 border-x border-dbe0fc py-1 px-2 mx-3">
          <img src={Calendar} alt="Calendar" className="w-auto h-[14px] object-cover" loading='lazy' />
          <p className="font-general font-medium text-383838 opacity-70 text-xs md:text-sm">
            {parseTimeStampForDateLongMonth(game?.date)}
          </p>
        </div>
        <div className="flex flex-nowrap items-center gap-1">
          <img src={Location} alt="Location" className="w-auto h-[17px]" loading='lazy' />
          <p className="font-general font-medium text-383838 opacity-70 text-xs md:text-sm">
            {game?.gameLocation?.address?.city}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex flex-col items-start justify-start gap-1">
          <div className="flex flex-row items-center justify-start">
            {game?.players?.slice(0, 2).map((player, index) => (
              <img
                key={nanoid()}
                src={player?.playerDetails?.profilePic || DummyProfileImage}
                alt="Profile Picture"
                className={`${index > 0 ? '-ml-3.5' : ''} w-9 h-9 border-2 border-ffffff mb-0.5 rounded-full shadow aspect-square grid place-items-center`}
                loading="lazy"
              />
            ))}

            {game?.currentPlayers > 2 && (
              <p className="font-general font-medium text-383838 text-size-10 opacity-70">
                +{game?.currentPlayers - 2} players
              </p>
            )}
          </div>
        </div>
        <Link to={`/games/${game?.handle}/score`}>
          <button className='font-general font-medium text-xs md:text-sm text-244cb4 underline'>Update Score</button>
        </Link>
      </div>
    </div>
  )
}

export default DraftGameCards
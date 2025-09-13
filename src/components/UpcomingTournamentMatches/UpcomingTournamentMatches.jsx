import React, { useState } from 'react'
import { useSelector } from 'react-redux';
import { useParams } from 'react-router';
import { useGetUpcomingMatches } from '../../hooks/PlayerHooks';
import { DefaultProfileImage, Location } from '../../assets';
import Drawer from '../Drawer/Drawer';
import { formatDateStringForLive } from '../../utils/utlis';

const UpcomingTournamentMatches = () => {
  const playerID = useSelector((state) => state.player.id);
  const isLoggedIn = useSelector((state)=> state.auth.isLoggedIn);
  const { handle } = useParams();
  const { data: Matches, isLoading, isError } = useGetUpcomingMatches({ playerID, tournamentHandle: handle });
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  if(!isLoggedIn) {
    return null;
  }
  
  if (isLoading) {
    return (
      <div className='px-9 md:px-20 bg-white'>
        <div className='h-[20px] w-[250px] animate-pulse mb-2 bg-f2f2f2'></div>
        <div className='w-full animate-pulse h-[250px] bg-f2f2f2'></div>
      </div>
    )
  }

  if(isError) {
    return (
      <div className='px-9 md:px-20 bg-white'>
        <p className='font-general font-medium text-sm md:text-base text-1c0e0eb3 md:text-383838 capitalize pl-2 mb-6 opacity-70'>Your Upcoming Matches</p>
        <p className='font-general font-medium text-sm text-center md:text-base text-[#9CA3AF] pl-2 bg-gray-100 border border-[#E5E7EB] rounded-lg p-4'>There are no Upcoming Matches for this Tournament</p>
      </div>
    )
  } 

  const handleDrawerOpen = (value) => {
    setIsDrawerOpen(value);
  }

  // Render a single match card
  const renderMatchCard = (match, index) => (
    <div
      key={index}
      className="rounded-2xl border border-f0f0f0 p-5 pb-0 shadow"
    >
      <div className="flex items-center justify-between">
        <p className="font-general font-medium text-[10px] md:text-xs text-383838 bg-abe400 rounded-xl py-1 px-2">
          {match.categoryName}
        </p>
        <div className="flex items-center justify-end gap-2">
          {/* <p className='font-general font-medium text-383838 opacity-70 text-xs md:text-sm'>Round {match.round_id + 1}</p> */}
          <p className="font-general font-medium text-383838 text-xs md:text-sm">
            {match.date !== "Date TBD"
              ? formatDateStringForLive(match.date)
              : match.date}
          </p>
        </div>
      </div>
      <div className="divide-y divide-f0f0f0 flex flex-col">
        {match.opponent1 ? (
          <div className="py-4">
            {match?.opponent1?.players?.map((player, playerIndex) => (
              <div
                key={playerIndex}
                className="flex items-center justify-start gap-4"
              >
                <div className="rounded-full overflow-hidden">
                  <img
                    src={player.profilePic || DefaultProfileImage}
                    alt="player profile image"
                    className="w-[72px] h-[72px]"
                  />
                </div>
                <div>
                  <p className="font-general font-medium text-sm md:text-base text-244cb4">
                    {player.name}
                  </p>
                  <p className="font-general font-medium text-xs md:text-sm text-383838 opacity-70">
                    {match.groupName}
                  </p>
                </div>
              </div>
            ))}
            {match?.opponent1?.teams?.map((team, playerIndex) => (
              <div
                key={playerIndex}
                className="flex items-center justify-start gap-4"
              >
                <div className="rounded-full overflow-hidden">
                  <img
                    src={team.teamLogo || DefaultProfileImage}
                    alt="player profile image"
                    className="w-[72px] h-[72px]"
                  />
                </div>
                <div>
                  <p className="font-general font-medium text-sm md:text-base text-244cb4">
                    {team.name}
                  </p>
                  <p className="font-general font-medium text-xs md:text-sm text-383838 opacity-70">
                    {match.groupName}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="px-4 flex items-center justify-start gap-4">
            <img
              src={DefaultProfileImage}
              alt="default image"
              className="w-[72px] h-[72px]"
            />
            <p>{match.round_id === 0 ? "BYE" : "TBD"}</p>
          </div>
        )}
        <div className="py-4">
          {match.opponent2 ? (
            <div>
              {match?.opponent2.players?.map((player, playerIndex) => (
                <div
                  key={playerIndex}
                  className="flex items-center justify-start gap-4"
                >
                  <div className="rounded-full overflow-hidden">
                    <img
                      src={player.profilePic || DefaultProfileImage}
                      alt="player profile image"
                      className="w-[72px] h-[72px]"
                    />
                  </div>
                  <div>
                    <p className="font-general font-medium text-sm md:text-base text-244cb4">
                      {player.name}
                    </p>
                    <p className="font-general font-medium text-xs md:text-sm text-383838 opacity-70">
                      {match.groupName}
                    </p>
                  </div>
                </div>
              ))}
              {match?.opponent2?.teams?.map((team, playerIndex) => (
                <div
                  key={playerIndex}
                  className="flex items-center justify-start gap-4"
                >
                  <div className="rounded-full overflow-hidden">
                    <img
                      src={team.teamLogo || DefaultProfileImage}
                      alt="player profile image"
                      className="w-[72px] h-[72px]"
                    />
                  </div>
                  <div>
                    <p className="font-general font-medium text-sm md:text-base text-244cb4">
                      {team.name}
                    </p>
                    <p className="font-general font-medium text-xs md:text-sm text-383838 opacity-70">
                      {match.groupName}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="px-4 flex items-center justify-start gap-4">
              <img
                src={DefaultProfileImage}
                alt="default image"
                className="w-[72px] h-[72px]"
              />
              <p>{match.round_id === 0 ? "BYE" : "TBD"}</p>
            </div>
          )}
        </div>
        <div
          className={` ${
            match?.categoryLocationName || match?.categoryLocationCity
              ? "my-4 flex items-center justify-between divide-f0f0f0 divide-x"
              : "hidden"
          }`}
        >
          <div className="flex items-baseline gap-1 w-[50%]">
            <img
              src={Location}
              alt="location-icon"
              className={`w-4 h-4 mt-1 ${
                match?.categoryLocationName || match?.categoryLocationCity
                  ? ""
                  : "hidden"
              }`}
            />
            <div className="flex flex-col">
              <p className="font-general font-medium text-xs md:text-sm text-383838">
                {match?.categoryLocationName}
              </p>
              <p className="font-general font-medium text-xs md:text-sm text-383838 opacity-70 ">
                {match?.categoryLocationCity}
              </p>
            </div>
          </div>
          <div>
            <p className="font-general font-medium text-xs md:text-sm text-383838">
              {match?.metaData?.time?.startTime} IST
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className='bg-white px-9 md:px-20'>
      <p className='font-general font-medium text-sm md:text-base text-1c0e0eb3 md:text-383838 capitalize pl-2 mb-6 opacity-70'>Your Upcoming Matches</p>
      {(!Matches || Matches.length === 0) ? (
        <p className='font-general font-medium text-sm text-center md:text-base text-[#9CA3AF] pl-2 bg-gray-100 border border-[#E5E7EB] rounded-lg p-4'>There are no Upcoming Matches for this Tournament</p>
      ) : (
        <div className='flex flex-col gap-4'>
          {/* Show only first two matches */}
          {Matches.slice(0, 2).map((match, index) => renderMatchCard(match, index))}

          {/* Show View More button if there are more than 2 matches */}
          {Matches.length > 2 && (
            <button
              onClick={() => handleDrawerOpen(true)}
              className='mt-2 py-2 px-4 text-244cb4 font-general font-medium text-sm underline hover:bg-opacity-90 transition-all'
            >
              View More
            </button>
          )}
        </div>
      )}

      {/* Drawer with all matches */}
      <Drawer
        isDrawerOpen={isDrawerOpen}
        handleDrawerOpen={handleDrawerOpen}
        className='bg-[#0000007a] inset-0 z-20 fixed bg-black-100 bg-opacity-50'
      >
        <div className='bg-white w-full md:w-3/4 lg:w-1/2 h-full absolute right-0 overflow-y-auto p-6 mt-[70px] pb-[100px]'>
          <div className='flex justify-between items-center mb-4'>
            <h3 className='font-general font-medium text-sm md:text-base text-1c0e0eb3 md:text-383838 capitalize pl-2 opacity-70'>All Upcoming Matches</h3>
            <button
              onClick={() => handleDrawerOpen(false)}
              className='text-383838 hover:text-244cb4'
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className='flex flex-col gap-4'>
            {Matches?.map((match, index) => renderMatchCard(match, index))}
          </div>
        </div>
      </Drawer>
    </div>
  )
}

export default UpcomingTournamentMatches
import { useNavigate } from 'react-router';
import { BallWhite, ClockWhite, ProfileActivity, TrophyWhite } from '../../assets';
import { isObjectEmpty } from '../../utils/utlis';
import Button from '../Button/Button';
import { useActivitySummary } from '../../hooks/PlayerHooks';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';

const ActivitySummary = () => {
  const navigate = useNavigate();
  const playerID = useSelector((state) => state.player.id);
  let { data: activityData, isLoading, isError } = useActivitySummary(playerID);
  
  if (isError || !activityData) return null;    

  if (!activityData  || isObjectEmpty(activityData) || (activityData.totalTournamentsPlayed == 0 && activityData.totalCreatedGames == 0 && activityData.totalJoinedGames == 0 )) {
    return (
      <>
        <div className="w-full h-[2px] md:h-[10px] bg-f2f2f2 mb-[30px]"></div>
        <div className="px-[33px] md:px-[73px] pb-[30px]">
          <div>
            <img src={ProfileActivity} alt="profile-activity" className="w-[11px] h-[15px] inline-block mr-[6px] "/>
            <span className="font-general font-medium text-sm md:text-base text-1c0e0eb3 capitalize inline">
              Activity Summary
            </span>
          </div>
          <p className="font-general font-medium text-xs md:text-sm opacity-60 md:opacity-80 text-1c0e0eb3 capitalize mt-1">
            You Haven&apos;t Played Any Games Yet!
          </p>
          <Button
            onClick={() => navigate('/games')}
            className="font-general font-medium text-sm md:text-base text-383838 w-full max-w-[568px] bg-f4f5ff border border-dbe0fc py-[18px] rounded-[38px] mt-[8px] md:mt-[20px] cursor-pointer"
          >
            Explore Games
          </Button>
        </div>
      </>
    );
  }

  return (
    <div>
      <div className="w-full h-[2px] md:h-[10px] bg-white mb-[30px]"></div>
      <div className="px-[33px] md:px-[73px] pb-[30px]">
        <div>
          <img src={ProfileActivity} alt="profile-activity" className="w-[11px] h-[15px] inline-block mr-[6px] "/>
          <span className="font-general font-medium text-sm md:text-base text-1c0e0eb3 capitalize inline">
            Activity Summary
          </span>
        </div>
        <p className="font-general font-medium text-xs md:text-sm opacity-60 md:opacity-80 text-1c0e0eb3 capitalize mt-1">
          You Haven&apos;t Played Any Games Yet!
        </p>

        <div className="rounded-r-20 bg-ffffff shadow mt-5 px-[11px] py-3.5 flex md:inline-flex flex-col gap-2.5">
          <p className="font-general font-medium text-xs md:text-sm opacity-70 text-383838 capitalize mt-1">
            Player Stats
          </p>

          <div className="w-full flex flex-row gap-3 overflow-x-auto rounded-r-15">
            {(activityData.totalJoinedGames > 0 || activityData.totalCreatedGames > 0 || activityData.totalTournamentsPlayed > 0) && <div className="w-[32%] min-w-[130px] md:w-[33.33333%] md:min-w-[150px] rounded-r-15 bg-383838 text-ffffff h-full min-h-[155px] p-3 flex flex-col items-start justify-between">
              <img src={BallWhite} alt="White" className='w-5 h-auto '/>
              <div className="flex flex-col gap-2">
                <p className="text-f2f2f2 font-general font-medium text-2xl">{activityData.totalJoinedGames}</p>
                <p className="text-f2f2f2 font-general text-sm">Games Joined</p>
              </div>
            </div>}
            {(activityData.totalJoinedGames > 0 || activityData.totalCreatedGames > 0 || activityData.totalTournamentsPlayed > 0)> 0 && <div className="w-[32%] min-w-[130px] md:w-[33.33333%] md:min-w-[150px] rounded-r-15 bg-244cb4 text-ffffff h-full min-h-[155px] p-3 flex flex-col items-start justify-between">
              <img src={ClockWhite} alt="White" className='w-5 h-auto '/>
              <div className="flex flex-col gap-2">
                <p className="text-f2f2f2 font-general font-medium text-2xl">{activityData.totalCreatedGames}</p>
                <p className="text-f2f2f2 font-general text-sm">Games Created</p>
              </div>
            </div>}
            {(activityData.totalJoinedGames > 0 || activityData.totalCreatedGames > 0 || activityData.totalTournamentsPlayed > 0) && <div className="w-[32%] min-w-[130px] md:w-[33.33333%] md:min-w-[150px] rounded-r-15 bg-56b918 text-ffffff h-full min-h-[155px] p-3 flex flex-col items-start justify-between">
              <img src={TrophyWhite} alt="White" className='w-5 h-auto '/>
              <div className="flex flex-col gap-2">
                <p className="text-f2f2f2 font-general font-medium text-2xl">{activityData.totalTournamentsPlayed}</p>
                <p className="text-f2f2f2 font-general text-sm">Tournaments Played</p>
              </div>
            </div>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivitySummary;

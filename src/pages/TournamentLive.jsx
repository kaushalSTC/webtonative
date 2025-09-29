import { useParams } from 'react-router'
import { useTournamentByHandleQuery } from '../hooks/TournamentHooks';
import TournamentDetailSwiper from '../components/Tournament/TournamentDetailSwiper/TournamentDetailSwiper';
import TournamentLiveInfo from '../components/TournamentLive/TournamentLiveInfo/TournamentLiveInfo';
import TournamentLiveCategories from '../components/TournamentLive/TournamentLiveCategories/TournamentLiveCategories';
import UpcomingTournamentMatches from '../components/UpcomingTournamentMatches/UpcomingTournamentMatches';
import TournamentSponsors from '../components/Tournament/TournamentSponsors/TournamentSponsors';
import TournamentGallery from '../components/Tournament/TournamentGallery/TournamentGallery';
import { ValidPlatforms } from '../constants';
import { useSelector } from 'react-redux';

const TournamentLive = () => {
  const { handle } = useParams();
  const {data: tournamentData, isLoading, isError } = useTournamentByHandleQuery(handle)
  const { platform } = useSelector((state)=> state.wtn);

  if(!isLoading && (isError || !tournamentData?.tournament)) {
    return <div>
      <div className='w-full flex items-center justify-center max-w-[700px] mx-auto bg-f2f2f2 p-4 h-[500px]'>
        <p className='font-general font-medium text-383838 text-sm md:text-base text-center'>No Tournament info found at this moment</p> 
      </div>
    </div>
  }

  if (isLoading) {
    return <div>
      <div className='w-full flex items-center justify-center max-w-[700px] mx-auto bg-f2f2f2 p-4 h-[500px] animate-pulse'>
      </div>
    </div>
  }

  const components = [
  { Component: TournamentDetailSwiper, data: tournamentData?.tournament },
  { Component: TournamentLiveInfo, data: tournamentData?.tournament },
  { Component: UpcomingTournamentMatches, data: true }, 
  { Component: TournamentLiveCategories, data: tournamentData?.tournament },
  { Component: TournamentSponsors, data: tournamentData?.tournament },
  { Component: TournamentGallery, data: tournamentData?.tournament },
];
  
  return (
    <div className='w-full mx-auto bg-f2f2f2'>
      <div className="max-w-[720px] mx-auto relative">
        {components.map((item, index) => {
      const isLast = index === components.length - 1;
      const applyMargin = isLast && ValidPlatforms.includes(platform);

      return (
        <div
          key={index}
          className={applyMargin ? "mb-[5vh]" : ""}
        >
          <item.Component tournament={tournamentData?.tournament} />
        </div>
      );
    })}
      </div>
    </div>
  )
}

export default TournamentLive
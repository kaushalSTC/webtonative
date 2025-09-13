import { useParams } from 'react-router'
import { useTournamentByHandleQuery } from '../hooks/TournamentHooks';
import TournamentDetailSwiper from '../components/Tournament/TournamentDetailSwiper/TournamentDetailSwiper';
import TournamentLiveInfo from '../components/TournamentLive/TournamentLiveInfo/TournamentLiveInfo';
import TournamentLiveCategories from '../components/TournamentLive/TournamentLiveCategories/TournamentLiveCategories';
import UpcomingTournamentMatches from '../components/UpcomingTournamentMatches/UpcomingTournamentMatches';
import TournamentSponsors from '../components/Tournament/TournamentSponsors/TournamentSponsors';
import TournamentGallery from '../components/Tournament/TournamentGallery/TournamentGallery';

const TournamentLive = () => {
  const { handle } = useParams();
  const {data: tournamentData, isLoading, isError } = useTournamentByHandleQuery(handle)

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
  
  return (
    <div className='w-full mx-auto bg-f2f2f2'>
      <div className="max-w-[720px] mx-auto relative">
        <TournamentDetailSwiper tournament={tournamentData?.tournament} />
        <TournamentLiveInfo tournament={tournamentData?.tournament} />
        <UpcomingTournamentMatches />
        <TournamentLiveCategories tournament={tournamentData?.tournament}/>
        <TournamentSponsors tournament={tournamentData?.tournament}/>
        <TournamentGallery tournament={tournamentData?.tournament}/>
      </div>
    </div>
  )
}

export default TournamentLive
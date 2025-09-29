import { useParams } from "react-router";
import TournamentDetailSwiper from "../components/Tournament/TournamentDetailSwiper/TournamentDetailSwiper";
import TournamentLiveInfo from "../components/TournamentLive/TournamentLiveInfo/TournamentLiveInfo";
import TournamentLiveCategories from "../components/TournamentLive/TournamentLiveCategories/TournamentLiveCategories";
import UpcomingTournamentMatches from "../components/UpcomingTournamentMatches/UpcomingTournamentMatches";
import TournamentSponsors from "../components/Tournament/TournamentSponsors/TournamentSponsors";
import TournamentGallery from "../components/Tournament/TournamentGallery/TournamentGallery";
import { useEventByHandleQuery } from "../hooks/SocialEventHooks";
const SocialEventLive = () => {
  const { handle } = useParams();
  const { data: eventData, isLoading, isError } = useEventByHandleQuery(handle);

  if (!isLoading && (isError || !eventData?.event)) {
    return (
      <div>
        <div className="w-full flex items-center justify-center max-w-[700px] mx-auto bg-f2f2f2 p-4 h-[500px]">
          <p className="font-general font-medium text-383838 text-sm md:text-base text-center">
            No Event info found at this moment
          </p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div>
        <div className="w-full flex items-center justify-center max-w-[700px] mx-auto bg-f2f2f2 p-4 h-[500px] animate-pulse"></div>
      </div>
    );
  }
  
  return (
    <div className="w-full mx-auto bg-f2f2f2">
      <div className="max-w-[720px] mx-auto relative">
        <TournamentDetailSwiper tournament={eventData?.event?.tournamentData} />
        <TournamentLiveInfo tournament={eventData?.event?.tournamentData} />
        <UpcomingTournamentMatches />
        <TournamentLiveCategories
          tournament={eventData?.event?.tournamentData}
        />
        <TournamentSponsors tournament={eventData?.event?.tournamentData} />
        <TournamentGallery tournament={eventData?.event?.tournamentData} />
      </div>
    </div>
  );
};

export default SocialEventLive;

import { useState } from 'react'
import { TournamentLiveTabs } from '../../../constants';
import TournamentLiveResults from '../TournamentLiveResults/TournamentLiveResults';
import TournamentLiveStandings from '../TournamentLiveStandings/TournamentLiveStandings';
import TournamentLiveSchedule from '../TournamentLiveSchedule/TournamentLiveSchedule';

const TournamentLiveData = ({ Fixtures, Schedule, EventFormat }) => {
  const [selectedTab, setSelectedTab] = useState(TournamentLiveTabs[0]);
  return (
    <div>
      <div className='w-full flex items-center justify-between border-b border-b-1c4ba3 bg-white px-9 md:px-20'>
        {TournamentLiveTabs.map((tab) => {
          return (
            <button key={tab} className={`${selectedTab === tab ? 'border-b-1c4ba3 border-b-2' : '' } font-general font-medium text-sm md:text-base text-383838`} onClick={() => setSelectedTab(tab)}>{tab}</button>
          )
        })}
      </div>
      {selectedTab === 'Schedule' && <TournamentLiveSchedule Schedule={Schedule} EventFormat={EventFormat} />}
      {selectedTab === 'Results' && <TournamentLiveResults fixtures={Fixtures} EventFormat={EventFormat} />}
      {selectedTab === 'Standings' && <TournamentLiveStandings fixtures={Fixtures} EventFormat={EventFormat} />}
    </div>
  )
}

export default TournamentLiveData
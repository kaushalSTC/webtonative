import React from 'react'
import SingleEliminationStanding from './SingleEliminationStanding';
import RoundRobinStanding from './RoundRobinStanding';
import DoubleEliminationStanding from './DoubleEliminationStanding';

const TournamentStandingGenerator = ({ fixture, handleDropdownToggle, EventFormat }) => {
  const fixtureFormat = fixture.format;
  switch (fixtureFormat) {
    case 'SE':
      return <SingleEliminationStanding fixture={ fixture } handleDropdownToggle={handleDropdownToggle} EventFormat={EventFormat} />
    case 'RR': 
      return <RoundRobinStanding fixture={ fixture } handleDropdownToggle={handleDropdownToggle} EventFormat={EventFormat} />
    case 'DE': 
      return <DoubleEliminationStanding fixture={ fixture } handleDropdownToggle={handleDropdownToggle} EventFormat={EventFormat} />
  }
}

export default TournamentStandingGenerator 
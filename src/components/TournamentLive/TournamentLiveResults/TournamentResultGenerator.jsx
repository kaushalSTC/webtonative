import React from 'react'
import SingleEliminationResult from './SingleEliminationResult';
import DoubleEliminationResult from './DoubleEliminationResult';
import RoundRobinEliminationResults from './RoundRobinEliminationResults';

const TournamentResultGenerator = ({ fixture, handleDropdownToggle, EventFormat }) => {
  const fixtureFormat = fixture.format;

  switch (fixtureFormat) {
    case 'SE':
      return <SingleEliminationResult fixture={ fixture } handleDropdownToggle={handleDropdownToggle} EventFormat={EventFormat} />
    case 'DE':
      return <DoubleEliminationResult fixture={ fixture } handleDropdownToggle={handleDropdownToggle} EventFormat={EventFormat} />
    case 'RR':
      return <RoundRobinEliminationResults fixture={ fixture } handleDropdownToggle={handleDropdownToggle} EventFormat={EventFormat} />
  }

}

export default TournamentResultGenerator
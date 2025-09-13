import React from "react";
import SingleEliminationSchedule from "./SingleEliminationSchedule";
import DoubleEliminationSchedule from "./DoubleEliminationSchedule";
import DoubleEliminationLeagueSchedule from "./DoubleEliminationLeagueSchedule";
import RoundRobinSchedule from "./RoundRobinSchedule";
import RoundRobinLeagueSchedule from "./RoundRobinLeagueSchedule";
import SingleEliminationLeagueSchedule from "./SingleEliminationLeagueSchedule";
const TournamentScheduleGenerator = ({
  Schedule,
  handleDropdownToggle,
  EventFormat,
}) => {
  const fixtureFormat = Schedule.fixtureFormat;

  switch (fixtureFormat) {
    case "SE":
      return EventFormat === "LEAGUE" ? (
        <SingleEliminationLeagueSchedule
          Schedule={Schedule}
          handleDropdownToggle={handleDropdownToggle}
          EventFormat={EventFormat}
        />
      ) : (
        <SingleEliminationSchedule
          Schedule={Schedule}
          handleDropdownToggle={handleDropdownToggle}
          EventFormat={EventFormat}
        />
      );
    case "DE":
      return EventFormat === "LEAGUE" ? (
        <DoubleEliminationLeagueSchedule
          Schedule={Schedule}
          handleDropdownToggle={handleDropdownToggle}
          EventFormat={EventFormat}
        />
      ) : (
        <DoubleEliminationSchedule
          Schedule={Schedule}
          handleDropdownToggle={handleDropdownToggle}
          EventFormat={EventFormat}
        />
      );
    case "RR":
      return EventFormat === "LEAGUE" ? (
        <RoundRobinLeagueSchedule
          Schedule={Schedule}
          handleDropdownToggle={handleDropdownToggle}
        />
      ) : (
        <RoundRobinSchedule
          Schedule={Schedule}
          handleDropdownToggle={handleDropdownToggle}
        />
      );
  }
};

export default TournamentScheduleGenerator;

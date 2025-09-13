import React, { useEffect } from "react";
import { useGetStanding } from "../../../hooks/TournamentLiveHooks";
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";
import { ChevronUpIcon } from "@heroicons/react/24/solid";

const DoubleEliminationStanding = ({
  fixture,
  handleDropdownToggle,
  EventFormat,
}) => {
  const {
    data: Standings,
    isLoading,
    isError,
    isFetched,
  } = useGetStanding({ fixtureId: fixture._id });

  let variableTeam = "players";
  let variableName = "name";
  let gridColumn = 5;

  if (EventFormat === "LEAGUE") {
    variableTeam = "teams";
    variableName = "teamName";
    gridColumn = 8;
  }

  useEffect(() => {
    if (isFetched) {
      handleDropdownToggle();
    }
  }, [isFetched]);

  if (isLoading) {
    return (
      <div className="bg-white">
        <div className="bg-white flex items-center justify-between p-2">
          <div className="bg-f2f2f2 animate-pulse h-[10px] w-[50px]"></div>
          <div className="bg-f2f2f2 animate-pulse h-[10px] w-[50px]"></div>
          <div className="bg-f2f2f2 animate-pulse h-[10px] w-[50px]"></div>
          <div className="bg-f2f2f2 animate-pulse h-[10px] w-[50px]"></div>
          <div className="bg-f2f2f2 animate-pulse h-[10px] w-[50px]"></div>
        </div>
        <div className="bg-f2f2f2 animate-pulse h-[30px] mb-2 w-full"></div>
        <div className="bg-f2f2f2 animate-pulse h-[30px] mb-2 w-full"></div>
      </div>
    );
  }

  return (
    <div className="mb-5 bg-white">
      <div
        className={`grid ${
          EventFormat === "LEAGUE" ? "grid-cols-8" : "grid-cols-5"
        } bg-white px-5 md:px-10`}
      >
        <span className="font-general font-medium text-383838 text-xs md:text-base capitalize text-center">
          Standing
        </span>
        <span className="font-general font-medium text-383838 text-xs md:text-base capitalize text-center sm:text-left mx-auto">
          name
        </span>
        <span className="font-general font-medium text-383838 text-xs md:text-base capitalize text-center">
          P
        </span>
        <span className="font-general font-medium text-383838 text-xs md:text-base capitalize text-center">
          W
        </span>
        <span className="font-general font-medium text-383838 text-xs md:text-base capitalize text-center">
          L
        </span>
        {EventFormat === "LEAGUE" && (
          <>
            <span className="font-general font-medium text-383838 text-xs md:text-base capitalize text-center">
              Points
            </span>
            <span className="font-general font-medium text-383838 text-xs md:text-base capitalize text-center">
              Bonus
            </span>
            <span className="font-general font-medium text-383838 text-xs md:text-base capitalize text-center">
              Total
            </span>
          </>
        )}
      </div>
      <div>
        {Standings.groups.map((group, index) => (
          <div className="mt-1">
            {group.standings.map((standing, index) => (
              <div
                key={index}
                className={`grid grid-cols-${gridColumn} py-2 px-5 md:px-10 items-center ${
                  index % 2 === 0 ? "bg-f2f2f2" : "bg-white"
                }`}
              >
                <span className="font-general font-medium text-xs md:text-sm text-383838 capitalize text-center">
                  {standing.rank}
                </span>
                <div className="flex flex-col items-center justify-start gap-2">
                  {standing?.[variableTeam].map((player, index) => (
                    <span
                      className="font-general font-medium text-xs md:text-sm text-244cb4 text-center sm:text-left max-w-full truncate cursor-pointer"
                      key={index}
                      title={player?.[variableName]}
                    >
                      {player?.[variableName]}
                    </span>
                  ))}
                </div>
                <span className="font-general font-medium text-xs md:text-sm text-383838 capitalize text-center">
                  {standing.matchesPlayed}
                </span>
                <span className="font-general font-medium text-xs md:text-sm text-383838 capitalize text-center">
                  {standing.matchesWon}
                </span>
                <span className="font-general font-medium text-xs md:text-sm text-383838 capitalize text-center">
                  {standing.matchesLost}
                </span>
                {EventFormat === "LEAGUE" && (
                  <>
                    <span className="font-general font-medium text-xs md:text-sm text-383838 capitalize text-center">
                      {standing?.totalPoints - standing?.bonusPoints}
                    </span>
                    <span className="font-general font-medium text-xs md:text-sm text-383838 capitalize text-center">
                      {standing?.bonusPoints}
                    </span>
                    <span className="font-general font-medium text-xs md:text-sm text-383838 capitalize text-center">
                      {standing?.totalPoints}
                    </span>
                  </>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DoubleEliminationStanding;

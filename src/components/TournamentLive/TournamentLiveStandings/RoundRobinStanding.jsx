import React, { useEffect } from "react";
import { useGetStanding } from "../../../hooks/TournamentLiveHooks";
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";
import { ChevronUpIcon } from "@heroicons/react/24/solid";

const RoundRobinStanding = ({ fixture, handleDropdownToggle, EventFormat }) => {
  const {
    data: Standings,
    isLoading,
    isError,
    isFetched,
  } = useGetStanding({ fixtureId: fixture._id });

  let variableTeam = "players";
  let variableName = "name";

  if (EventFormat === "LEAGUE") {
    variableTeam = "teams";
    variableName = "teamName";
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
          EventFormat === "LEAGUE" ? "grid-cols-9" : "grid-cols-6"
        } bg-white px-5 md:px-10`}
      >
        <span className="font-general font-medium text-383838 text-xs md:text-base capitalize text-center mx-auto">
          Standing
        </span>
        <span className="font-general font-medium text-383838 text-xs md:text-base capitalize text-center sm:text-left mx-auto">
          {EventFormat === "LEAGUE" ? "Team" : "Name"}
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
        <span className="font-general font-medium text-383838 text-xs md:text-base capitalize text-center">
          {EventFormat === "LEAGUE" ? "SD" : "PD"}
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
          <Disclosure key={index} as="div" className="mb-2 bg-f8f8f8">
            {({ open }) => (
              <>
                <DisclosureButton
                  className="flex w-full justify-between bg-244cb4 px-9 md:px-20 py-1 text-left font-medium text-white mt-2"
                  onClick={() => handleDropdownToggle()}
                >
                  <span className="font-general font-semibold text-sm md:text-base ">
                    {group.groupName}
                  </span>
                  <ChevronUpIcon
                    className={`${
                      open ? "rotate-180 transform" : ""
                    } h-5 w-5 text-white`}
                  />
                </DisclosureButton>
                <DisclosurePanel>
                  {group.standings.map((standing, index) => (
                    <div
                      key={index}
                      className={`grid  py-2 px-5 md:px-10 items-center ${
                        (index % 2 === 0 ? "bg-f2f2f2" : "bg-white",
                        EventFormat === "LEAGUE"
                          ? "grid-cols-9"
                          : "grid-cols-6")
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
                      <span className="font-general font-medium text-xs md:text-sm text-383838 capitalize text-center">
                        {standing.pointDifference > 0
                          ? `+${standing.pointDifference}`
                          : standing.pointDifference}
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
                </DisclosurePanel>
              </>
            )}
          </Disclosure>
        ))}
      </div>
    </div>
  );
};

export default RoundRobinStanding;

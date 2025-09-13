import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";
import { ChevronUpIcon } from "@heroicons/react/24/solid";
import React from "react";
import { DefaultProfileImage } from "../../../assets";
import { formatDateStringForLive } from "../../../utils/utlis";

const SingleEliminationSchedule = ({
  Schedule,
  handleDropdownToggle,
  EventFormat,
}) => {
  let variableTeam = "players";
  let variableName = "name";
  let variableLogo = "profilePic";

  if (EventFormat === "LEAGUE") {
    variableTeam = "teams";
    variableName = "teamName";
    variableLogo = "teamLogo";
  }

  return (
    <div className="w-full px-2 md:px-20 pt-5">
      <div>
        {Schedule.schedule.map((schedule, index) => (
          <Disclosure
            key={index}
            as="div"
            className="mb-4 bg-f8f8f8 rounded-b-2xl"
          >
            {({ open }) => (
              <>
                <DisclosureButton
                  className={`flex w-full justify-between bg-244cb4 px-4 py-4 text-left font-medium text-white ${
                    open ? "rounded-t-2xl" : "rounded-2xl"
                  }`}
                  onClick={() => handleDropdownToggle()}
                >
                  <span className="font-general font-semibold text-sm md:text-base capitalize">
                    {schedule.date !== "Date TBD"
                      ? formatDateStringForLive(schedule.date)
                      : schedule.date}
                  </span>
                  <ChevronUpIcon
                    className={`${
                      open ? "" : "rotate-180 transform"
                    } h-5 w-5 text-white`}
                  />
                </DisclosureButton>
                <DisclosurePanel className={`py-4 bg-white rounded-b-2xl`}>
                  {schedule.rounds.map((round, roundIndex) => (
                    <Disclosure key={roundIndex}>
                      {({ open }) => (
                        <>
                          <DisclosureButton
                            className="bg-f4f5ff w-full flex items-center justify-between px-5 md:px-10 py-2 mb-3"
                            onClick={() => handleDropdownToggle()}
                          >
                            <span className="font-general font-semibold text-sm md:text-base ">
                              {round.roundName}
                            </span>
                            <ChevronUpIcon
                              className={`${
                                open ? "" : "rotate-180 transform"
                              } h-5 w-5 text-black`}
                            />
                          </DisclosureButton>
                          <DisclosurePanel className={`pb-8`}>
                            {round.matches.map((match, matchIndex) => (
                              <div key={matchIndex}>
                                <p className="opacity-70 px-5 md:px-12 font-general font-medium text-sm md:text-base text-383838 my-3">
                                  {match.startTime
                                    ? match.startTime + " IST"
                                    : "Time - TBD"}
                                </p>
                                <div className="mx-3 md:mx-6 border border-f0f0f0 bg-white rounded-xl py-2 md:py-4 px-3 md:px-6">
                                  <div className="flex items-center justify-between">
                                    {/* Team 1 Side - Fixed width */}
                                    <div className="w-5/12">
                                      {match.opponent1 ? (
                                        <div>
                                          {match.opponent1?.[variableTeam].map(
                                            (player, playerIndex) => (
                                              <div
                                                key={playerIndex}
                                                className="flex items-center gap-2 flex-col md:flex-row"
                                              >
                                                <div>
                                                  <img
                                                    src={
                                                      player?.[variableLogo] ||
                                                      DefaultProfileImage
                                                    }
                                                    alt="player profile"
                                                    className="w-[35px] md:w-[55px] h-[35px] md:h-[55px] rounded-full object-cover"
                                                  />
                                                </div>
                                                <div>
                                                  <p className="font-general font-medium text-sm md:text-base text-383838 truncate text-center md:text-left max-w-[130px]">
                                                    {player?.[variableName]}
                                                  </p>
                                                </div>
                                              </div>
                                            )
                                          )}
                                        </div>
                                      ) : (
                                        <div className="flex items-center justify-center md:justify-start h-full gap-2">
                                          <div>
                                            <img
                                              src={DefaultProfileImage}
                                              alt="player profile"
                                              className="w-[35px] md:w-[55px] h-[35px] md:h-[55px] rounded-full object-cover"
                                            />
                                          </div>
                                          <p className="font-general font-medium text-sm md:text-base text-383838">
                                            {match?.roundId == 0
                                              ? "BYE"
                                              : "Player TBD"}
                                          </p>
                                        </div>
                                      )}
                                    </div>

                                    {/* VS in the middle - Fixed width */}
                                    <div className="w-2/12 flex justify-center">
                                      <span className="font-general font-medium text-xs md:text-sm text-383838 opacity-70">
                                        V/S
                                      </span>
                                    </div>

                                    {/* Team 2 Side - Fixed width */}
                                    <div className="w-5/12 flex max-md:justify-center">
                                      {match.opponent2 ? (
                                        <div>
                                          {match.opponent2?.[variableTeam].map(
                                            (player, playerIndex) => (
                                              <div
                                                key={playerIndex}
                                                className="flex items-center gap-2 flex-col md:flex-row"
                                              >
                                                <div className="order-1 md:order-1">
                                                  <img
                                                    src={
                                                      player?.[variableLogo] ||
                                                      DefaultProfileImage
                                                    }
                                                    alt="player profile"
                                                    className="w-[35px] md:w-[55px] h-[35px] md:h-[55px] rounded-full object-cover"
                                                  />
                                                </div>
                                                <div className="order-2 md:order-2">
                                                  <p className="font-general font-medium text-sm md:text-base text-383838 text-center md:text-left">
                                                    {player?.[variableName]}
                                                  </p>
                                                </div>
                                              </div>
                                            )
                                          )}
                                        </div>
                                      ) : (
                                        <div className="flex items-center justify-center md:justify-end h-full gap-2">
                                          <div>
                                            <img
                                              src={DefaultProfileImage}
                                              alt="player profile"
                                              className="w-[35px] md:w-[55px] h-[35px] md:h-[55px] rounded-full object-cover"
                                            />
                                          </div>
                                          <p className="font-general font-medium text-sm md:text-base text-383838">
                                            {match?.roundId == 0
                                              ? "BYE"
                                              : "Player TBD"}
                                          </p>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </DisclosurePanel>
                        </>
                      )}
                    </Disclosure>
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

export default SingleEliminationSchedule;

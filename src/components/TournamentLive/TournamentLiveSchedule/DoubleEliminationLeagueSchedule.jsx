import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";
import { ChevronUpIcon } from "@heroicons/react/24/solid";
import React from "react";
import { DefaultProfileImage } from "../../../assets";
import { formatDateStringForLive } from "../../../utils/utlis";

const DoubleEliminationLeagueSchedule = ({
  Schedule,
  handleDropdownToggle,
}) => {

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
                              <Disclosure key={matchIndex}>
                                {({ open }) => (
                                  <>
                                    <DisclosureButton
                                      className="bg-blue-100 w-full flex items-center justify-between px-5 md:px-10 py-2 mb-3"
                                      onClick={() => handleDropdownToggle()}
                                    >
                                      <div className="flex items-center justify-between w-full font-semibold text-sm md:text-base">
                                        {/* Opponent 1 */}
                                        <span
                                          className="truncate flex-1 text-left"
                                          title={
                                            match?.opponent1
                                              ? match?.opponent1?.teams?.[0]
                                                  ?.teamName
                                              : match?.roundId == 0
                                              ? "BYE"
                                              : "Team TBD"
                                          }
                                        >
                                          {match?.opponent1
                                            ? match?.opponent1?.teams?.[0]
                                                ?.teamName
                                            : match?.roundId == 0
                                            ? "BYE"
                                            : "Team TBD"}
                                        </span>

                                        {/* VS */}
                                        <span className="px-3 font-medium text-center flex-shrink-0">
                                          VS
                                        </span>

                                        {/* Opponent 2 */}
                                        <span
                                          className="truncate flex-1 text-right"
                                          title={
                                            match?.opponent2
                                              ? match?.opponent2?.teams?.[0]
                                                  ?.teamName
                                              : match?.roundId == 0
                                              ? "BYE"
                                              : "Team TBD"
                                          }
                                        >
                                          {match?.opponent2
                                            ? match?.opponent2?.teams?.[0]
                                                ?.teamName
                                            : match?.roundId == 0
                                            ? "BYE"
                                            : "Team TBD"}
                                        </span>
                                      </div>
                                      <ChevronUpIcon
                                        className={`${
                                          open ? "" : "rotate-180 transform"
                                        } h-5 w-5 text-black`}
                                      />
                                    </DisclosureButton>
                                    <DisclosurePanel className={`pb-8`}>
                                      {match?.matchTieMatches?.map(
                                        (matchTie, matchTieIndex) => (
                                          <div key={matchTieIndex}>
                                            <p className="opacity-70 px-5 md:px-12 font-general font-medium text-sm md:text-base text-383838 my-3">
                                              {match?.startTime
                                                ? match?.startTime + " IST"
                                                : "Time - TBD"}
                                            </p>
                                            <div className="mx-3 md:mx-6 border border-f0f0f0 bg-white rounded-xl py-2 md:py-4 px-3 md:px-6">
                                              <div className="flex items-center justify-between">
                                                {/* Team 1 Side - Fixed width */}
                                                <div className="w-5/12">
                                                  {matchTie?.opponent1 ? (
                                                    <div>
                                                      {matchTie?.opponent1?.players.map(
                                                        (
                                                          player,
                                                          playerIndex
                                                        ) => (
                                                          <div
                                                            key={playerIndex}
                                                            className="flex items-center gap-2 flex-col md:flex-row"
                                                          >
                                                            <div>
                                                              <img
                                                                src={
                                                                  player?.profilePic ||
                                                                  DefaultProfileImage
                                                                }
                                                                alt="Team Logo"
                                                                className="w-[35px] md:w-[55px] h-[35px] md:h-[55px] rounded-full object-cover"
                                                              />
                                                            </div>
                                                            <div>
                                                              <p className="font-general font-medium text-sm md:text-base text-383838 truncate text-center md:text-left max-w-[130px]" title={player?.name}>
                                                                {player?.name}
                                                              </p>
                                                            </div>
                                                          </div>
                                                        )
                                                      )}
                                                    </div>
                                                  ) : (
                                                    <div className="flex items-center justify-center md:justify-start h-full">
                                                      <p className="font-general font-medium text-sm md:text-base text-383838" title="Player TBD">
                                                        Player TBD
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
                                                <div className="w-5/12">
                                                  {matchTie?.opponent2 ? (
                                                    <div>
                                                      {matchTie?.opponent2?.players.map(
                                                        (
                                                          player,
                                                          playerIndex
                                                        ) => (
                                                          <div
                                                            key={playerIndex}
                                                            className="flex items-center gap-2 flex-col md:flex-row"
                                                          >
                                                            <div>
                                                              <img
                                                                src={
                                                                  player?.profilePic ||
                                                                  DefaultProfileImage
                                                                }
                                                                alt="Team Logo"
                                                                className="w-[35px] md:w-[55px] h-[35px] md:h-[55px] rounded-full object-cover"
                                                              />
                                                            </div>
                                                            <div>
                                                              <p className="font-general font-medium text-sm md:text-base text-383838 truncate text-center md:text-left max-w-[130px]" title={player?.name}>
                                                                {player?.name}
                                                              </p>
                                                            </div>
                                                          </div>
                                                        )
                                                      )}
                                                    </div>
                                                  ) : (
                                                    <div className="flex items-center justify-center md:justify-start h-full">
                                                      <p className="font-general font-medium text-sm md:text-base text-383838" title="Player TBD">
                                                        Player TBD
                                                      </p>
                                                    </div>
                                                  )}
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        )
                                      )}
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
                </DisclosurePanel>
              </>
            )}
          </Disclosure>
        ))}
      </div>
    </div>
  );
};

export default DoubleEliminationLeagueSchedule;

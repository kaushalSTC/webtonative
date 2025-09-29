import React, { useState } from "react";
import { DefaultProfileImage, GreenArrow } from "../../../assets";
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";
import { ChevronUpIcon } from "@heroicons/react/24/solid";

const RoundRobinEliminationResults = ({ fixture, handleDropdownToggle, EventFormat }) => {
  const isLeague = EventFormat === "LEAGUE";
  const [expandedMatches, setExpandedMatches] = useState(new Set());

  let variableTeam = "players";
  let variableName = "name";
  let variableLogo = "profilePic";

  if (EventFormat === "LEAGUE") {
    variableTeam = "teams"
    variableName = "teamName"
    variableLogo = "teamLogo"
  }

  const toggleMatchExpansion = (groupIndex, matchIndex) => {
    const matchKey = `${groupIndex}-${matchIndex}`;
    const newExpandedMatches = new Set(expandedMatches);

    if (newExpandedMatches.has(matchKey)) {
      newExpandedMatches.delete(matchKey);
    } else {
      newExpandedMatches.add(matchKey);
    }

    setExpandedMatches(newExpandedMatches);
    handleDropdownToggle();
  };

  const isMatchExpanded = (groupIndex, matchIndex) => {
    return expandedMatches.has(`${groupIndex}-${matchIndex}`);
  };

  const renderSubMatch = (subMatch, subMatchIndex) => {
    return (
      <div
        key={subMatchIndex}
        className="sub-match bg-gray-50 mb-2 p-3 rounded-lg border border-gray-200"
      >
        <div className="flex items-center justify-between mb-2">
          <span className="font-general font-semibold text-sm text-gray-700">
            {subMatch.matchName || `Sub-match ${subMatchIndex + 1}`}
          </span>
          <div className="flex items-center gap-2">
            <span className={`text-xs px-2 py-1 rounded ${subMatch.status === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
              }`}>
              {subMatch.status}
            </span>
            {subMatch.forfeit && (
              <span className="text-xs px-2 py-1 rounded bg-red-100 text-red-800">
                Forfeit
              </span>
            )}
          </div>
        </div>

        {/* Sub-match Team 1 */}
        <div className="team-1-outer flex items-center justify-between mb-2">
          <div className="player-info flex items-center justify-start gap-2">
            {subMatch.opponent1?.players?.length > 0 ? (
              <div>
                {subMatch.opponent1.players.map((player, playerIndex) => (
                  <div
                    key={playerIndex}
                    className={`${playerIndex > 0 ? "mt-1" : ""
                      } flex items-center justify-start gap-2`}
                  >
                    <img
                      src={player?.profilePic || DefaultProfileImage}
                      alt="player-profile-image"
                      className="rounded-full w-[40px] h-[40px]"
                    />
                    <div>
                      <p className="font-general font-medium text-sm text-383838">
                        {player?.name || player?.placeHolder}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <img
                  src={DefaultProfileImage}
                  alt="tbd-profile-image"
                  className="rounded-full w-[40px] h-[40px]"
                />
                <p className="font-general font-medium text-sm text-383838">
                  TBD
                </p>
              </div>
            )}
          </div>

          <div className="flex items-center justify-end gap-3">
            {subMatch.opponent1?.result === "win" && (
              <img
                src={GreenArrow}
                alt="green-arrow"
                className="w-4 h-4"
              />
            )}
            <span className="font-general font-bold text-383838 text-sm">
              {subMatch.opponent1?.score !== null && subMatch.opponent1?.score !== undefined
                ? subMatch.opponent1.score
                : (subMatch.opponent1?.forfeit ? "FF" : "-")}
            </span>
          </div>
        </div>

        <div className="w-full bg-gray-300 h-[1px] my-2"></div>

        {/* Sub-match Team 2 */}
        <div className="team-2-outer flex items-center justify-between">
          <div className="player-info flex items-center justify-start gap-2">
            {subMatch.opponent2?.players?.length > 0 ? (
              <div>
                {subMatch.opponent2.players.map((player, playerIndex) => (
                  <div
                    key={playerIndex}
                    className={`${playerIndex > 0 ? "mt-1" : ""
                      } flex items-center justify-start gap-2`}
                  >
                    <img
                      src={player?.profilePic || DefaultProfileImage}
                      alt="player-profile-image"
                      className="rounded-full w-[40px] h-[40px]"
                    />
                    <div>
                      <p className="font-general font-medium text-sm text-383838">
                        {player?.name || player?.placeHolder}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <img
                  src={DefaultProfileImage}
                  alt="tbd-profile-image"
                  className="rounded-full w-[40px] h-[40px]"
                />
                <p className="font-general font-medium text-sm text-383838">
                  TBD
                </p>
              </div>
            )}
          </div>

          <div className="flex items-center justify-end gap-3">
            {subMatch.opponent2?.result === "win" && (
              <img
                src={GreenArrow}
                alt="green-arrow"
                className="w-4 h-4"
              />
            )}
            <span className="font-general font-bold text-383838 text-sm">
              {subMatch.opponent2?.score !== null && subMatch.opponent2?.score !== undefined
                ? subMatch.opponent2.score
                : (subMatch.opponent2?.forfeit ? "FF" : "-")}
            </span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full">
      <div>
        {fixture.stages[0].groups.map((group, groupIndex) => {
          console.log(group);
          return (
            <Disclosure key={groupIndex} as="div" className="mb-4 bg-f2f2f2">
              {({ open }) => (
                <>
                  <DisclosureButton
                    className="flex w-full justify-between bg-244cb4 px-9 md:px-20 py-2 text-left font-medium text-white"
                    onClick={() => handleDropdownToggle()}
                  >
                    <span className="font-general font-semibold text-sm md:text-base capitalize">
                      {group?.groupName}
                    </span>
                    <ChevronUpIcon
                      className={`${open ? "" : "rotate-180 transform"
                        } h-5 w-5 text-white`}
                    />
                  </DisclosureButton>
                  <DisclosurePanel className="pt-4 pb-2 px-3">
                    {group?.matches?.map((match, matchIndex) => (
                      <div
                        className={`outer-most-single-match bg-white mb-3 rounded-2xl shadow-sm border border-gray-100 ${isLeague ? 'overflow-hidden' : 'p-2 md:p-5'}`}
                        key={matchIndex}
                      >
                        <div onClick={isLeague ? () => toggleMatchExpansion(groupIndex, matchIndex) : undefined}>
                          {/* Main Match Content */}
                          <div
                            className={`main-match-content ${isLeague ? 'cursor-pointer' : ''} ${isLeague ? 'p-2 md:p-5' : ''} ${isLeague ? 'flex items-center justify-between' : ""}`}
                            
                          >
                            {/* Team 1 */}
                            <div className={`team-1-outer flex items-center justify-between ${isLeague ? 'flex-col gap-5' : ''}`}>
                              <div className="player-info flex items-center justify-start gap-2">
                                {match.opponent1?.[variableTeam]?.length > 0 ? (
                                  <>
                                    <div>
                                      {match.opponent1?.[variableTeam].map(
                                        (player, playerIndex) => (
                                          <div
                                            key={playerIndex}
                                            className={`${playerIndex > 0 ? "mt-2" : ""
                                              } flex items-center justify-start gap-2 ${isLeague ? 'flex-col md:flex-row' : ''}`}
                                          >
                                            <img
                                              src={
                                                player?.[variableLogo] ||
                                                DefaultProfileImage
                                              }
                                              alt="player-profile-image"
                                              className="rounded-full w-[50px] h-[50px] md:w-[72px] md:h-[72px]"
                                            />
                                            <div>
                                              <p className="font-general font-medium text-sm md:text-base text-383838">
                                                {player?.[variableName]}
                                              </p>
                                            </div>
                                          </div>
                                        )
                                      )}
                                    </div>
                                  </>
                                ) : (
                                  <>
                                    <div>
                                      <img
                                        src={DefaultProfileImage}
                                        alt="bye-profile-image"
                                        className="rounded-full w-[50px] h-[50px] md:w-[72px] md:h-[72px]"
                                      />
                                    </div>
                                    <div>
                                      <p className="font-general font-medium text-sm md:text-base text-383838">
                                        {match.roundId === 0 ? "BYE" : "TBD"}
                                      </p>
                                    </div>
                                  </>
                                )}
                              </div>
                              <div className="flex items-center justify-end gap-3">
                                {match?.opponent1?.[variableTeam]?.length > 0 &&
                                  match?.opponent1?.result == "win" && (
                                    <img
                                      src={GreenArrow}
                                      alt="green-arrow"
                                      className="w-5 h-5"
                                    />
                                  )}

                                {match?.opponent1?.[variableTeam]?.length > 0 ? (
                                  match.sets.map((set, setIndex) => (
                                    <span
                                      key={setIndex}
                                      className="font-general font-bold text-383838 text-sm"
                                    >
                                      {set?.opponent1?.score !== null
                                        ? set?.opponent1?.score
                                        : "-"}
                                    </span>
                                  ))
                                ) : (
                                  <span className="font-general font-bold text-383838 text-sm mr-3">
                                    --
                                  </span>
                                )}
                              </div>
                            </div>

                            <div className={`w-full bg-f2f2f2 h-[1px] my-3 ${isLeague ? 'hidden' : ''}`}></div>

                            {/* Team 2 */}
                            <div className={`team-2-outer flex items-center justify-between ${isLeague ? 'flex-col gap-5' : ''}`}>
                              <div className="player-info flex items-center justify-start gap-2">
                                {match.opponent2?.[variableTeam]?.length > 0 ? (
                                  <>
                                    <div>
                                      {match.opponent2?.[variableTeam].map(
                                        (player, playerIndex) => (
                                          <div
                                            key={playerIndex}
                                            className={`${playerIndex > 0 ? "mt-2" : ""
                                              } flex items-center justify-start gap-2 ${isLeague ? 'flex-col md:flex-row' : ''}`}
                                          >
                                            <img
                                              src={
                                                player?.[variableLogo] ||
                                                DefaultProfileImage
                                              }
                                              alt="player-profile-image"
                                              className="rounded-full w-[50px] h-[50px] md:w-[72px] md:h-[72px]"
                                            />
                                            <div>
                                              <p className="font-general font-medium text-sm md:text-base text-383838">
                                                {player?.[variableName]}
                                              </p>
                                            </div>
                                          </div>
                                        )
                                      )}
                                    </div>
                                  </>
                                ) : (
                                  <>
                                    <div>
                                      <img
                                        src={DefaultProfileImage}
                                        alt="bye-profile-image"
                                        className="rounded-full w-[50px] h-[50px] md:w-[72px] md:h-[72px]"
                                      />
                                    </div>
                                  </>
                                )}
                              </div>
                              <div className="flex items-center justify-end gap-3">
                                {match.opponent2?.[variableTeam]?.length > 0 &&
                                  match?.opponent2?.result == "win" && (
                                    <img
                                      src={GreenArrow}
                                      alt="green-arrow"
                                      className="w-5 h-5"
                                    />
                                  )}

                                {match.opponent2?.[variableTeam]?.length > 0 ? (
                                  match.sets.map((set, setIndex) => (
                                    <span
                                      key={setIndex}
                                      className="font-general font-bold text-383838 text-sm"
                                    >
                                      {set?.opponent2?.score !== null
                                        ? set?.opponent2?.score
                                        : "-"}
                                    </span>
                                  ))
                                ) : (
                                  <span className="font-general font-bold text-383838 text-sm mr-3">
                                    --
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          {/* Chevron Icon for League Format */}
                          {isLeague && match.matchTieMatches && match.matchTieMatches.length > 0 && (
                            <div className="items-center justify-center mt-3 w-fit m-auto cursor-pointer">
                              <ChevronUpIcon
                                className={`${isMatchExpanded(groupIndex, matchIndex) ? "" : "rotate-180 transform"
                                  } h-5 w-5 text-gray-600 transition-transform duration-200`}
                              />
                            </div>
                          )}
                        </div>

                        {/* Sub-matches for League Format */}
                        {isLeague && isMatchExpanded(groupIndex, matchIndex) && match.matchTieMatches && (
                          <div className="sub-matches-container bg-gray-100 p-4 border-t border-gray-200">
                            <h4 className="font-general font-semibold text-sm mb-3 text-gray-700">
                              Match Details:
                            </h4>
                            {match.matchTieMatches.map((subMatch, subMatchIndex) =>
                              renderSubMatch(subMatch, subMatchIndex)
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </DisclosurePanel>
                </>
              )}
            </Disclosure>
          );
        })}
      </div>
    </div>
  );
};

export default RoundRobinEliminationResults;
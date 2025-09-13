import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useParams } from "react-router";
import { useGetTournamentScore } from "../hooks/TournamentHooks";
import { tournamentSkillLevelDefaults } from "../utils/utlis";
import Skeleton from "react-loading-skeleton";
import ThunderboltIcon from "../components/ThunderboltIcon/ThunderboltIcon";
import {
  Calendar,
  DummyProfileImage,
  GreenArrow,
  Location,
  MapIcon,
} from "../assets";

const ViewTournamentScore = () => {
  const params = useParams();
  const tournamentHandle = params?.handle;
  const fixtureId = params?.fixtureId;
  const playerId = useSelector((state) => state.player.id);
  const [expandedMatches, setExpandedMatches] = useState({});
  
  const {
    data: game,
    isLoading,
    isError,
  } = useGetTournamentScore({ playerId, fixtureId, tournamentHandle });
  
  const skillLevel = game?.skillLevel;
  const skillValue = tournamentSkillLevelDefaults.findIndex(
    (skill) => skill == skillLevel
  );
  const fullAddress = `${game?.location?.address?.line1 ?? ""}, ${
    game?.location?.address?.line2 ?? ""
  }, ${game?.location?.address?.city ?? ""}, ${
    game?.location?.address?.state ?? ""
  }, ${game?.location?.address?.postalCode ?? ""}`.trim();

  const handleOpenMap = () => {
    if (!fullAddress.trim()) return;
    const googleMapUrl = `https://www.google.com/maps?q=${encodeURIComponent(
      fullAddress
    )}`;
    window.open(googleMapUrl, "_blank");
  };

  const toggleMatchExpansion = (matchId) => {
    setExpandedMatches(prev => ({
      ...prev,
      [matchId]: !prev[matchId]
    }));
  };

  const renderTieMatch = (tieMatch, index) => {
    return (
      <div key={tieMatch.id || index} className="border border-gray-200 rounded-lg p-4 mb-4 bg-gray-50">
        <div className="flex justify-between items-center mb-3">
          <p className="font-general font-medium text-sm text-383838">
            Tie Match {index + 1} - {tieMatch.matchFormat}
          </p>
          <span className={`px-2 py-1 rounded text-xs font-medium ${
            tieMatch.status === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
          }`}>
            {tieMatch.status}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Opponent 1 */}
          <div className="space-y-2">
            <p className="font-general font-medium text-xs text-gray-600 uppercase">
              {tieMatch.opponent1.name}
            </p>
            {tieMatch.opponent1.players.map((player, idx) => (
              <div key={player.playerId || idx} className="flex items-center gap-2">
                <img
                  src={player?.profilePic || DummyProfileImage}
                  alt="profile"
                  className="w-8 h-8 rounded-full"
                />
                <p className="font-general font-medium text-sm text-383838">
                  {player.name}
                  {tieMatch.opponent1.forfeit ? " (Forfeited)" : ""}
                </p>
              </div>
            ))}
            {tieMatch.opponent1.result === 'win' && (
              <img
                src={GreenArrow}
                alt="winner"
                className="w-4 h-4 ml-2"
                loading="lazy"
              />
            )}
          </div>

          {/* Opponent 2 */}
          <div className="space-y-2">
            <p className="font-general font-medium text-xs text-gray-600 uppercase">
              {tieMatch.opponent2.name}
            </p>
            {tieMatch.opponent2.players.map((player, idx) => (
              <div key={player.playerId || idx} className="flex items-center gap-2">
                <img
                  src={player?.profilePic || DummyProfileImage}
                  alt="profile"
                  className="w-8 h-8 rounded-full"
                />
                <p className="font-general font-medium text-sm text-383838">
                  {player.name}
                  {tieMatch.opponent2.forfeit ? " (Forfeited)" : ""}
                </p>
              </div>
            ))}
            {tieMatch.opponent2.result === 'win' && (
              <img
                src={GreenArrow}
                alt="winner"
                className="w-4 h-4 ml-2"
                loading="lazy"
              />
            )}
          </div>
        </div>

        {/* Score Display */}
        {(tieMatch.opponent1.score !== null || tieMatch.opponent2.score !== null) && (
          <div className="flex justify-center items-center gap-4 mt-4 p-2 bg-white rounded">
            <span className="font-bold text-lg">{tieMatch.opponent1.score || 0}</span>
            <span className="text-gray-500">-</span>
            <span className="font-bold text-lg">{tieMatch.opponent2.score || 0}</span>
          </div>
        )}

        {/* Match Details */}
        <div className="mt-3 text-xs text-gray-600">
          {tieMatch.metadata?.date && (
            <span>Date: {tieMatch.metadata.date}</span>
          )}
          {tieMatch.metadata?.time?.startTime && (
            <span className="ml-4">Time: {tieMatch.metadata.time.startTime}</span>
          )}
          {tieMatch.points && (
            <span className="ml-4">Points: {tieMatch.points}</span>
          )}
        </div>
      </div>
    );
  };

  const renderLeagueMatch = (match, index) => {
    const isExpanded = expandedMatches[match.matchId || index];
    
    return (
      <div key={match.matchId || index} className="mb-6">
        <div 
          className="bg-white border border-gray-200 rounded-lg p-4 cursor-pointer hover:bg-gray-50 transition-colors"
          onClick={() => toggleMatchExpansion(match.matchId || index)}
        >
          <div className="flex justify-between items-center mb-3">
            <p className="font-general font-semibold text-base md:text-lg text-383838">
              Match {index + 1}
            </p>
            <div className="flex items-center gap-2">
              {match?.matchTieMatches?.length > 0 && (
                <span className="text-xs text-gray-500">
                  {match.matchTieMatches.length} tie matches
                </span>
              )}
              <svg 
                className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
            {/* Team 1 */}
            <div className="space-y-2">
              <p className="font-general font-medium text-xs text-gray-600 uppercase mb-2">Team 1</p>
              {(match?.team1?.length
                ? match.team1
                : [{ teamName: "BYE", teamLogo: DummyProfileImage }]
              ).map((team, idx) => (
                <div key={team.teamId || `team1-bye-${idx}`} className="flex items-center gap-2">
                  <img
                    src={team?.teamLogo || DummyProfileImage}
                    alt="team logo"
                    className="w-8 h-8 rounded-full"
                  />
                  <p className={`font-general font-medium text-sm ${
                    game?.playerTeams?.includes(team?.teamId) ? "text-244cb4" : "text-383838"
                  }`}>
                    {team?.teamName}
                    {match?.team1forfiet && match?.team1?.length ? " (Forfeited)" : ""}
                  </p>
                </div>
              ))}
            </div>

            {/* Score/Winner indicator */}
            <div className="flex justify-center items-center">
              {match.matchWinner === 1 && (
                <div className="flex items-center gap-2 text-green-600">
                  <img src={GreenArrow} alt="winner" className="w-4 h-4" />
                  <span className="text-sm font-medium">Winner</span>
                </div>
              )}
              {match.matchWinner === 2 && (
                <div className="flex items-center gap-2 text-green-600">
                  <span className="text-sm font-medium">Winner</span>
                  <img src={GreenArrow} alt="winner" className="w-4 h-4 rotate-180" />
                </div>
              )}
              {!match.matchWinner && (
                <span className="text-sm text-gray-500">VS</span>
              )}
            </div>

            {/* Team 2 */}
            <div className="space-y-2">
              <p className="font-general font-medium text-xs text-gray-600 uppercase mb-2">Team 2</p>
              {(match?.team2?.length
                ? match.team2
                : [{ teamName: "BYE", teamLogo: DummyProfileImage }]
              ).map((team, idx) => (
                <div key={team.teamId || `team2-bye-${idx}`} className="flex items-center gap-2">
                  <img
                    src={team?.teamLogo || DummyProfileImage}
                    alt="team logo"
                    className="w-8 h-8 rounded-full"
                  />
                  <p className={`font-general font-medium text-sm ${
                    game?.playerTeams?.includes(team?.teamId) ? "text-244cb4" : "text-383838"
                  }`}>
                    {team?.teamName}
                    {match?.team2forfiet && match?.team2?.length ? " (Forfeited)" : ""}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Expanded Tie Matches */}
        {isExpanded && match?.matchTieMatches?.length > 0 && (
          <div className="mt-4 ml-4 space-y-3">
            <h4 className="font-general font-semibold text-sm text-gray-700 mb-3">
              Tie Matches:
            </h4>
            {match.matchTieMatches.map((tieMatch, tieIndex) => 
              renderTieMatch(tieMatch, tieIndex)
            )}
          </div>
        )}
      </div>
    );
  };

  const renderRegularMatch = (match, index) => {
    return (
      <div key={match.matchId || index} className="mb-10">
        {/* Match Heading */}
        <p className="font-general font-semibold text-base md:text-lg text-383838 capitalize mb-4">
          Match {index + 1}
        </p>

        {/* Team 1 */}
        <p className="font-general font-medium text-sm md:text-base text-1c0e0eb3 capitalize mb-3">
          Team 1
        </p>
        {(match?.team1?.length
          ? match.team1
          : [{ name: "BYE", profilePic: DummyProfileImage }]
        ).map((player, idx) => (
          <div
            key={player.playerId || `team1-bye-${idx}`}
            className="flex items-center gap-2 mb-2"
          >
            <img
              src={player?.profilePic || DummyProfileImage}
              alt="profile"
              className="w-[50px] md:w-[75px] aspect-square rounded-full"
            />
            <p className="font-general font-medium text-383838 text-sm md:text-base capitalize">
              {player?.name}{" "}
              {match?.team1forfiet && match?.team1?.length
                ? "(Forfeited)"
                : ""}
            </p>
          </div>
        ))}

        {/* Team 1 Score */}
        {match?.sets?.length > 0 && (
          <div className="flex items-center justify-center gap-3 mb-4">
            {match.matchWinner === 1 && (
              <img
                src={GreenArrow}
                alt="winner"
                className="w-auto h-[20px] object-cover"
                loading="lazy"
              />
            )}
            {match.sets.map((set, idx) => (
              <p
                key={idx}
                className="font-general font-medium text-383838 text-sm md:text-base capitalize"
              >
                {set?.scoreTeam1}
              </p>
            ))}
          </div>
        )}

        {/* Team 2 */}
        <p className="font-general font-medium text-sm md:text-base text-1c0e0eb3 capitalize mb-3">
          Team 2
        </p>
        {(match?.team2?.length
          ? match.team2
          : [{ name: "BYE", profilePic: DummyProfileImage }]
        ).map((player, idx) => (
          <div
            key={player.playerId || `team2-bye-${idx}`}
            className="flex items-center gap-2 mb-2"
          >
            <img
              src={player?.profilePic || DummyProfileImage}
              alt="profile"
              className="w-[50px] md:w-[75px] aspect-square rounded-full"
            />
            <p className="font-general font-medium text-383838 text-sm md:text-base capitalize">
              {player?.name}{" "}
              {match?.team2forfiet && match?.team2?.length
                ? "(Forfeited)"
                : ""}
            </p>
          </div>
        ))}

        {/* Team 2 Score */}
        {match?.sets?.length > 0 && (
          <div className="flex items-center justify-center gap-3">
            {match.matchWinner === 2 && (
              <img
                src={GreenArrow}
                alt="winner"
                className="w-auto h-[20px] object-cover"
                loading="lazy"
              />
            )}
            {match.sets.map((set, idx) => (
              <p
                key={idx}
                className="font-general font-medium text-383838 text-sm md:text-base capitalize"
              >
                {set?.scoreTeam2}
              </p>
            ))}
          </div>
        )}

        {/* Divider */}
        {index !== game.matches.length - 1 && (
          <div className="bg-dbe0fc h-[2px] w-full my-6"></div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-f8f8f8">
      <div className="max-w-[720px] mx-auto px-0 w-full container bg-white">
        <div className="px-[33px] md:px-[73px] py-[60px]">
          <div className="flex items-center justify-between">
            <div className="flex items-start gap-4 md:gap-10">
              {isLoading ? (
                <Skeleton height={20} width={150} />
              ) : (
                <p className="font-general font-medium text-xs md:text-sm text-383838 capitalize border border-383838 py-1 px-2 rounded-2xl">
                  tournament joined
                </p>
              )}
              {isLoading ? (
                <Skeleton height={20} width={200} />
              ) : (
                <div className="flex items-center gap-1">
                  <ThunderboltIcon value={skillValue} />
                  <p className="font-general font-regular text-xs md:text-sm opacity-70 max-w-40 text-383838 capitalize whitespace-nowrap">
                    {skillLevel}
                  </p>
                </div>
              )}
            </div>
            <div className="flex items-center gap-2">
              {game?.isCreator &&
                game?.matches?.some((match) =>
                  [...(match.team1 || []), ...(match.team2 || [])].some(
                    (player) => player.status === "REJECTED"
                  )
                ) && (
                  <button
                    className="bg-383838 text-white py-2 px-3 rounded-xl font-general capitalize text-sm"
                    onClick={handleReverification}
                  >
                    {isResendScoreVerificationLoading
                      ? "Sending..."
                      : "Verify Scores"}
                  </button>
                )}

              {game?.isCreator && (
                <Link to={`/games/${game?.handle}/score`}>
                  <div className="border border-f2f2f2 rounded-full p-2 cursor-pointer">
                    <img
                      src={EditProfile}
                      alt="edit-button"
                      className="w-4 h-4"
                    />
                  </div>
                </Link>
              )}
            </div>
          </div>

          {isLoading ? (
            <Skeleton width="100%" height="200px" />
          ) : (
            <p className="font-author font-medium text-383838 text-2xl md:text-3xl capitalize mt-2 mb-5 md:mb-7">
              {game?.name}
            </p>
          )}

          <div className="w-full h-[2px] bg-f2f2f2 mb-6"></div>

          {isLoading ? (
            <Skeleton width={200} height={100} />
          ) : (
            <p className="font-general font-medium text-sm md:text-base text-1c0e0eb3 capitalize">
              Game Details
            </p>
          )}

          {isLoading ? (
            <Skeleton width="100%" height={200} />
          ) : (
            <div className="flex items-center gap-2 mt-5">
              <img
                src={Calendar}
                alt="calendar"
                className="w-auto h-[14px] object-cover"
                loading="lazy"
              />
              <p className="font-general font-medium text-xs md:text-sm text-383838 opacity-70 capitalize">
                {game?.date}
              </p>
            </div>
          )}

          <div className="w-full h-[2px] bg-f2f2f2 my-6"></div>
          {isLoading ? (
            <Skeleton width="100%" height="200px" />
          ) : (
            <p className="font-general font-medium text-sm md:text-base text-1c0e0eb3 capitalize">
              venue
            </p>
          )}
          <p className="font-author font-medium text-383838 text-2xl md:text-3xl capitalize mt-2 mb-5 md:mb-7">
            {game?.location?.address?.line1}
          </p>
          {isLoading ? (
            <Skeleton width="100%" height="300px" />
          ) : (
            <div className="flex justify-between mb-6">
              <div className="flex items-baseline gap-2">
                <span>
                  <img
                    src={Location}
                    alt="Location-icon"
                    className="w-4 h-4 "
                  />
                </span>
                <p className="font-general font-medium text-base text-1c0e0e max-w-[230px] max-md:text-sm max-md:max-w-[220px] capitalize">
                  {[
                    game?.location?.address?.line2,
                    game?.location?.address?.city,
                    game?.location?.address?.state,
                    game?.location?.address?.postalCode,
                  ]
                    .filter(Boolean)
                    .join(", ")}
                </p>
              </div>
              <div
                onClick={handleOpenMap}
                data-google-map-url={`https://www.google.com/maps?q=${encodeURIComponent(
                  fullAddress
                )}`}
                className="venue-map-btn cursor-pointer"
              >
                <span className="w-6 h-6 ml-auto block">
                  <img src={MapIcon} alt="map-icon" className="w-6 h-6 " />
                </span>
                <p className="venue-map-textfont-medium font-general text-sm text-244cb4 underline max-md:text-[12px]">
                  Map View
                </p>
              </div>
            </div>
          )}
          <div className="w-full h-[2px] bg-f2f2f2 mb-6"></div>
          
          {/* Matches Section */}
          <div className="match-wraper">
            {game?.matches?.map((match, index) => 
              game?.isLeague 
                ? renderLeagueMatch(match, index)
                : renderRegularMatch(match, index)
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewTournamentScore;
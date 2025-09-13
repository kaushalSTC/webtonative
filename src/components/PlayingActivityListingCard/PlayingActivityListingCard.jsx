import { Link } from "react-router";
import {
  AcceptIcon,
  DummyProfileImage,
  GreenArrow,
  PendingIcon,
  RejectIcon,
} from "../../assets";
import { formatDateObject } from "../../utils/utlis";
import { useSelector } from "react-redux";
import { useEffect } from "react";

const PlayingActivityListingCard = ({ game, disabled = false }) => {
  const gameId = game?.gameId;
  const gameHandle = game?.handle;
  const tournamentHandle = game?.tournamentHandle;
  const fixtureId = game?.fixtureId;
  const playerID = useSelector((state) => state.player.id);
  const firstMatch = game?.matches?.[0];
  
  const renderTeam = (team, isLeague, playerTeams = []) => {
    if (!team || team.length === 0) {
      // Show BYE player when team is empty
      return (
        <div className="flex items-center gap-3 pb-2">
          <div>
            <img
              src={DummyProfileImage}
              alt="bye-player"
              className="w-10 h-10 rounded-full"
            />
          </div>
          <p className="font-general font-semibold text-sm md:text-base capitalize text-383838">
            BYE
          </p>
        </div>
      );
    }
    if (isLeague) {
      return team.map((team, index) => (
        <div key={index} className="flex items-center gap-3 pb-2">
          <div>
            <img
              src={team?.teamLogo || DummyProfileImage}
              alt="profile-image"
              className="w-10 h-10 rounded-full"
            />
          </div>
          <p
            className={`font-general font-semibold text-sm md:text-base capitalize ${
              playerTeams.includes(team?.teamId)
                ? "text-244cb4"
                : "text-383838"
            }`}
          >
            {team?.teamName || "Picklebay Player"}
          </p>
        </div>
      ));
    } else {
      return team.map((player, index) => (
        <div key={index} className="flex items-center gap-3 pb-2">
          <div>
            <img
              src={
                player?.profilePic ||
                player?.playerDetails?.profilePic ||
                DummyProfileImage
              }
              alt="profile-image"
              className="w-10 h-10 rounded-full"
            />
          </div>
          <p
            className={`font-general font-semibold text-sm md:text-base capitalize ${
              player?.playerId === playerID ? "text-244cb4" : "text-383838"
            }`}
          >
            {player?.name || player?.playerDetails?.name || "Picklebay Player"}
            {(player?.status === "PENDING" ||
              player?.playerDetails?.status === "PENDING") && (
              <img
                src={PendingIcon}
                alt="pending-icon"
                className="w-4 h-4 inline-block ml-3 align-middle"
              />
            )}
            {(player?.status === "REJECTED" ||
              player?.playerDetails?.status === "REJECTED") && (
              <img
                src={RejectIcon}
                alt="rejected-icon"
                className="w-4 h-4 inline-block ml-3 align-middle"
              />
            )}
            {(player?.status === "ACCEPTED" ||
              player?.playerDetails?.status === "REJECTED") && (
              <img
                src={AcceptIcon}
                alt="rejected-icon"
                className="w-4 h-4 inline-block ml-3 align-middle"
              />
            )}
          </p>
        </div>
      ));
    }
  };

  return (
    <Link
      to={
        game?.isGame
          ? `/games/${gameHandle}/score-details`
          : `/tournaments/${tournamentHandle}/scores/fixture/${game?.fixtureId}`
      }
      className={`${disabled ? "pointer-events-none" : "cursor-pointer"}`}
    >
      <div className="border border-f0f0f0 rounded-3xl p-5 md:px-4 shadow-lg">
        <div className="flex items-center justify-between mb-2">
          <p className="font-general font-medium text-sm md:text-base text-383838 capitalize w-[65%] line-clamp-1">
            {game?.name}
          </p>
          {(game?.categoryName || game?.roundName) && (
            <p className="font-general font-regular text-383838 text-xs md:text-sm opacity-70 capitalize text-right w-[30%] line-clamp-1">
              {game?.categoryName}
              {game?.categoryName && game?.roundName ? " | " : ""}
              {game?.roundName}
            </p>
          )}
        </div>
        <div className="flex items-center justify-between">
          <p className="font-general font-medium text-xs md:text-sm text-383838 capitalize opacity-70">
            {formatDateObject(game?.date, {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
          <p className="font-general font-medium text-xs md:text-sm text-383838 capitalize opacity-70">
            {game?.skillLevel}
          </p>
          <p className="font-general font-medium text-xs md:text-sm text-383838 capitalize border border-383838 py-1 px-2 rounded-2xl">
            {game?.isCreator
              ? "game creator"
              : game?.isGame
              ? "game joined"
              : "tournament"}
          </p>
        </div>
        <div className="flex items-center justify-between mt-5 pt-4 border-t border-f2f2f2">
          <p className="font-general font-medium text-xs md:text-sm text-383838 capitalize opacity-70">
            {game?.isLeague ? "Teams" : "Players"}
          </p>
          <p className="font-general font-medium text-xs md:text-sm text-383838 capitalize opacity-70">
            Scores
          </p>
        </div>

        {firstMatch && (
          <div className="matches">
            <div className="match flex flex-col gap-7 divide-y divide-f4f5ff">
              <div className="team1 flex items-center justify-between py-4">
                <div className="players">
                  {renderTeam(
                    firstMatch.team1,
                    game?.isLeague,
                    game?.playerTeams
                  )}
                </div>
                <div className="scores flex items-center gap-2">
                  {/* Green arrow for team1 if matchWinner === 1 */}
                  {firstMatch.matchWinner === 1 && (
                    <img
                      src={GreenArrow}
                      alt="profile-activity"
                      className="w-auto h-[15px] inline-block mr-[6px] "
                    />
                  )}
                  <div className="flex items-center gap-3">
                    {firstMatch.sets?.map((set, index) => (
                      <p
                        className="font-general font-medium text-383838 text-sm md:text-base capitalize"
                        key={index}
                      >
                        {set?.scoreTeam1}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
              <div className="team2 flex items-center justify-between">
                <div className="player">
                  {renderTeam(
                    firstMatch.team2,
                    game?.isLeague,
                    game?.playerTeams
                  )}
                </div>
                <div className="scores flex items-center gap-2">
                  {/* Green arrow for team2 if matchWinner === 2 */}
                  {firstMatch.matchWinner === 2 && (
                    <img
                      src={GreenArrow}
                      alt="profile-activity"
                      className="w-auto h-[15px] inline-block mr-[6px] "
                    />
                  )}
                  <div className="flex items-center gap-3">
                    {firstMatch.sets?.map((set, index) => (
                      <p
                        className="font-general font-medium text-383838 text-sm md:text-base capitalize"
                        key={index}
                      >
                        {set?.scoreTeam2}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Link>
  );
};

export default PlayingActivityListingCard;

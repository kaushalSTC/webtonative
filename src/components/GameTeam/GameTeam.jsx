import { useEffect, useMemo, useState } from "react";
import GamePlayerSelect from "../GamePlayerSelect/GamePlayerSelect";
import { useSearchPlayersQuery } from "../../hooks/PlayerHooks";
import { useAddPlayerInGame } from "../../hooks/GameHooks";
import { use } from "react";
import { useSelector } from "react-redux";
import { DummyProfileImage } from "../../assets";
import { createErrorToast, createToast } from "../../utils/utlis";
import { debounce } from "lodash";

const GameTeam = ({
  teamNumber,
  match,
  gameFormat,
  matchIndex,
  allMatches,
  setAllMatches,
  acceptedPlayers,
  gameId,
  refetch,
  gameHandle
}) => {
  const [showAddPlayerModal, setShowAddPlayerModal] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedNewPlayerId, setSelectedNewPlayerId] = useState(null);
  const [activeSelect, setActiveSelect] = useState(null);
  const debouncedUpdateQuery = useMemo(
    () =>
      debounce((val) => {
        setSearchQuery(val);
      }, 400),
    []
  );

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setInputValue(val);
    debouncedUpdateQuery(val);
  };

  useEffect(() => {
    return () => debouncedUpdateQuery.cancel();
  }, [debouncedUpdateQuery]);

  const playerId = useSelector((state) => state.player.id);

  const { data: searchedPlayers = [], isLoading: isSearching } = useSearchPlayersQuery(searchQuery, {
    enabled: searchQuery.length > 1,
  });

  const {
    mutate: addPlayer,
    isPending: isAddingPlayer,
  } = useAddPlayerInGame();

  const teamKey = `team${teamNumber}`;

  const handlePlayerSelect = (playerIndex, selectedId) => {
    const updatedMatches = [...allMatches];
    const updatedMatch = { ...updatedMatches[matchIndex] };
    const updatedTeam = [...updatedMatch[teamKey]];
    const updatedPlayer = { ...updatedTeam[playerIndex], playerId: selectedId };

    updatedTeam[playerIndex] = updatedPlayer;
    updatedMatch[teamKey] = updatedTeam;
    updatedMatches[matchIndex] = updatedMatch;

    setAllMatches(updatedMatches);
  };

  const getFilteredOptions = (currentIndex) => {
    const allSelectedIds = [...(match.team1 || []), ...(match.team2 || [])]
      .map((p) => p.playerId)
      .filter(Boolean);

    const currentPlayerId = match[teamKey][currentIndex]?.playerId;

    const filteredPlayers = acceptedPlayers.filter(
      (p) =>
        !allSelectedIds.includes(p.playerId) || p.playerId === currentPlayerId
    );

    return [
      ...filteredPlayers,
      {
        playerId: "add-player",
        playerDetails: { name: "Add Player", profilePic: null },
      },
    ];
  };

  const openAddPlayerModal = () => {
    setSearchQuery("");
    setSelectedNewPlayerId(null);
    setShowAddPlayerModal(true);
    setInputValue("");
  };

  const handleAddNewPlayer = () => {
    if (!selectedNewPlayerId) return;

    addPlayer(
      {
        playerId: playerId,
        gameHandle,
        playerObj: { playerId: selectedNewPlayerId }, // <-- this is the body
      },
      {
        onSuccess: () => {
          setShowAddPlayerModal(false);
          setSelectedNewPlayerId(null);
          refetch?.(); // Refresh the list
          createToast('Player added successfully');
        },
      },
      {
        onError: (error) => {
          createErrorToast(error?.response?.data?.message || 'Failed to add player');
        }
      }
    );
  };


  return (
    <>
      <div className="flex flex-col gap-4">
        <p className="font-medium text-sm md:text-base capitalize">
          {gameFormat === "SE" ? "Player" : "Team"} {teamNumber}
        </p>
        {match[teamKey].map((player, i) => {
          const selected =
            acceptedPlayers.find((p) => p.playerId === player.playerId) ||
            (player.playerId === "add-player"
              ? {
                playerId: "add-player",
                playerDetails: { name: "Add Player" },
              }
              : null);

          return (
            <GamePlayerSelect
              key={i}
              selectedPlayer={selected}
              onSelect={(id) => handlePlayerSelect(i, id)}
              onAddPlayerClick={openAddPlayerModal}
              playerOptions={getFilteredOptions(i)}
              isActive={
                activeSelect?.matchIndex === matchIndex &&
                activeSelect?.teamNumber === teamNumber &&
                activeSelect?.playerIndex === i
              }
              onToggle={() => {
                const isSame =
                  activeSelect?.matchIndex === matchIndex &&
                  activeSelect?.teamNumber === teamNumber &&
                  activeSelect?.playerIndex === i;

                setActiveSelect(isSame ? null : { matchIndex, teamNumber, playerIndex: i });
              }}
            />

          );
        })}
      </div>

      {/* Add Player Modal */}
      {showAddPlayerModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl w-[90%] max-w-md">
            <h2 className="font-general font-medium text-sm text-1c0e0eb3 md:text-base opacity-80 mb-4">Search Players By Name</h2>
            <input
              type="text"
              placeholder="Search players..."
              className="border border-[#244cb480] w-full p-2 rounded-[20px] mb-4 py-3 font-general font-medium text-sm text-1c0e0eb3 md:text-base placeholder:font-general placeholder:font-medium placeholder:text-sm placeholder:text-1c0e0eb3 placeholder:md:text-base"
              value={inputValue}
              onChange={handleSearchChange}
            />

            {isSearching && <p>Searching...</p>}

            <div className="max-h-40 overflow-y-auto space-y-2 mb-4">
              {searchedPlayers.map((player) => (
                <div
                  key={player._id}
                  className={`cursor-pointer p-2 flex items-center justify-between ${selectedNewPlayerId === player._id ? "bg-blue-100" : ""
                    }`}
                  onClick={() => setSelectedNewPlayerId(player?._id)}
                >
                  <div className="flex items-center gap-3">
                    <div>
                      <img src={player?.playerDetails?.profilePic || player?.profilePic || DummyProfileImage} alt="Profile Picture" className="w-10 h-10 rounded-full object-cover" />
                    </div>
                    <p className="font-general font-medium text-sm md:text-base text-383838 capitalize">{player?.playerDetails?.name || player?.name}</p>
                  </div>
                  <div className="bg-383838 text-white font-general font-medium text-sm w-fit py-2 px-6 rounded-[25px]">Add</div>
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 bg-gray-200 rounded font-general font-medium text-383838 text-sm"
                onClick={() => setShowAddPlayerModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50 font-general font-medium text-sm"
                disabled={!selectedNewPlayerId || isAddingPlayer}
                onClick={handleAddNewPlayer}
              >
                {isAddingPlayer ? "Adding..." : "Add"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default GameTeam;

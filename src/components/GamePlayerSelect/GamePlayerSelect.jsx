import { useState } from "react";
import { DummyProfileImage, FaqPlus } from "../../assets";

const GamePlayerSelect = ({ selectedPlayer, onSelect, playerOptions, onAddPlayerClick, isActive, onToggle }) => {

  return (
    <div className="relative w-[135px] md:w-[170px]">
      <div
        className="flex items-center gap-1 py-3 px-3 md:px-6 border border-[#959595] rounded-3xl cursor-pointer"
        onClick={onToggle}
      >
        {selectedPlayer && selectedPlayer.playerId !== "add-player" ? (
          <>
            <img
              src={selectedPlayer.playerDetails?.profilePic || DummyProfileImage}
              alt="Player"
              className="h-[20px] w-[20px] rounded-full"
            />
            <p className="text-sm md:text-base line-clamp-1">
              {selectedPlayer.playerDetails?.name || "Unnamed Player"}
            </p>
          </>
        ) : (
          <>
            <img src={FaqPlus} alt="Select" className="h-[20px]" />
            <p className="text-sm md:text-base line-clamp-1 text-383838 opacity-55">
              Select Player
            </p>
          </>
        )}
      </div>

      {isActive && (
        <div className="absolute z-10 bg-white shadow-lg rounded-md w-full max-h-40 overflow-auto mt-2">
          {playerOptions.map((player) => {
            const isAddOption = player.playerId === "add-player";
            return (
              <div
                key={player.playerId}
                className={`flex items-center gap-2 p-2 cursor-pointer hover:bg-gray-100 ${isAddOption ? "border-t border-gray-300 text-blue-600 font-medium" : ""
                  }`}
                onClick={() => {
                  if (isAddOption) {
                    onAddPlayerClick?.();
                  } else {
                    onSelect(player.playerId);
                    onToggle();
                  }
                }}
              >
                {!isAddOption && (
                  <img
                    src={player.playerDetails?.profilePic || DummyProfileImage}
                    alt={player.playerDetails?.name}
                    className="h-6 w-6 rounded-full"
                  />
                )}
                <p className="text-sm">{player.playerDetails?.name || "Unnamed Player"}</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default GamePlayerSelect;

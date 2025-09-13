import React from 'react';
import { TournamentIcon } from '../../../assets';

const STournamentFilter = ({ outerFilter, setOuterFilter }) => {
  return (
    <button
      onClick={() => setOuterFilter("Tournament")}
      className={`flex items-center bg-[#ABE400] whitespace-nowrap border border-[#56B918] rounded-[15px] opacity-100 px-2 py-3 md:py-4 font-medium text-sm transition-all ${outerFilter === "Tournament"
        ? "bg-244cb4 text-white"
        : "bg-white text-383838 border border-383838"
        }`}
    >
      <span className='w-4 h-4 mr-1 inline-block'>
        <img src={TournamentIcon} alt="tournament-icon" className="w-4 h-4" />
      </span>
      <span>
        Tournaments
      </span>
    </button>
  );
};

export default STournamentFilter;
import React from 'react';
import { EventIcon } from '../../../assets';

const SCommunityFilter = ({ outerFilter, setOuterFilter }) => {
  return (
    <button
      onClick={() => setOuterFilter("Community")}
      className={`flex items-center bg-[#ABE400] whitespace-nowrap border border-[#56B918] rounded-[15px] opacity-100 px-2 py-3 md:py-4 font-medium text-sm transition-all ${
        outerFilter === "Community"
          ? "bg-244cb4 text-white"
          : "bg-white text-383838 border border-383838"
      }`}
    >
      <span className='w-4 h-4 mr-1 inline-block'>
        <img src={EventIcon} alt="event-icon" className="w-4 h-4" />
      </span>
      <span>
      Community Events
      </span>
    </button>
  );
};

export default SCommunityFilter;
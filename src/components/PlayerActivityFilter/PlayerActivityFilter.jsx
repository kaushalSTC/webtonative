import React from 'react';
import { StatsIcon } from '../../assets';

const FILTERS = [
  { label: 'All Formats', value: 'all' },
  { label: 'Tournaments', value: 'tournament' },
  { label: 'Games', value: 'game' },
];

const PlayerActivityFilter = ({ selected, onFilterChange }) => {
  return (
    <div className="my-6 mt-6 md:mt-12">
      <div className="flex items-center gap-2 mb-6">
        <img src={StatsIcon} alt="profile-activity" className="w-auto h-[15px] inline-block mr-[6px] " />
        <span className="font-general font-medium text-base md:text-lg text-383838">Playing History</span>
      </div>
      <div className="flex gap-4 items-center overflow-x-auto whitespace-nowrap scrollbar-hide md:overflow-visible md:whitespace-normal">
        {FILTERS.map((filter) => (
          <button
            key={filter.value}
            className={`px-5 py-[7px] whitespace-nowrap rounded-full border border-383838 font-general font-medium text-sm md:text-base transition-colors duration-150 ${
              selected === filter.value
                ? 'bg-383838 text-white'
                : 'bg-white text-383838'
            }`}
            onClick={() => onFilterChange(filter.value)}
          >
            {filter.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default PlayerActivityFilter;

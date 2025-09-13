import React from 'react';

function VenueFilters({ onFilterChange, activeFilters }) {
  const handleFilterChange = (e) => {
    const { value, checked } = e.target;
    onFilterChange(value, checked);
  };

  return (
    <div className='grid max-md:grid-cols-2 md:flex items-center justify-between px-5 gap-7'>
      <p className='max-md:text-sm max-md:opacity-70 text-1c0e0eb3 text-[16px] font-general font-medium'>
        Available Venues
      </p>
      <div className='max-md:row-start-2 max-md:col-span-2 overflow-x-auto whitespace-nowrap align-middle gap-3 flex [&::-webkit-scrollbar]:hidden'>
        <div className='block'>
          <input 
            type="checkbox" 
            value="2" 
            id="venue-filter-2km" 
            className="hidden peer"
            checked={activeFilters.radius === "2"}
            onChange={handleFilterChange}
          />
          <label htmlFor="venue-filter-2km" className="max-md:text-xs block border-383838 rounded-3xl cursor-pointer select-none border px-3 py-2 text-383838 text-[14px] font-general font-medium peer-checked:bg-383838 peer-checked:text-white">
            Within 2km
          </label>
        </div>
        <div className='block'>
          <input 
            type="checkbox" 
            value="5" 
            id="venue-filter-5km" 
            className="hidden peer"
            checked={activeFilters.radius === "5"}
            onChange={handleFilterChange}
          />
          <label htmlFor="venue-filter-5km" className="max-md:text-xs block border-383838 rounded-3xl cursor-pointer select-none border px-3 py-2 text-383838 text-[14px] font-general font-medium peer-checked:bg-383838 peer-checked:text-white">
            Within 5km
          </label>
        </div>
        <div className='block'>
          <input 
            type="checkbox" 
            value="indoor" 
            id="indoor" 
            className="hidden peer"
            checked={activeFilters.tags === "indoor"}
            onChange={handleFilterChange}
          />
          <label htmlFor="indoor" className="max-md:text-xs block border-383838 rounded-3xl cursor-pointer select-none border px-3 py-2 text-383838 text-[14px] font-general font-medium peer-checked:bg-383838 peer-checked:text-white">
            Indoor Courts
          </label>
        </div>
        <div className='block'>
          <input 
            type="checkbox" 
            value="outdoor" 
            id="outdoor" 
            className="hidden peer"
            checked={activeFilters.tags === "outdoor"}
            onChange={handleFilterChange}
          />
          <label htmlFor="outdoor" className="max-md:text-xs block border-383838 rounded-3xl cursor-pointer select-none border px-3 py-2 text-383838 text-[14px] font-general font-medium peer-checked:bg-383838 peer-checked:text-white">
            Outdoor Courts
          </label>
        </div>
        <div className='block'>
          <input 
            type="checkbox" 
            value="night" 
            id="night" 
            className="hidden peer"
            disabled
          />
          <label htmlFor="night" className="max-md:text-xs block border-383838 rounded-3xl cursor-pointer select-none border px-3 py-2 text-383838 text-[14px] font-general font-medium peer-checked:bg-383838 peer-checked:text-white opacity-50">
            Late Night
          </label>
        </div>
      </div>
      <p className='max-md:text-end max-md:col-start-2 max-md:col-end-3 max-md:font-regular font text-xs md:text-sm text-383838 text-[14px] font-medium font-general opacity-70'>
        Showing {activeFilters.totalResults || 0} Results
      </p>
    </div>
  );
}

export default VenueFilters;
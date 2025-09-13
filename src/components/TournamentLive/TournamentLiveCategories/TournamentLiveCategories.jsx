import { useEffect, useState, useRef } from 'react'
import { useTournamentCategoryFixtures, useTournamentCategorySchedule } from '../../../hooks/TournamentLiveHooks';
import TournamentLiveData from '../TournamentLiveData/TournamentLiveData';
import { useDispatch } from 'react-redux';
import { setEventFormat } from '../../../store/reducers/EventFormat-slice';

const TournamentLiveCategories = (tournament) => {
  const tournamentHandle = tournament?.tournament?.handle; 
  const tournametCategories = tournament?.tournament?.categories;
  const [selectedCategory, setSelectedCategory] = useState(0);
  const [selectedCategoryID, setSelectedCategoryID] = useState(tournametCategories[0]._id); 
  const {data: Fixtures, isLoading, isError, error } = useTournamentCategoryFixtures({tournamentHandle, categoryId: selectedCategoryID }); 
  const {data: Schedule, isLoading: isLoadingSchedule, isError: isErrorSchedule, error: errorSchedule } = useTournamentCategorySchedule({tournamentHandle, categoryId: selectedCategoryID });
  
  const EventFormat = tournametCategories[selectedCategory]?.format
  
  // Custom dropdown state
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);


  if(!tournametCategories) {
    return
  } 

  const handleCategoryChange = (index) => {
    setSelectedCategory(index);
    setSelectedCategoryID(tournametCategories[index]._id);
    setIsDropdownOpen(false);
  };

  return (
    <div className='w-full gap-2'>
      {tournametCategories?.length > 1 ? (
        <div className='flex bg-white px-9 md:px-20 py-10 pb-8 items-center justify-between gap-3 flex-wrap'>
          <p className='font-general font-medium text-sm md:text-base text-383838 opacity-70 capitalize'>categories</p>
          
          {/* Custom dropdown */}
          <div className='relative' ref={dropdownRef}>
            <div 
              className='border border-707070 rounded-full px-4 py-1 flex items-center justify-between min-w-[180px] cursor-pointer'
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <span className='font-general font-medium text-383838 text-sm md:text-base capitalize leading-tight'>
                {tournametCategories[selectedCategory].categoryName}
              </span>
              <svg 
                className={`w-4 h-4 ml-2 transition-transform duration-200 ${isDropdownOpen ? 'transform rotate-180' : ''}`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </div>
            
            {isDropdownOpen && (
              <div className='absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto'>
                {tournametCategories.map((category, index) => (
                  <div 
                    key={index} 
                    className={`px-4 py-2 cursor-pointer hover:bg-gray-100 ${selectedCategory === index ? 'bg-gray-50 font-medium' : ''}`}
                    onClick={() => handleCategoryChange(index)}
                  >
                    <span className='font-general text-383838 text-sm md:text-base capitalize'>
                      {category.categoryName}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>) : (
          <div className='bg-white md:px-20 py-6 pb-2'>
            {/* Empty div for proper layout */}
          </div>)
      }
      <TournamentLiveData Fixtures={Fixtures} Schedule={Schedule} EventFormat={EventFormat} />
    </div>
  )
}

export default TournamentLiveCategories
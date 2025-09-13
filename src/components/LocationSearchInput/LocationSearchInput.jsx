import { nanoid } from "nanoid";
import PropTypes from 'prop-types';
import { useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { SearchIcon } from '../../assets';
import useClickOutside from '../../hooks/UseClickOutside';
import useGooglePlaces from '../../hooks/useGooglePlaces';
import { setLocation } from '../../store/reducers/location-slice';
import { debounce } from '../../utils/utlis';

const LocationSearchInput = ({ className = '', closePopOverCallback }) => {
  const location = useSelector((state) => state.location);
  const dispatch = useDispatch();
  const { getPlaceDetailsByPlaceId, placePredictions, getPlacePredictions, isPlacePredictionsLoading } = useGooglePlaces();
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const searchRef = useRef(null);

  // Handle clicking outside of search component
  useClickOutside(searchRef, () => {
    setIsOpen(false);
  });

  // Create debounced version of getPlacePredictions
  const debouncedGetPredictions = debounce((value, getPlacePredictions) => {
    if (value.trim()) {
      getPlacePredictions({ input: value })
    }
  }, 800);

  // Handle input changes
  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    if (value.trim()) {
      debouncedGetPredictions(value, getPlacePredictions);
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  };

  // Handle suggestion selection
  const handleSuggestionClick = async (suggestion, callbackFn) => {
    setQuery(suggestion.description);
    setIsOpen(false);
    const geoLocationObj = await getPlaceDetailsByPlaceId(suggestion.place_id);
    dispatch(setLocation(geoLocationObj));

    if(callbackFn) {
      setTimeout(() => {
        callbackFn();
      }, 500);
    }
  };

  return (
    <div className={`${className} relative w-full max-w-md mt-2 md:mt-0"`} ref={searchRef}>
      <div className="relative">
        <input className="w-full p-4 md:p-5 pr-12 text-sm font-general font-medium text-383838 placeholder:text-sm placeholder:font-general placeholder:font-medium border border-244cb4 md:border-707070 rounded-r-20 focus:border focus:border-[#244CB480] focus:outline-hidden"
          type="text"
          value={query}
          placeholder={`Search Locations`}
          onChange={handleInputChange}
        />
        <img src={SearchIcon} alt="SearchIcon" className='absolute right-5 top-1/2 transform -translate-y-1/2 text-gray-400'/>
      </div>

      {/* Suggestions dropdown */}
      {isOpen && (
        <div className="absolute w-[90%] left-1/2 -translate-x-1/2 bottom-full lg:bottom-[unset] lg:mt-2 mb-2 lg:mb-0 bg-white border border-f0f0f0 rounded-r-20 shadow-lg max-h-60 overflow-y-auto">
          {
            isPlacePredictionsLoading
            ? <div className="p-4 text-center text-gray-500">Loading...</div>
            : placePredictions.length > 0
              ? <ul className="px-4">
                  { placePredictions.map((suggestion, index) => <li key={nanoid()} onClick={() => handleSuggestionClick(suggestion, closePopOverCallback)} className="py-4 px-[18px] border-b border-b-f0f0f0 hover:bg-gray-100 cursor-pointer text-383838 text-sm font-general font-medium"> {suggestion.description} </li> )}
                </ul>
              : query && <div className="p-4 text-center text-gray-500">No results found</div>
          }
        </div>
      )}
    </div>
  );
};

LocationSearchInput.propTypes = {
  className: PropTypes.string,
  closePopOverCallback: PropTypes.func,
};

export default LocationSearchInput;
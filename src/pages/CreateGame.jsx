import { useEffect, useRef, useState } from 'react'
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css'
import { CreateGameBanner } from '../assets'
import VenueSearch from '../components/CreateGame/VenueSearch'
import SelectFormat from '../components/CreateGame/SelectFormat';
import GameLevelSelector from '../components/GameLevelSelector/GameLevelSelector';
import PlayerNumberSelector from '../components/PlayerNumberSelector/PlayerNumberSelector';
import { useCreateGame } from '../hooks/GameHooks'
import useGooglePlaces from '../hooks/useGooglePlaces.jsx';
import { useSelector } from 'react-redux';
import { convertTimeRangeToObject, reverseDateFormat, createErrorToast, debounce } from '../utils/utlis';
import { useNavigate } from 'react-router';
import '../App.css'
import { nanoid } from 'nanoid'
import TimeInput from '../components/TimeInput/TimeInput.jsx'
import { useMemo } from 'react';

const CreateGame = () => {
  const [gameTitle, setGameTitle] = useState('');
  const [gameDate, setGameDate] = useState('');
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [newVenueHandle, setNewVenueHandle] = useState('');
  const [newVenueCity, setNewVenueCity] = useState('');
  const [newVenueLine1, setNewVenueLine1] = useState('');
  const [newVenueLine2, setNewVenueLine2] = useState('');
  const [newVenuePincode, setNewVenuePincode] = useState('');
  const [newVenueState, setNewVenueState] = useState('');
  const [isVenueNotListed, setIsVenueNotListed] = useState(false);
  const { mutate, isLoading, isError, error } = useCreateGame();
  const { getPlaceDetailsByPlaceId, placePredictions, getPlacePredictions, isPlacePredictionsLoading } = useGooglePlaces();
  const playerID = useSelector((state) => state.player.id);
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const [gameObj, setGameObj] = useState({});
  const navigate = useNavigate();
  const calendarRef = useRef(null);
  
  // Add this to track if the button should be disabled
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

  // Add this effect to check validation
  useEffect(() => {
    const isValid = gameTitle && gameDate && gameObj.format && gameObj.skillLevel && gameObj.maxPlayers && gameObj.time;

    const isVenueValid =
      (gameObj.gameLocation) ||
      (isVenueNotListed && newVenueHandle && newVenueLine1 && newVenueCity && newVenueState && newVenuePincode);

    setIsButtonDisabled(!(isValid && isVenueValid));
  }, [gameTitle, gameDate, gameObj, isVenueNotListed, newVenueHandle, newVenueLine1, newVenueCity, newVenueState, newVenuePincode]);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
    }
  }, [isLoggedIn])
  const handleName = (e) => {
    const name = e.target.value;
    setGameTitle(name);
    setGameObj((prev) => ({ ...prev, name }));
  };

  const debouncedGetPredictions = debounce((value, getPlacePredictions) => {
    if (value.trim()) {
      getPlacePredictions({ input: value })
    }
  }, 800);

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

  const handleSuggestionClick = async (suggestion) => {
    setQuery(suggestion.description);
    setIsOpen(false);
    const geoLocationObj = await getPlaceDetailsByPlaceId(suggestion.place_id);
    console.log("🚀 ~ handleSuggestionClick ~ geoLocationObj:", geoLocationObj)
    const { city, state, lat, lng, formatted_address } = geoLocationObj;
    if (city !== 'City not found') {
      setNewVenueCity(city);
    }
    if (city !== 'State not found') {
      setNewVenueState(state);
    }


    // Save coordinates for later use in custom venue creation
    setGameObj(prev => ({
      ...prev,
      customVenueCoordinates: [lng, lat]
    }));
  };

  const handleNewVenueName = (e) => {
    const inputValue = e.target.value;
    setNewVenueHandle(inputValue); // Keep input unchanged

    const formattedHandle = inputValue.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
    console.log("Formatted Handle:", formattedHandle);
  }

  const handleNewVenueCity = (e) => {
    const inputValue = e.target.value;
    setNewVenueCity(inputValue);
  }
  const handleNewVenueState = (e) => {
    const inputValue = e.target.value;
    setNewVenueState(inputValue);
  }

  const handleDate = (date) => {
    // Format date to YYYY-MM-DD for display
    const formattedDisplayDate = `${date.getFullYear()}-${(date.getMonth() + 1)
      .toString()
      .padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
    setGameDate(formattedDisplayDate);

    // Format date for API using the existing utility function
    const formattedAPIDate = reverseDateFormat(formattedDisplayDate);
    setGameObj((prev) => ({ ...prev, date: formattedAPIDate }));

    // Hide calendar after selection
    setShowCalendar(false);
  };

  const handleVenueSelect = (venue) => {
    console.log("🚀 ~ handleVenueSelect ~ venue:", venue)
    const { is_location_exact, ...filteredLocation } = venue.address.location;
    const filteredAddress = { ...venue.address, location: filteredLocation };
   
        const gameLocation = {
      handle: venue.handle,
      venueImage: venue?.bannerImages[0]?.url,
      address: filteredAddress,
    };

    console.log('venue',gameLocation);
    setGameObj((prev) => ({ ...prev, gameLocation }));
  };

  const handleFormatSelect = (format) => {
    setGameObj((prev) => ({ ...prev, format }));
  };

  const handleLevelSelect = (level) => {
    setGameObj((prev) => ({ ...prev, skillLevel: level }));
  };

  const handlePlayerNumberSelect = (number) => {
    setGameObj((prev) => ({ ...prev, maxPlayers: number }));
  };

  const handleTimeSelect = useMemo(() => {
    return (time) => {
      setGameObj((prev) => ({ ...prev, time }));
    };
  }, []); // Empty dependency array ensures the function is created only once

  const handleCreateGame = () => {
    // Create a copy of gameObj to avoid race conditions
    const finalGameObj = { ...gameObj };

    // If this is a custom venue (created by the user because it wasn't listed)
    if (isVenueNotListed && finalGameObj.gameLocation) {
      // Remove the venueImage field completely instead of setting it to empty string
      delete finalGameObj.gameLocation.venueImage;
    }

    // If we have a custom venue with coordinates from Google Maps search
    if (isVenueNotListed && gameObj.customVenueCoordinates && finalGameObj.gameLocation) {
      finalGameObj.gameLocation.address.location.coordinates = gameObj.customVenueCoordinates;
      delete finalGameObj.customVenueCoordinates; // Remove temporary field
    }

    // Submit the game
    mutate({ userID: playerID, gameObj: finalGameObj },
      {
        onSuccess: (data) => {
          const gameHandle = data?.data?.handle;
          navigate(`/games/${gameHandle}`, { state: { from: location.pathname } });
        },
        onError: (error) => {
          console.log(error, 'error');
          createErrorToast(error?.response?.data?.message || 'Failed to create game');
        }
      });
  };


  useEffect(() => {
    const handleClickOutside = (event) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target)) {
        setShowCalendar(false);
      }
    };

    if (showCalendar) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showCalendar]);

  useEffect(() => {
    console.log(gameObj, 'gameObj')
    console.log(newVenueHandle, 'newVenueHandle')
  }, [gameObj, newVenueHandle])

  // Add this effect to automatically update gameLocation when custom venue details change
  useEffect(() => {
    if (isVenueNotListed && newVenueHandle && newVenueLine1 && newVenueCity && newVenueState && newVenuePincode) {
      const formattedHandle = newVenueHandle.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");

      const gameLocation = {
        handle: formattedHandle,
        // Remove venueImage field completely
        address: {
          line1: newVenueLine1,
          line2: newVenueLine2 || "",
          city: newVenueCity,
          state: newVenueState,
          postalCode: newVenuePincode,
          location: {
            type: "Point",
            coordinates: gameObj.customVenueCoordinates || [0, 0]
          }
        }
      };

      setGameObj((prev) => ({ ...prev, gameLocation }));
    }
  }, [isVenueNotListed, newVenueHandle, newVenueLine1, newVenueLine2, newVenueCity, newVenueState, newVenuePincode]);

  // Get today's date for min date restriction
  const today = new Date();

  return (
    <div className='bg-f2f2f2'>
      <div className='w-full max-w-[712px] mx-auto'>
        <div className='relative'>
          <img src={CreateGameBanner} alt='Create Game Banner' className='w-full h-auto ' />
          <p className='font-author font-medium text-white text-2xl md:text-[34px] capitalize absolute top-[25px] md:top-[50px] left-[36px] md:left-[76px]'>Create a game</p>
        </div>
        {/* Venue Search */}
        <div className='bg-white py-[15px] md:py-9 px-9 md:px-19'>
          <p className='font-general font-medium text-sm md:text-base text-1c0e0eb3 capitalize'>Select venue</p>
          <VenueSearch saveVenue={handleVenueSelect} />
          <div className='flex items-center gap-1.5 mt-5 pl-2'>
            <p className='font-general font-medium text-sm md:text-base text-1c0e0eb3'>Venue is not listed?</p>
            <input type="checkbox" checked={isVenueNotListed} onChange={(e) => setIsVenueNotListed(e.target.checked)} className="" />
          </div>
          {isVenueNotListed && (
            <div className='flex flex-col gap-4 mt-4'>
              <div className='flex items-center gap-4'>
                <div className='flex flex-col gap-2 w-full'>
                  <p className='font-general font-medium text-sm md:text-base text-383838 capitalize'>Venue Name</p>
                  <input type="text" placeholder='Enter Venue Name' className='w-full focus:outline-hidden placeholder:font-general placeholder:font-medium placeholder:text-383838 placeholder:opacity-70 placeholder:text-sm md:placeholder:text-base font-general font-medium text-383838 opacity-70 text-sm md:text-base border border-383838 rounded-xl p-3' value={newVenueHandle} onChange={handleNewVenueName} />
                </div>
                <div className='flex flex-col gap-2 w-full relative'>
                  <p className='font-general font-medium text-sm md:text-base text-383838 capitalize'>Google Map</p>
                  <input type="text" placeholder='Search...' className='w-full focus:outline-hidden placeholder:font-general placeholder:font-medium placeholder:text-383838 placeholder:opacity-70 placeholder:text-sm md:placeholder:text-base font-general font-medium text-383838 opacity-70 text-sm md:text-base border border-383838 rounded-xl p-3' value={query} onChange={handleInputChange} />
                  {isOpen && (
                    <div className="absolute w-[90%] left-1/2 -translate-x-1/2 top-full lg:bottom-[unset] lg:mt-2 mb-2 lg:mb-0 bg-white border border-f0f0f0 rounded-r-20 shadow-lg max-h-60 overflow-y-auto z-10">
                      {
                        isPlacePredictionsLoading
                          ? <div className="p-4 text-center text-gray-500">Loading...</div>
                          : placePredictions.length > 0
                            ? <ul className="px-4">
                              {placePredictions.map((suggestion, index) => <li key={nanoid()} onClick={() => handleSuggestionClick(suggestion)} className="py-4 px-[18px] border-b border-b-f0f0f0 hover:bg-gray-100 cursor-pointer text-383838 text-sm font-general font-medium"> {suggestion.description} </li>)}
                            </ul>
                            : query && <div className="p-4 text-center text-gray-500">No results found</div>
                      }
                    </div>
                  )}
                </div>
              </div>
              <div className='flex items-center gap-4'>
                <div className='flex flex-col gap-2 w-full'>
                  <p className='font-general font-medium text-sm md:text-base text-383838 capitalize'>Line 1</p>
                  <input type="text" placeholder='Enter Venue Address' className='w-full focus:outline-hidden placeholder:font-general placeholder:font-medium placeholder:text-383838 placeholder:opacity-70 placeholder:text-sm md:placeholder:text-base font-general font-medium text-383838 opacity-70 text-sm md:text-base border border-383838 rounded-xl p-3' value={newVenueLine1} onChange={(e) => setNewVenueLine1(e.target.value)} />
                </div>
                <div className='flex flex-col gap-2 w-full'>
                  <p className='font-general font-medium text-sm md:text-base text-383838 capitalize'>Line 2</p>
                  <input type="text" placeholder='Enter Venue Address' className='w-full focus:outline-hidden placeholder:font-general placeholder:font-medium placeholder:text-383838 placeholder:opacity-70 placeholder:text-sm md:placeholder:text-base font-general font-medium text-383838 opacity-70 text-sm md:text-base border border-383838 rounded-xl p-3' value={newVenueLine2} onChange={(e) => setNewVenueLine2(e.target.value)} />
                </div>
              </div>
              <div className='flex items-center gap-4'>
                <div className='flex flex-col gap-2 w-full'>
                  <p className='font-general font-medium text-sm md:text-base text-383838 capitalize'>City</p>
                  <input type="text" placeholder='Enter Venue Address' className='w-full focus:outline-hidden placeholder:font-general placeholder:font-medium placeholder:text-383838 placeholder:opacity-70 placeholder:text-sm md:placeholder:text-base font-general font-medium text-383838 opacity-70 text-sm md:text-base border border-383838 rounded-xl p-3' value={newVenueCity} onChange={handleNewVenueCity} />
                </div>
                <div className='flex flex-col gap-2 w-full'>
                  <p className='font-general font-medium text-sm md:text-base text-383838 capitalize'>State</p>
                  <input type="text" placeholder='Enter Venue Address' className='w-full focus:outline-hidden placeholder:font-general placeholder:font-medium placeholder:text-383838 placeholder:opacity-70 placeholder:text-sm md:placeholder:text-base font-general font-medium text-383838 opacity-70 text-sm md:text-base border border-383838 rounded-xl p-3' value={newVenueState} onChange={handleNewVenueState} />
                </div>
              </div>
              <div className='flex items-center gap-4'>
                <div className='flex flex-col gap-2 w-full'>
                  <p className='font-general font-medium text-sm md:text-base text-383838 capitalize'>Pincode</p>
                  <input type="text" placeholder='Enter Venue Address' className='w-full focus:outline-hidden placeholder:font-general placeholder:font-medium placeholder:text-383838 placeholder:opacity-70 placeholder:text-sm md:placeholder:text-base font-general font-medium text-383838 opacity-70 text-sm md:text-base border border-383838 rounded-xl p-3' value={newVenuePincode} onChange={(e) => setNewVenuePincode(e.target.value)} />
                </div>
              </div>
            </div>
          )}
        </div>
        {/* Game Details */}
        <div className='bg-white py-[15px] md:py-9 px-9 md:px-19'>
          <p className='font-general font-medium text-sm md:text-base text-1c0e0eb3 capitalize'>Select Details</p>
          <div className='w-full border border-cecece rounded-[20px] p-4 md:p-5 mt-5 relative'>
            <input type="text" placeholder='Game title' value={gameTitle} className='w-full focus:border focus:border-none focus:outline-hidden placeholder:font-general placeholder:font-medium placeholder:text-383838 placeholder:opacity-70 placeholder:text-sm md:placeholder:text-base font-general font-medium text-383838 opacity-70 text-sm md:text-base' onChange={(e) => handleName(e)} />
          </div>
          <div className='w-full border border-cecece rounded-[20px] p-4 md:p-5 mt-5 relative'>
            <div
              onClick={() => setShowCalendar(!showCalendar)}
              className='w-full cursor-pointer font-general font-medium text-383838 opacity-70 text-sm md:text-base'
            >
              {gameDate ? gameDate : 'Select date'}
            </div>
            {showCalendar && (
              <div
                ref={calendarRef}
                className="absolute z-10 mt-2 bg-white shadow-lg border border-cecece rounded-lg w-[320px] left-1/2 transform -translate-x-1/2 p-4"
              >
                <Calendar
                  onChange={handleDate}
                  value={gameDate ? new Date(gameDate) : null}
                  minDate={new Date()}
                  className="border-none w-full"
                  tileClassName={({ date }) => {
                    const isSelected = gameDate && new Date(gameDate).setHours(0, 0, 0, 0) === new Date(date).setHours(0, 0, 0, 0);
                    const isToday = new Date().setHours(0, 0, 0, 0) === new Date(date).setHours(0, 0, 0, 0);

                    return isSelected || isToday ? 'selected-date' : '';
                  }}
                />
              </div>


            )}
          </div>
        </div>
        {/* Game Format */}
        <div className='bg-white py-[15px] md:py-9 px-9 md:px-19'>
          <p className='font-general font-medium text-sm md:text-base text-1c0e0eb3 capitalize'>Select format</p>
          <div className='w-full mt-5 relative'>
            <SelectFormat saveFormat={handleFormatSelect} />
          </div>
        </div>
        {/* Game Level */}
        <div className='bg-white py-[15px] md:py-9 px-9 md:px-19'>
          <p className='font-general font-medium text-sm md:text-base text-1c0e0eb3 capitalize'>Select Playing Level</p>
          <div className='w-full mt-5 relative'>
            <GameLevelSelector saveLevel={handleLevelSelect} />
          </div>
        </div>
        {/* Player Number */}
        <div className='bg-white py-[15px] md:py-9 px-9 md:px-19'>
          <p className='font-general font-medium text-sm md:text-base text-1c0e0eb3 capitalize'>Number of Players</p>
          <div className='w-full mt-5'>
            <PlayerNumberSelector savePlayerNumber={handlePlayerNumberSelect} />
          </div>
        </div>
        {/* Time */}
        <div className='bg-white py-[15px] md:py-9 px-9 md:px-19'>
          <p className='font-general font-medium text-sm md:text-base text-1c0e0eb3 capitalize'>Time</p>
          <div className='w-full mt-5'>
            <TimeInput onTimeChange={handleTimeSelect} />
          </div>
          <p className='font-general font-medium text-xs text-383838 opacity-70 mt-2 pl-2'>Enter Time in 24 hour format</p>
        </div>
        {/* Create Game Button */}
        <div className='px-19 bg-white py-10 flex justify-center flex-col items-center gap-2'>

          <button
            className={`cursor-pointer font-general w-full font-medium text-sm md:text-base text-white ${isButtonDisabled ? 'bg-gray-400' : 'bg-383838'
              } rounded-3xl w-[154px] md:w-full py-5 mx-auto flex justify-center items-center`}
            onClick={handleCreateGame}
            disabled={isLoading || isButtonDisabled}
          >
            {isLoading ? (
              <span className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-solid border-white border-r-transparent align-middle " />
            ) : (
              'Create Game'
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default CreateGame
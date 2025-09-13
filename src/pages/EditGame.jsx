import { useState, useEffect } from "react"
import { useParams } from "react-router"
import Calendar from 'react-calendar'
import { useGameDetails } from "../hooks/GameHooks";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { timeStampToDMY } from "../utils/utlis";
import VenueSearch from '../components/CreateGame/VenueSearch'
import { debounce, createErrorToast } from "../utils/utlis";
import { CreateGameBanner } from "../assets";
import SelectFormat from "../components/CreateGame/SelectFormat";
import GameLevelSelector from "../components/GameLevelSelector/GameLevelSelector";
import PlayerNumberSelector from "../components/PlayerNumberSelector/PlayerNumberSelector";
import SelectTime from "../components/SelectTime/SelectTime";
import { useUpdateGame } from "../hooks/GameHooks";
import useGooglePlaces from '../hooks/useGooglePlaces.jsx';

// Helper function to convert ISO date to YYYY-MM-DD format for HTML date input
const formatDateForInput = (isoDate) => {
    if (!isoDate) return '';
    // Handle both ISO string and DD/MM/YYYY formats
    if (isoDate.includes('T')) {
        // It's an ISO date string
        return isoDate.split('T')[0]; // Returns YYYY-MM-DD
    } else if (isoDate.includes('/')) {
        // It's already in DD/MM/YYYY format, convert to YYYY-MM-DD
        const parts = isoDate.split('/');
        return `${parts[2]}-${parts[1]}-${parts[0]}`; // Return YYYY-MM-DD
    }
    return isoDate;
};

// Helper function to parse date string to Date object
const parseDate = (dateString) => {
    if (!dateString) return null;

    if (dateString.includes('-')) {
        // Handle YYYY-MM-DD format
        const [year, month, day] = dateString.split('-').map(Number);
        return new Date(year, month - 1, day);
    } else if (dateString.includes('/')) {
        // Handle DD/MM/YYYY format
        const [day, month, year] = dateString.split('/').map(Number);
        return new Date(year, month - 1, day);
    } else if (dateString.includes('T')) {
        // Handle ISO format
        return new Date(dateString);
    }

    return null;
};

const EditGame = () => {
    const { handle } = useParams();
    const { data: gameData, isLoading: isGameLoading, isError, error, isSuccess } = useGameDetails(handle);
    const { mutate, isLoading, isError: isEditError, error: editError } = useUpdateGame();
    const [gameTitle, setGameTitle] = useState('')
    const [gameDate, setGameDate] = useState('')
    const [showCalendar, setShowCalendar] = useState(false)
    const [gameObj, setGameObj] = useState({})
    const playerID = useSelector((state) => state.player.id)
    const navigate = useNavigate()
    const isCreator = gameData?.data?.data?.isCreator
    const [isVenueNotListed, setIsVenueNotListed] = useState(false);
    const [newVenueHandle, setNewVenueHandle] = useState('');
    const [newVenueCity, setNewVenueCity] = useState('');
    const [newVenueLine1, setNewVenueLine1] = useState('');
    const [newVenueLine2, setNewVenueLine2] = useState('');
    const [newVenuePincode, setNewVenuePincode] = useState('');
    const [newVenueState, setNewVenueState] = useState('');
    const [query, setQuery] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const { getPlaceDetailsByPlaceId, placePredictions, getPlacePredictions, isPlacePredictionsLoading } = useGooglePlaces();

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
        setNewVenueHandle(inputValue);
    };

    const handleNewVenueCity = (e) => {
        const inputValue = e.target.value;
        setNewVenueCity(inputValue);
    };

    const handleNewVenueState = (e) => {
        const inputValue = e.target.value;
        setNewVenueState(inputValue);
    };

    useEffect(() => {
        if (gameData && !isGameLoading && isCreator) {
            const game = gameData?.data?.data?.game
            setGameTitle(game?.name)

            // Convert API date to format for date input
            const formattedDateForInput = formatDateForInput(game?.date);
            setGameDate(formattedDateForInput)

            setGameObj({
                name: game.name,
                date: timeStampToDMY(game?.date), // This is for the API in DD/MM/YYYY format
                gameLocation: game.gameLocation,
                format: game.format,
                skillLevel: game.skillLevel,
                maxPlayers: game.maxPlayers,
                time: game.time,
            })
        }
    }, [gameData, isGameLoading])

    const handleName = (e) => {
        const name = e.target.value
        setGameTitle(name)
        setGameObj((prev) => ({ ...prev, name }))
    }

    const handleDate = (date) => {
        // Format the date as YYYY-MM-DD for the input display
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const formattedInputDate = `${year}-${month}-${day}`;

        setGameDate(formattedInputDate);

        // Format as DD/MM/YYYY for the API
        const formattedAPIDate = `${day}/${month}/${year}`;

        setGameObj((prev) => ({ ...prev, date: formattedAPIDate }));

        // Hide calendar after selection
        setShowCalendar(false);
    }

    const handleVenueSelect = (venue) => {
        const { is_location_exact, ...filteredLocation } = venue.address.location
        const filteredAddress = { ...venue.address, location: filteredLocation }
        const gameLocation = {
            handle: venue.handle,
            venueImage: venue?.bannerImages[0]?.url,
            address: filteredAddress,
        }
        setGameObj((prev) => ({ ...prev, gameLocation }))
    }
    const handleFormatSelect = (format) => {
        setGameObj((prev) => ({ ...prev, format }))
    }
    const handleLevelSelect = (level) => {
        setGameObj((prev) => ({ ...prev, skillLevel: level }))
    }
    const handlePlayerNumberSelect = (number) => {
        setGameObj((prev) => ({ ...prev, maxPlayers: number }))
    }
    const handleTimeSelect = (time) => {
        setGameObj((prev) => ({ ...prev, time: time }))
    }

    useEffect(() => {
        if (isVenueNotListed && newVenueHandle && newVenueLine1 && newVenueCity && newVenueState && newVenuePincode) {
            const formattedHandle = newVenueHandle.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");

            const gameLocation = {
                handle: formattedHandle,
                // No venueImage field for custom venues
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

    const handleEditGame = () => {
        if (!gameData?.data?.data?.game) {
            console.error("Game data is missing");
            return;
        }
    
        const originalGame = gameData.data.data.game; // Original game details
        const updatedData = {};
    
        // Helper function to check if a value has changed
        const addIfChanged = (key, newValue, oldValue) => {
            if (newValue !== oldValue && newValue !== undefined) {
                updatedData[key] = newValue;
            }
        };
    
        // Compare fields and update only if they have changed
        addIfChanged("name", gameObj.name, originalGame.name);
        addIfChanged("date", gameObj.date, timeStampToDMY(originalGame.date));
        addIfChanged("format", gameObj.format, originalGame.format);
        addIfChanged("skillLevel", gameObj.skillLevel, originalGame.skillLevel);
        addIfChanged("maxPlayers", gameObj.maxPlayers, originalGame.maxPlayers);
    
        // Compare the startTime and endTime of the time object
        if (gameObj.time?.startTime !== originalGame.time?.startTime || gameObj.time?.endTime !== originalGame.time?.endTime) {
            updatedData.time = gameObj.time;
        }
    
        // Check if the venue was changed (rest of your venue update logic remains the same)
        if (isVenueNotListed) {
            const formattedHandle = newVenueHandle
                .toLowerCase()
                .replace(/\s+/g, "-")
                .replace(/[^a-z0-9-]/g, "");
    
            const existingLocation = originalGame.gameLocation || {};
    
            const newGameLocation = {
                handle: formattedHandle || existingLocation.handle,
                address: {
                    line1: newVenueLine1 || existingLocation.address?.line1,
                    line2: newVenueLine2 || existingLocation.address?.line2 || "",
                    city: newVenueCity || existingLocation.address?.city,
                    state: newVenueState || existingLocation.address?.state,
                    postalCode: newVenuePincode || existingLocation.address?.postalCode,
                    location: {
                        type: "Point",
                        coordinates: gameObj.customVenueCoordinates || existingLocation.address?.location?.coordinates || [0, 0],
                    }
                }
            };
    
            if (newGameLocation.handle && newGameLocation.address.city && newGameLocation.address.state && newGameLocation.address.postalCode) {
                updatedData.gameLocation = newGameLocation;
            }
        } else if (gameObj.gameLocation?.handle !== originalGame.gameLocation?.handle) {
            updatedData.gameLocation = gameObj.gameLocation;
        }
    
        // If nothing has changed, prevent API call
        if (Object.keys(updatedData).length === 0) {
            console.log("No changes detected");
            return;
        }
    
        console.log("Submitting mutation with:", { userID: playerID, handle, gameObj: updatedData });
    
        mutate(
            { userID: playerID, handle, gameObj: updatedData },
            {
                onSuccess: (data) => {
                    const gameHandle = data?.data?.game?.handle || handle;
                    console.log(data, "data");
                    navigate(`/games/${gameHandle}`);
                },
                onError: (error) => {
                    console.log(error, "error");
                    createErrorToast(error?.response?.data?.message || "Failed to update game");
                }
            }
        );
    };
    
    
    



    if (isGameLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <span className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-383838 border-r-transparent align-middle"></span>
            </div>
        )
    }

    if (!isCreator) {
        return (
            <div className='w-full h-screen flex justify-center items-center'>
                <p className='text-base text-383838 font-general font-medium opacity-80'>Only Creator can edit game</p>
            </div>
        )
    }

    // Get today's date for min date restriction
    const today = new Date();

    // Parse the currently selected date for the calendar
    const selectedDate = parseDate(gameDate);

    return (
        <div className='bg-f2f2f2'>
            <div className='w-full max-w-[712px] mx-auto'>
                <div className='relative'>
                    <img src={CreateGameBanner} alt='Create Game Banner' className='w-full h-auto ' />
                    <p className='font-author font-medium text-white text-2xl md:text-[34px] capitalize absolute top-[25px] md:top-[50px] left-[36px] md:left-[76px]'>Edit game</p>
                </div>
                {/* Venue Search */}
                <div className='bg-white py-[15px] md:py-9 px-9 md:px-19'>
                    <p className='font-general font-medium text-sm md:text-base text-1c0e0eb3 capitalize'>Select venue</p>
                    <VenueSearch saveVenue={handleVenueSelect} initialVenue={gameObj.gameLocation} />
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
                                                            {placePredictions.map((suggestion) => <li key={suggestion.place_id} onClick={() => handleSuggestionClick(suggestion)} className="py-4 px-[18px] border-b border-b-f0f0f0 hover:bg-gray-100 cursor-pointer text-383838 text-sm font-general font-medium"> {suggestion.description} </li>)}
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
                            <div className='absolute z-10 mt-2 bg-white shadow-lg top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-author font-medium border border-cecece overflow-hidden rounded-[0px]'>
                                <Calendar
                                    className='border-none'
                                    onChange={handleDate}
                                    value={selectedDate}
                                    minDate={today}
                                />
                            </div>
                        )}
                    </div>
                </div>
                {/* Game Format */}
                <div className='bg-white py-[15px] md:py-9 px-9 md:px-19'>
                    <p className='font-general font-medium text-sm md:text-base text-1c0e0eb3 capitalize'>Select format</p>
                    <div className='w-full mt-5 relative'>
                        <SelectFormat saveFormat={handleFormatSelect} initialFormat={gameObj.format} />
                    </div>
                </div>
                {/* Game Level */}
                <div className='bg-white py-[15px] md:py-9 px-9 md:px-19'>
                    <p className='font-general font-medium text-sm md:text-base text-1c0e0eb3 capitalize'>Select Playing Level</p>
                    <div className='w-full mt-5 relative'>
                        <GameLevelSelector saveLevel={handleLevelSelect} initialLevel={gameObj.skillLevel} />
                    </div>
                </div>
                {/* Player Number */}
                <div className='bg-white py-[15px] md:py-9 px-9 md:px-19'>
                    <p className='font-general font-medium text-sm md:text-base text-1c0e0eb3 capitalize'>Number of Players</p>
                    <div className='w-full mt-5'>
                        <PlayerNumberSelector savePlayerNumber={handlePlayerNumberSelect} initialNumber={gameObj.maxPlayers} />
                    </div>
                </div>
                {/* Time */}
                <div className='bg-white py-[15px] md:py-9 px-9 md:px-19'>
                    <p className='font-general font-medium text-sm md:text-base text-1c0e0eb3 capitalize'>Time</p>
                    <div className='w-full mt-5'>
                        <SelectTime onTimeChange={handleTimeSelect} initialTime={gameObj.time} />
                    </div>
                </div>
                {/* Edit Game Button */}
                <div className='px-19 bg-white py-10 flex justify-center flex-col items-center gap-2'>
                    <button
                        className='cursor-pointer font-general font-medium text-sm md:text-base text-white bg-383838 rounded-3xl w-[154px] md:w-full py-5 mx-auto flex justify-center items-center'
                        onClick={handleEditGame}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <span className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-solid border-white border-r-transparent align-middle " />
                        ) : (
                            'Update Game'
                        )}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default EditGame
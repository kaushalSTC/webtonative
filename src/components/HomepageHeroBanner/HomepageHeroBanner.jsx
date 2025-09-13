import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { HomepageBannerDesktopImg, HomepageBannerMobileImg, LocationPrimary } from "../../assets";
import useGooglePlaces from "../../hooks/useGooglePlaces";
import { setLocation } from '../../store/reducers/location-slice';
import { debounce } from '../../utils/utlis';


const HomepageHeroBanner = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { getPlaceDetailsByPlaceId, placePredictions, getPlacePredictions, isPlacePredictionsLoading } = useGooglePlaces();
    const [isOpen, setIsOpen] = useState(false);
    const city = useSelector((state) => state.location.city);
    const [query, setQuery] = useState(city || '');
    const heading = "Discover";
    const subHeading = "Pickleball courts near you";

    useEffect(() => {
        if (city) {
            setQuery(city);
        }
    }, [city]);

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
        dispatch(setLocation(geoLocationObj));
        setIsOpen(false);
    };

    return (
        <div className="w-full  aspect-[388/440] sm:aspect-[1366/425] relative">
            <img src={HomepageBannerDesktopImg} alt="homepage-banner" className="absolute inset-0 w-full h-full object-cover " />
            <img src={HomepageBannerMobileImg} alt="homepage-banner" className="absolute inset-0 w-auto h-full object-cover sm:hidden " />
            <div className="absolute top-2/3 md:top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-left text-white w-[90%] max-w-[812px]">
                <h1 className="text-[44px] font-medium font-author leading-none">{heading}</h1>
                <p className="text-sm font-medium font-general mb-4">{subHeading}</p>
                <div className="flex flex-col sm:flex-row gap-4 sm:gap-0 w-full sm:border border-fcfdff items-center rounded-r-20">
                    <p className="bg-white text-383838  font-general font-medium text-sm py-4 px-5 rounded-tl-[15px] rounded-bl-[15px] hidden sm:block">{city}</p>
                    <div className="flex items-center grow ml-0 sm:ml-5 bg-white-200 gap-2 relative border border-ffffff sm:border-none py-4 px-5 sm:px-0 sm:py-0 w-full sm:w-auto rounded-r-20 sm:rounded-none">
                        <img src={LocationPrimary} alt="location-icon" width="13px" height="17px " />
                        <input type="text"
                            value={query}
                            name=""
                            className="grow select-none focus:outline-none focus:ring-0"
                            placeholder="Search Localities"
                            onChange={handleInputChange}
                            id=" " />

                        {isOpen && (
                            <div className="absolute w-[90%] left-1/2 -translate-x-1/2 top-full mt-2 bg-white border border-f0f0f0 rounded-r-20 shadow-lg max-h-60 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                                {
                                    isPlacePredictionsLoading
                                        ? <div className="p-4 text-center text-gray-500">Loading...</div>
                                        : placePredictions.length > 0
                                            ? <ul className="px-4">
                                                {placePredictions.map((suggestion, index) => <li key={index} onClick={() => handleSuggestionClick(suggestion)} className="py-4 px-[18px] border-b border-b-f0f0f0 hover:bg-gray-100 cursor-pointer text-383838"> {suggestion.description} </li>)}
                                            </ul>
                                            : query && <div className="p-4 text-center text-gray-500">No results found</div>
                                }
                            </div>
                        )}

                    </div>
                    <button className="ml-auto bg-white py-[10px] px-5 mr-1 rounded-[15px] text-1c4ba3 font-general font-medium text-base w-full sm:w-auto cursor-pointer" onClick={() => navigate('/venues')}>Show Courts</button>
                </div>
            </div>
        </div>
    );

};

export default HomepageHeroBanner;

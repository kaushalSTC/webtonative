import React, { useEffect, useState } from 'react'
import { VenueSearchIcon } from '../../assets'
import { useSearchVenue } from '../../hooks/VenueHooks'
import { formatAddress } from '../../utils/utlis'

const VenueSearch = ({ saveVenue, initialVenue }) => {
    const [searchQuery, setSearchQuery] = useState('')
    const [isOpen, setIsOpen] = useState(false)
    const [selectedVenue, setSelectedVenue] = useState(null)
    const { data, isLoading, isError, error } = useSearchVenue(searchQuery)
    const venueSearchResult = data?.data?.data?.data || [];

    // Set initial venue if provided
    useEffect(() => {
        if (initialVenue && !selectedVenue) {
            setSelectedVenue(initialVenue)
            setSearchQuery(initialVenue.name || formatAddress(initialVenue.address))
        }
    }, [initialVenue])

    const handleInputChange = (e) => {
        setSearchQuery(e.target.value)
        setIsOpen(true)
        // Clear selected venue when user starts typing a new search
        if (selectedVenue) {
            setSelectedVenue(null)
        }
    }

    const handleSelectedVenue = (venue) => {
        setIsOpen(false)
        setSearchQuery(venue.name)
        setSelectedVenue(venue)
        saveVenue(venue)
    }

    // Close dropdown when search is empty
    useEffect(() => {
        if (!searchQuery.length) {
            setIsOpen(false)
        }
    }, [searchQuery])

    return (
        <div className='w-full border border-cecece rounded-[20px] p-4 md:p-5 mt-5 relative'>
            <div className='flex'>
                <input 
                    type="text" 
                    value={searchQuery} 
                    placeholder='Search Venues' 
                    onChange={handleInputChange} 
                    className='w-full focus:border focus:border-none focus:outline-hidden placeholder:font-general placeholder:font-medium placeholder:text-383838 placeholder:opacity-70 placeholder:text-sm md:placeholder:text-base font-general font-medium text-383838 opacity-70 text-sm md:text-base' 
                />
                <img src={VenueSearchIcon} alt="Search Icon" className='w-5 h-5 '/>
            </div>

            {isOpen && venueSearchResult.length == 0 && (
                <div className='absolute w-[90%] top-[110%] rounded-2xl left-1/2 -translate-x-1/2 border border-cecece px-3 max-h-[200px] overflow-y-auto z-10 bg-white'>
                    <div className='h-[50px] flex items-center'>
                        <p className='font-general font-medium text-sm md:text-base text-383838 capitalize'>No venues found</p>
                    </div>
                </div>
            )}
            
            {isOpen && venueSearchResult.length > 0 && (
                <div className='absolute w-[90%] top-[110%] rounded-2xl left-1/2 -translate-x-1/2 border border-cecece px-3 max-h-[200px] overflow-y-auto z-10 bg-white'>
                    {venueSearchResult.map((venue) => {
                        return (
                            <div className='border-b border-cecece py-3 cursor-pointer' key={venue._id} onClick={() => handleSelectedVenue(venue)}>
                                <p className='font-general font-medium text-sm md:text-base text-383838 capitalize'>{venue.name}</p>
                                <p className='font-general font-medium text-xs md:text-sm text-383838'>{formatAddress(venue.address)}</p>
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}

export default VenueSearch
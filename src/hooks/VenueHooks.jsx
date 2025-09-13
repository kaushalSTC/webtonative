import { searchVenues } from "../api/venue"
import { useQuery } from '@tanstack/react-query'

export const useSearchVenue = (searchQuery) => { 
    return useQuery({
        queryKey: ['venues', searchQuery],
        queryFn: () => searchVenues(searchQuery),
        enabled: !!searchQuery,
    })
}
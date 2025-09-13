import axios from 'axios'

/* 
  ┌─────────────────────────────────────────────────────────────────────────┐
  │ // Search Venues                                                        │
  └─────────────────────────────────────────────────────────────────────────┘
 */

export const searchVenues = async ( name ) => {
    if(!name) return
    const baseURL = import.meta.env.VITE_DEV_URL;
    const response = await axios.get(`${baseURL}/api/public/venues?name=${name}`);
    if (response.status !== 200) {
        throw new Error("Failed to fetch venues");
    }
    return response;
}
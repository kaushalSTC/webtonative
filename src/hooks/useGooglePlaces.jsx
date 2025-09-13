import { get } from 'lodash';
import { useCallback, useEffect, useState } from 'react';
import useGoogle from 'react-google-autocomplete/lib/usePlacesAutocompleteService';

const getCityFromResponse = (response) => {
  const addressComponents = response.address_components;
  const cityComponent = addressComponents.find(component => component.types.includes('locality'));
  if (cityComponent) {
    return cityComponent.long_name;
  } else {
    return 'City not found';
  }
};
const getStateFromResponse = (response) => {
  const addressComponents = response.address_components;
  const cityComponent = addressComponents.find(component => component.types.includes('administrative_area_level_1'));
  if (cityComponent) {
    return cityComponent.long_name;
  } else {
    return 'State not found';
  }
};

const useGooglePlaces = (fields = ['geometry', 'formatted_address', 'place_id', 'name', 'address_components'], apiKey = `${import.meta.env.VITE_GOOGLE_MAPS_KEY}`) => {
  const [isLoaded, setIsLoaded] = useState(false);

  const { placesService, placePredictions, getPlacePredictions, isPlacePredictionsLoading } = useGoogle({apiKey, libraries: ['places']});

  useEffect(() => {
    if (placesService) {
      setIsLoaded(true);
    }
  }, [placesService]);

  const getPlaceDetailsByLatLng = useCallback(
    async (lat, lng) => {
      return new Promise((resolve, reject) => {
        const geocoder = new window.google.maps.Geocoder();

        geocoder.geocode({ location: { lat, lng } }, (results, status) => {
          if (status !== 'OK' || !results[0]) {
            reject(`Geocoder failed due to: ${status}`);
            return;
          }

          const placeId = results[0].place_id;
          const placeServiceOptions = {placeId};

          placesService.getDetails(placeServiceOptions, (place, status) => {
            if (status !== 'OK') {
              reject(`PlacesService failed due to: ${status}`);
              return;
            }

            const geoLocationData = {
              formatted_address: place.formatted_address,
              lat: typeof place.geometry.location.lat === "function" ? place.geometry.location.lat() : place.geometry.location.lat,
              lng: typeof place.geometry.location.lng === "function" ? place.geometry.location.lng() : place.geometry.location.lng,
              name: place.name,
              place_id: place.place_id,
              city: getCityFromResponse(place)
            };
  
            resolve(geoLocationData);  // ✅ Only resolving serializable data
          });
        });
      });
    },
    [placesService]
  );
  

  const getPlaceDetailsByPlaceId = useCallback(
    async (placeId) => {
      return new Promise((resolve, reject) => {
        const placeServiceOptions = { placeId, fields: fields };
  
        placesService.getDetails(placeServiceOptions, (place, status) => {
          if (status !== 'OK') {
            reject(`PlacesService failed due to: ${status}`);
            return;
          }
  
          const formattedPlace = {
            formatted_address: place.formatted_address,
            lat: typeof place.geometry.location.lat === "function" ? place.geometry.location.lat() : place.geometry.location.lat,
            lng: typeof place.geometry.location.lng === "function" ? place.geometry.location.lng() : place.geometry.location.lng,
            name: place.name,
            place_id: place.place_id,
            city: getCityFromResponse(place),
            state: getStateFromResponse(place)
          };
  
          resolve(formattedPlace);  // ✅ Only returning serializable data
        });
      });
    },
    [placesService]
  );
  

  return {
    getPlaceDetailsByLatLng,
    getPlaceDetailsByPlaceId,
    placePredictions,
    getPlacePredictions,
    isPlacePredictionsLoading,
    isLoaded,
  };
};

export default useGooglePlaces;

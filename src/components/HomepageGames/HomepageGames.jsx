import React from 'react'
import { useSelector } from 'react-redux'
import { useGetGamesHomepage } from '../../hooks/GameHooks'
import ExploreGamesSlider from '../ExploreGamesSlider/ExploreGamesSlider';
import Loader from '../Loader/Loader';

const HomepageGames = () => {
    const lat = useSelector((state) => state.location.lat);
    const lng = useSelector((state) => state.location.lng);
    const locationParams = { lat, lng };
    const { data: games, isLoading } = useGetGamesHomepage(locationParams);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center mx-auto mt-10 max-md:mt-8 w-full h-[50vh] max-w-[1600px]">
                <Loader />
            </div>
        );
    }

    if (!games || (Array.isArray(games) && games.length === 0)) return null;
    return (
        <ExploreGamesSlider games={games} />
    )
}

export default HomepageGames
import React, { useState } from 'react';
import ExploreGamesSlider from '../ExploreGamesSlider/ExploreGamesSlider';
import { useGetGamesByVenue } from '../../hooks/GameHooks';
import Loader from '../Loader/Loader';

const VenueExploreGames = ({ venueHandle }) => {
  const { data: games, isLoading } = useGetGamesByVenue(venueHandle);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center mx-auto mt-10 max-md:mt-8 w-full h-[50vh] max-w-[1600px]">
        <Loader />
      </div>
    );
  }

  if (!games || (Array.isArray(games) && games.length === 0)) return null;

  return (
    <>
      <div className="w-full h-[10px] bg-f2f2f2 my-7 md:my-12"></div>
      <ExploreGamesSlider swiperPaddingDesktop="53px" swiperPaddingMobile="16px" headerSpacingDesktop="75px" headerSpacingMobile="36px" showSubtitle={false} games={games} />
    </>
  );
};

export default VenueExploreGames;

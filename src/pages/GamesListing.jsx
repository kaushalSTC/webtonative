import { nanoid } from "nanoid";
import { useEffect, useRef } from "react";
import GameCard from "../components/GameCard/GameCard";
import Loader from "../components/Loader/Loader";
import { useGetGamesByLocation } from "../hooks/GameHooks";
import { useSelector } from "react-redux";

const CMS_DATA = {
  title: "Explore Games",
  subTitle: "Join games happening near you",
};

const GamesListing = () => {
  const lat = useSelector((state) => state.location.lat);
  const lng = useSelector((state) => state.location.lng);
  const locationParams = { lat, lng };
  
  const {
    data,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  } = useGetGamesByLocation(locationParams);

  const observerTarget = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 1.0 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current);
      }
    };
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  // Extract games from all pages
  const games = data?.pages.flatMap(page => page.games) || [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center mx-auto mt-10 max-md:mt-8 w-full h-[70vh] max-w-[1600px]">
        <Loader />
      </div>
    );
  }

  return (
    <div className="mx-auto mt-10 max-md:mt-8 w-full max-w-[1600px] px-4 md:px-[100px] flex flex-col">
      <h2 className="text-base md:text-2xl text-1c0e0eb3 font-general font-medium capitalize">
        {CMS_DATA.title}
      </h2>
      <p className="text-xs md:text-base text-383838 font-general font-medium capitalize opacity-70">
        {CMS_DATA.subTitle}
      </p>

      {games.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-8 md:mt-12 flex-grow">
            {games.map((game) => (
              <GameCard game={game} key={nanoid()} />
            ))}
          </div>
          
          {/* Loading indicator for next page - no text */}
          <div 
            ref={observerTarget} 
            className="w-full py-4 flex justify-center"
          >
            {isFetchingNextPage && <Loader />}
          </div>
        </>
      ) : (
        <div className="flex items-center justify-center flex-grow h-[50vh]">
          <h2 className="text-lg md:text-2xl text-gray-600 font-general font-medium">
            No game is created for now
          </h2>
        </div>
      )}
    </div>
  );
};

export default GamesListing;
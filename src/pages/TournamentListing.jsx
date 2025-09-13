import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";
import { nanoid } from "nanoid";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { useSearchParams } from "react-router-dom";
import Loader from "../components/Loader/Loader";
import PicklebayJournal from "../components/PicklebayJournal/PicklebayJournal";
import SpotlightTournaments from "../components/SpotlightTournaments/SpotlightTournaments";
import TournamentCard from "../components/TournamentCard/TournamentCard";
import TournamentFilters from "../components/TournamentFilters/TournamentFilters";
import { getCardsPerSection } from "../utils/utlis";
import TournamentGridCard from "../components/TournamentGridCard/TournamentGridCard";
import { VenueNotFound } from "../assets";
import { Helmet } from "react-helmet";
import SCommunityFilter from '../components/SocialEventFilter/SocialEventOuterFilter/SCommunityFilter';
import STournamentFilter from '../components/SocialEventFilter/SocialEventOuterFilter/STournamentFilter';
import SocialEventListing from './SocialEventListing';
import CommunityFilter from '../components/SocialEvents/CommunityFilter/CommunityFilter';


const fetchTournaments = async ({ pageParam = 1, limit, filters }) => {
  const baseURL = import.meta.env.VITE_DEV_URL;

  const params = {
    page: pageParam,
    limit: limit,
  };

  if (filters.skillLevel && filters.skillLevel.length > 0) {
    params.skillLevel = filters.skillLevel.join(',');
  }

  if (filters.dateRange) {
    params['dateRange[startDate]'] = filters.dateRange.startDate;
    params['dateRange[endDate]'] = filters.dateRange.endDate;
  }

  if (filters.status) {
    params.status = filters.status;
  }

  const response = await axios.get(`${baseURL}/api/public/tournaments`, {
    params,
  });

  if (response.status !== 200) {
    throw new Error('Failed to fetch tournaments');
  }
  return response;
};

const TournamentListing = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [activeFilters, setActiveFilters] = useState({
    skillLevel: [],
    dateRange: null,
    status: null,
  });

  // Initialize community filter state from URL params
  const [communityDateRange, setCommunityDateRange] = useState(() => {
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const filterType = searchParams.get('communityFilter');

    if (startDate && endDate && filterType) {
      return { startDate, endDate };
    }
    return null;
  });

  const [activeCommunityFilter, setActiveCommunityFilter] = useState(() => {
    return searchParams.get('communityFilter');
  });

  // Initialize outerFilter from URL params, default to "Tournament"
  const [outerFilter, setOuterFilter] = useState(() => {
    return searchParams.get('filter') === 'community' ? 'Community' : 'Tournament';
  });

  const [isAllLevelsChecked, setIsAllLevelsChecked] = useState(true);

  // Update URL when outerFilter changes
  useEffect(() => {
    const currentFilter = searchParams.get('filter');
    const newFilter = outerFilter === 'Community' ? 'community' : 'tournament';

    if (currentFilter !== newFilter) {
      const newSearchParams = new URLSearchParams(searchParams);
      if (outerFilter === 'Community') {
        newSearchParams.set('filter', 'community');
      } else {
        newSearchParams.delete('filter'); // Remove param for default Tournament view
      }
      setSearchParams(newSearchParams, { replace: true });
    }
  }, [outerFilter, searchParams, setSearchParams]);

  // Update URL when community filter changes
  useEffect(() => {
    const newSearchParams = new URLSearchParams(searchParams);

    if (communityDateRange && activeCommunityFilter) {
      newSearchParams.set('startDate', communityDateRange.startDate);
      newSearchParams.set('endDate', communityDateRange.endDate);
      newSearchParams.set('communityFilter', activeCommunityFilter);
    } else {
      newSearchParams.delete('startDate');
      newSearchParams.delete('endDate');
      newSearchParams.delete('communityFilter');
    }

    setSearchParams(newSearchParams, { replace: true });
  }, [communityDateRange, activeCommunityFilter, searchParams, setSearchParams]);

  // Week Utility function
  const getThisWeekDateRange = () => {
    const today = new Date();
    // Calculate start of the week (Sunday)
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - today.getDay());

    // Calculate end of the week (Saturday)
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 6);

    return {
      startDate: startDate.toLocaleDateString('en-GB'),
      endDate: endDate.toLocaleDateString('en-GB'),
    };
  };

  const getThisMonthDateRange = () => {
    const today = new Date();
    const startDate = new Date(today.getFullYear(), today.getMonth(), 1);
    const endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0);
    return {
      startDate: startDate.toLocaleDateString('en-GB'),
      endDate: endDate.toLocaleDateString('en-GB'),
    };
  }

  const { data, isLoading, isError, error, fetchNextPage, hasNextPage, isFetchingNextPage, refetch } = useInfiniteQuery({
    queryKey: ['tournaments', activeFilters],
    queryFn: ({ pageParam }) => fetchTournaments({
      pageParam,
      limit: 17,
      filters: activeFilters,
    }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      const { total } = lastPage.data.data;
      const limit = 17;
      const totalFetched = allPages.length * limit;
      return totalFetched < total ? allPages.length + 1 : undefined;
    }
  });

  const tournamentsToRender = data?.pages.flatMap(page => page.data.data.tournaments) || [];
  const totalResults = data?.pages[0]?.data?.data?.total || 0; // Total number of results

  // Improved intersection observer setup with threshold and rootMargin
  const { ref, inView } = useInView({
    threshold: 0,
    rootMargin: '200px 0px',
    triggerOnce: false,
  });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);


  const setFilters = (value, checked, filtertype) => {
    setActiveFilters((prev) => {
      // If we're in Community view, only allow date range filters
      if (outerFilter === "Community" && filtertype === 'skillLevel') {
        return prev;
      }

      if (filtertype === 'dateRange') {
        // Date range logic - this week and this month are mutually exclusive
        let dateRange = null;
        if (value === 'this-week') {
          dateRange = getThisWeekDateRange();
        } else if (value === 'this-month') {
          dateRange = getThisMonthDateRange();
        }
        return {
          ...prev,
          dateRange: checked ? dateRange : null,
        };
      } else if (filtertype === 'status') {
        return {
          ...prev,
          status: checked ? value : null,
        };
      } else {
        const currentArray = prev[filtertype] || [];
        const isAlreadyPresent = currentArray.includes(value);

        let updatedFilter;
        if (isAlreadyPresent) {
          // If already present and unchecked, remove it
          updatedFilter = currentArray.filter((item) => item !== value);
        } else if (checked) {
          // If not present and checked, add it
          updatedFilter = [...currentArray, value];
          if (filtertype === 'skillLevel') {
            setIsAllLevelsChecked(false);
          }
        } else {
          updatedFilter = currentArray;
        }

        // If no skill levels selected, check 'all levels'
        if (filtertype === 'skillLevel' && updatedFilter.length === 0) {
          setIsAllLevelsChecked(true);
        }

        return {
          ...prev,
          [filtertype]: updatedFilter,
        };
      }
    });
  };

  // Check if only past tournaments filter is selected
  const isOnlyPastTournamentsSelected = () => {
    const hasOnlyCompletedStatus = activeFilters.status === 'completed';
    const hasNoDateRange = !activeFilters.dateRange;
    const hasNoSkillLevelFilters = activeFilters.skillLevel.length === 0 ||
      (activeFilters.skillLevel.length === 1 && activeFilters.skillLevel.includes('all levels'));

    return hasOnlyCompletedStatus && hasNoDateRange && hasNoSkillLevelFilters;
  };

  if (isLoading) return (
    <div className="w-full h-screen flex justify-center items-center">
      <Loader size="lg" color="loading" />
    </div>
  );

  const tournamentStructuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "PickleBay Tournament Listings",
    "description": "Discover pickleball tournaments of all skill levels available across cities on PickleBay.",
    "url": "https://picklebay.com/tournaments",
    "mainEntity": {
      "@type": "ItemList",
      "itemListElement": tournamentsToRender.map((tournament, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "url": `https://picklebay.com/tournaments/${tournament.handle}`,
        "item": {
          "@type": "SportsEvent",
          "name": tournament.tournamentName,
          "description": tournament.description?.replace(/<\/?[^>]+(>|$)/g, "") || "",
          "image": tournament.bannerDesktopImages?.[0] || "",
          "startDate": tournament.startDate,
          "endDate": tournament.endDate,
          "eventStatus": "https://schema.org/EventScheduled",
          "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
          "organizer": {
            "@type": "Organization",
            "name": tournament.ownerBrandName,
            "email": tournament.ownerBrandEmail
          },
          "location": {
            "@type": "Place",
            "name": `${tournament.tournamentLocation.address.line1}, ${tournament.tournamentLocation.address.line2}`,
            "address": {
              "@type": "PostalAddress",
              "streetAddress": `${tournament.tournamentLocation.address.line1}, ${tournament.tournamentLocation.address.line2}`,
              "addressLocality": tournament.tournamentLocation.address.city,
              "addressRegion": tournament.tournamentLocation.address.state,
              "postalCode": tournament.tournamentLocation.address.postalCode,
              "addressCountry": "IN"
            },
            "geo": {
              "@type": "GeoCoordinates",
              "latitude": tournament.tournamentLocation.address.location.coordinates[1],
              "longitude": tournament.tournamentLocation.address.location.coordinates[0]
            }
          },
          "offers": {
            "@type": "Offer",
            "availability": "https://schema.org/InStock",
            "validFrom": tournament.bookingStartDate,
            "validThrough": tournament.bookingEndDate
          },
          "performer": {
            "@type": "SportsTeam",
            "name": "Multiple Participants"
          },
          "additionalProperty": [
            {
              "@type": "PropertyValue",
              "name": "skillLevel",
              "value": tournament.tournamentSkillLevel
            },
            {
              "@type": "PropertyValue",
              "name": "totalBookings",
              "value": tournament.totalBookings
            },
            ...tournament.tags.map(tag => ({
              "@type": "PropertyValue",
              "name": "tag",
              "value": tag
            })),
            ...tournament.whatToExpect?.map(item => ({
              "@type": "PropertyValue",
              "name": item.title,
              "value": item.description
            })) || []
          ]
        }
      }))
    }
  };

  const canonicalUrl = import.meta.env.VITE_CANONICAL_URL;
  return (
    <>
      <Helmet>
        <title>Picklebay - Tournament Listing page for pickleball events</title>
        <meta name="description" content="Explore top pickleball venues, tournaments, and community events with PickleBay. Your one-stop destination for everything pickleball." />
        <link rel="canonical" href={`${canonicalUrl}/tournaments`} />
        <script type="application/ld+json">
          {JSON.stringify(tournamentStructuredData)}
        </script>
      </Helmet>
      <div className="mx-auto mt-10 max-md:mt-8 w-full max-w-[1600px] px-4 md:px-[100px]">
        <h1 className="font-medium text-[24px] md:text-[44px] leading-[24px] text-left md:text-center md:leading-[44px] tracking-[0px] text-[#383838] opacity-100 mb-4 font-author max-w-[60%] md:max-w-full">What are you looking to play?</h1>

        <div className="flex items-center justify-start md:justify-center gap-4 mb-3 overflow-x-auto scrollbar-hide">
          <STournamentFilter outerFilter={outerFilter} setOuterFilter={setOuterFilter} />
          <SCommunityFilter outerFilter={outerFilter} setOuterFilter={setOuterFilter} />
        </div>

        {outerFilter === "Tournament" ? (
          <>
            <TournamentFilters
              setFilterValue={setFilters}
              isAllLevelsChecked={isAllLevelsChecked}
              setIsAllLevelsChecked={setIsAllLevelsChecked}
              activeFilters={activeFilters}
            />
            <div className="flex items-center justify-between mb-5">
              <p className="font-general font-medium text-sm md:text-base text-383838 md:text-1c0e0e opacity-70 md:opacity-100">Upcoming Events</p>
              <p className="font-general font-medium opacity-80 text-1c0e0eb3 text-sm">Showing {totalResults} Results</p>
            </div>

            {tournamentsToRender.length === 0 ? (
              <>
                <div className="max-w-[500px] mx-auto">
                  <p className="font-author font-medium text-[34px] text-383838 opacity-70 mb-2 text-center">Keep Swinging!</p>
                  <p className="font-general font-medium text-[14px] text-383838 opacity-70 mb-4 text-center">Sometimes the bracket's full, sometimes it's waiting for you. But true competitors know the game is always on somewhere!</p>
                  <p className="font-general font-medium text-[14px] text-383838 opacity-70 mb-4 text-center">Try adjusting your skill level or date range to uncover epic tournaments waiting to be won.</p>
                  <img src={VenueNotFound} alt="Venue not found" className="w-full h-[200px] object-contain" />
                </div>

                {/* Journal section in full width */}
                <div className="col-span-full">
                  <div className="w-screen relative left-1/2 -translate-x-1/2 mt-8">
                    <PicklebayJournal />
                  </div>
                </div>
              </>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
                {(() => {
                  const cardsPerSection = getCardsPerSection();
                  const renderSections = [];

                  // Function to insert tournament cards with grid card at position 8
                  const insertTournamentCards = (startIdx, endIdx, cards) => {
                    cards.forEach((tournament, index) => {
                      const absoluteIndex = startIdx + index;

                      // Add imageLoading="eager" prop to the first 3 cards
                      const isEagerLoading = absoluteIndex < 3;

                      // Insert TournamentGridCard at position 8 if we have enough cards
                      if (absoluteIndex === 7 && tournamentsToRender.length >= 8) {
                        renderSections.push(
                          <TournamentGridCard key="grid-card" />
                        );
                      }

                      renderSections.push(
                        <TournamentCard
                          key={nanoid()}
                          tournament={tournament}
                          imageLoading={isEagerLoading ? "eager" : "lazy"}
                        />
                      );
                    });
                  };

                  // First section of cards
                  insertTournamentCards(0, cardsPerSection, tournamentsToRender.slice(0, cardsPerSection));

                  // Spotlight section
                  renderSections.push(
                    <div key="spotlight" className="col-span-full">
                      <div className="w-screen relative left-1/2 -translate-x-1/2">
                        <SpotlightTournaments />
                      </div>
                    </div>
                  );

                  // Second section of cards
                  insertTournamentCards(
                    cardsPerSection,
                    cardsPerSection + 5,
                    tournamentsToRender.slice(cardsPerSection, cardsPerSection + 5)
                  );

                  // Journal section
                  renderSections.push(
                    <div key="journal" className="col-span-full">
                      <div className="w-screen relative left-1/2 -translate-x-1/2">
                        <PicklebayJournal />
                      </div>
                    </div>
                  );

                  // Remaining cards
                  insertTournamentCards(
                    cardsPerSection + 5,
                    tournamentsToRender.length,
                    tournamentsToRender.slice(cardsPerSection + 5)
                  );

                  return renderSections;
                })()}
              </div>
            )}

            {/* Loading indicator and observer reference */}
            <div className="mt-8 mb-8 flex justify-center">
              {isFetchingNextPage ? (
                <Loader size="md" color="loading" />
              ) : hasNextPage ? (
                <div ref={ref} className="h-10">
                  {/* This empty div is the observer target */}
                </div>
              ) : tournamentsToRender.length > 0 ? (
                <p className="text-gray-500 hidden">No more tournaments to load</p>
              ) : null}
            </div>
          </>
        ) : (
          <>
            <CommunityFilter
              onFilterChange={(dateRange, filterType) => {
                setCommunityDateRange(dateRange);
                setActiveCommunityFilter(filterType);
              }}
              activeFilter={activeCommunityFilter}
            />
            <SocialEventListing
              dateRange={communityDateRange}
              filterType={activeCommunityFilter}
            />
          </>
        )}
      </div>
    </>
  );
};

export default TournamentListing;
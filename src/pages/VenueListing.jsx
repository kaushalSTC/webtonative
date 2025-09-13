  import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";
import React, { useEffect, useState, useCallback, useRef } from "react";
import { useInView } from "react-intersection-observer";
import { useSelector } from "react-redux";
import GridBanner from "../components/GridBanner/GridBanner";
import GridCardImage from "../components/GridCard/GridCard";
import Loader from "../components/Loader/Loader";
import VenueCard from "../components/VenueCard/VenueCard";
import VenueFilters from "../components/VenueFilters/VenueFilters";
import { nanoid } from "nanoid";
import { VenueNotFound } from "../assets";
import { Helmet } from "react-helmet";

// Separate function for venue search

// Updated searchVenues function to handle the new response format
const searchVenues = async ({ pageParam = 1, searchTerm }) => {
  const baseURL = import.meta.env.VITE_DEV_URL;
  try {
    const response = await axios.get(`${baseURL}/api/public/venues/search`, {
      params: {
        search: searchTerm,
        page: pageParam,
      },
    });
    
    // Transform the response to match the format expected by the rest of the code
    const transformedResponse = {
      ...response,
      data: {
        ...response.data,
        data: {
          data: response.data.data.venues || [],
          pagination: {
            total: response.data.data.total || 0,
            page: pageParam,
            limit: 50,
          }
        }
      }
    };
    
    return transformedResponse;
  } catch (error) {
    console.error("Error searching venues:", error);
    throw new Error(error.response?.data?.message || "Failed to search venues");
  }
};

// Function for regular venue fetching with filters
const fetchVenues = async ({ pageParam = 1, queryParams, lat, lng, city }) => {
  const baseURL = import.meta.env.VITE_DEV_URL;
  try {
    const response = await axios.get(`${baseURL}/api/public/venues`, {
      params: {
        lat,
        lng,
        city,
        page: pageParam,
        ...queryParams,
      },
    });
    return response;
  } catch (error) {
    console.error("Error fetching venues:", error);
    throw new Error(error.response?.data?.message || "Failed to fetch venues");
  }
};

function VenueListing() {
  const lat = useSelector((state) => state.location.lat);
  const lng = useSelector((state) => state.location.lng);
  const city = useSelector((state) => state.location.city);

  const [totalResults, setTotalResults] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [activeFilters, setActiveFilters] = useState({
    radius: "",
    tags: "",
  });

  // Loading reference
  const loadingRef = useRef(false);
  const searchInputRef = useRef(null);

  // Use a more stable configuration for infinite scroll
  const { ref, inView } = useInView({
    threshold: 0,
    rootMargin: "200px 0px",
    triggerOnce: false,
    delay: 100,
  });

  // Debounce search term to avoid excessive API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Determine if we're in search mode
  const isSearching = debouncedSearchTerm.trim() !== "";

  // Use the appropriate query based on search state
  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = useInfiniteQuery({
    queryKey: isSearching
      ? ["venueSearch", debouncedSearchTerm]
      : ["venues", lat, lng, activeFilters, city],
    queryFn: ({ pageParam }) =>
      isSearching
        ? searchVenues({
          pageParam,
          searchTerm: debouncedSearchTerm,
        })
        : fetchVenues({
          pageParam,
          queryParams: {
            ...(activeFilters.radius && { radius: activeFilters.radius }),
            ...(activeFilters.tags && { tags: activeFilters.tags }),
          },
          lat,
          lng,
          city,
        }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      // Handle both formats - search and regular
      const pagination = lastPage.data.data.pagination;
      if (pagination) {
        const { total, page, limit } = pagination;
        const totalPages = Math.ceil(total / limit);
        return page < totalPages ? page + 1 : undefined;
      } else {
        // Fallback if pagination structure is missing
        return undefined;
      }
    },
    enabled: isSearching || Boolean(city || (lat && lng)),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
  // Pre-calculate whether promotional content should appear
  const allVenues = data?.pages?.flatMap(page => page.data.data.data) || [];
  const showPromotionalImage = allVenues.length >= 2;
  const showBanner = allVenues.length > 5;

  // Memoize venue card rendering for better performance
  const renderVenueCards = useCallback(() => {
    if (!allVenues.length) return [];

    // Create an array to hold all items (venues, promo card, and banner)
    const items = [];

    // Keep track of actual venue cards rendered (to determine which should load eagerly)
    let venueCardCount = 0;

    // Insert venues with special items at specific positions
    allVenues.forEach((venue, index) => {
      // Before the 3rd venue, insert the promotional card
      if (index === 2 && showPromotionalImage) {
        items.push(
          <GridCardImage key={`promotional-card-${nanoid()}`} />
        );
      }

      // Add the venue card with eager loading for first 3 venue cards
      const isEagerLoading = venueCardCount < 3;
      items.push(
        <VenueCard 
          venue={venue} 
          key={`venue-${venue._id || nanoid()}`} 
          imageLoading={isEagerLoading ? "eager" : "lazy"}
        />
      );
      venueCardCount++;

      // After 5 venue cards plus the promotional card (total 6 items), insert the banner
      if (items.length === 6 && showBanner) {
        items.push(
          <div className="col-span-full" key={`banner-${nanoid()}`}>
            <GridBanner />
          </div>
        );
      }
    });

    return items;
  }, [allVenues, showPromotionalImage, showBanner]);

  // Refresh data when location changes (only if not searching)
  useEffect(() => {
    if (!isSearching && (city || (lat && lng))) {
      refetch();
    }
  }, [city, lat, lng, refetch, isSearching]);

  // Debounced infinite scroll loading with guard against duplicate triggers
  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage && !isLoading && !loadingRef.current) {
      loadingRef.current = true;
      const timer = setTimeout(() => {
        fetchNextPage().finally(() => {
          loadingRef.current = false;
        });
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage, isLoading]);

  // Update total results whenever the first page of data changes
  useEffect(() => {
    if (data?.pages?.[0]?.data?.data?.pagination?.total !== undefined) {
      setTotalResults(data.pages[0].data.data.pagination.total);
    }
  }, [data?.pages?.[0]?.data?.data?.pagination?.total]);

  const handleFilterChange = (value, checked) => {
    // Only apply filters when not in search mode
    if (!isSearching) {
      if (value === "2" || value === "5") {
        setActiveFilters((prev) => ({
          ...prev,
          radius: checked ? value : "",
        }));
      } else if (value === "indoor" || value === "outdoor") {
        setActiveFilters((prev) => ({
          ...prev,
          tags: checked ? value : "",
        }));
      }
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const clearSearch = () => {
    setSearchTerm("");
    setDebouncedSearchTerm("");
  };

  const renderSkeletonLoaders = () => {
    return Array(6).fill(0).map((_, index) => (
      <div key={`skeleton-${index}`} className="bg-gray-100 rounded-lg h-64 animate-pulse"></div>
    ));
  };

  // Use this function to restore focus after re-renders
  const maintainSearchFocus = useCallback(() => {
    if (searchInputRef.current && document.activeElement !== searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, []);

  useEffect(() => {
    if (isSearching && !isLoading) {
      maintainSearchFocus();
    }
  }, [isLoading, isSearching, maintainSearchFocus]);

  if (isLoading) {
    return (
      <div className="mx-auto mt-10 max-md:mt-8 w-full max-w-[1600px] px-4 md:px-[100px]">
        <VenueFilters
          onFilterChange={handleFilterChange}
          activeFilters={{ ...activeFilters, totalResults: 0 }}
          disabled={isSearching}
        />
        <div className="w-full md:w-[50%] mx-auto my-6">
          <input
            type="text"
            placeholder="Search venues..."
            className="w-full px-5 p-3 border border-383838 rounded-full focus:outline-none placeholder:text-383838 text-sm font-general font-medium text-383838 focus:shadow-lg focus:border-abe400 transition-all duration-300"
            value={searchTerm}
            onChange={handleSearchChange}
            disabled
          />
        </div>
        <div className="max-md:mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
          {renderSkeletonLoaders()}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="mx-auto mt-10 max-md:mt-8 w-full max-w-[1600px] px-4 md:px-[100px]">
        <div className="w-full md:w-[50%] mx-auto my-6">
          <input
            type="text"
            placeholder="Search venues..."
            className="w-full px-5 p-3 border border-383838 rounded-full focus:outline-none placeholder:text-383838 text-sm font-general font-medium text-383838 focus:shadow-lg focus:border-abe400 transition-all duration-300"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
        <div className="flex flex-col justify-center items-center min-h-[300px] w-full">
          <p className="text-red-500 text-lg mb-4">Error: {error.message || "Something went wrong"}</p>
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            onClick={() => refetch()}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const hasNoResults = !allVenues.length;
  const venues = allVenues; // array of venue objects like the one you posted

  const venueStructuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Picklebay Venue Listings",
    "description": "Discover indoor and outdoor pickleball venues available across cities on Picklebay.",
    "url": "https://picklebay.com/venues",
    "mainEntity": {
      "@type": "ItemList",
      "itemListElement": venues.map((venue, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "url": `https://picklebay.com/venues/${venue.handle}`,
        "item": {
          "@type": "SportsActivityLocation",
          "name": venue.name,
          "description": venue.description?.replace(/<\/?[^>]+(>|$)/g, "") || "",
          "image": venue.bannerImages?.filter(img => img.type !== "video")?.[0]?.url || "",
          "address": {
            "@type": "PostalAddress",
            "streetAddress": `${venue.address.line1}, ${venue.address.line2}`,
            "addressLocality": venue.address.city,
            "addressRegion": venue.address.state,
            "postalCode": venue.address.postalCode,
            "addressCountry": "IN"
          },
          "geo": {
            "@type": "GeoCoordinates",
            "latitude": venue.address.location.coordinates[1],
            "longitude": venue.address.location.coordinates[0]
          },
          "amenityFeature": [
            ...venue.amenities.map(name => ({
              "@type": "LocationFeatureSpecification",
              name,
              value: true
            })),
            ...venue.equipments.map(name => ({
              "@type": "LocationFeatureSpecification",
              name,
              value: true
            }))
          ]
        }
      }))
    }
  };


  // helper function to convert day string to schema.org format
  function capitalizeDay(day) {
    const mapping = {
      all: "Monday", // fallback if it's "All days"
      monday: "Monday",
      tuesday: "Tuesday",
      wednesday: "Wednesday",
      thursday: "Thursday",
      friday: "Friday",
      saturday: "Saturday",
      sunday: "Sunday"
    };
    return mapping[day.toLowerCase()] || "Monday";
  }

  const canonicalUrl = import.meta.env.VITE_CANONICAL_URL;

  return (
    <>
      <Helmet>
        <title>Picklebay - Venue Listing page for pickleball events</title>
        <meta name="description" content="Explore top pickleball venues, tournaments, and community events with Picklebay. Your one-stop destination for everything pickleball." />
        <link rel="canonical" href={`${canonicalUrl}/venues`} />
        <script type="application/ld+json">
          {JSON.stringify(venueStructuredData)}
        </script>
      </Helmet>
      <div className="mx-auto mt-10 max-md:mt-8 w-full max-w-[1600px] px-4 md:px-[100px]">
        <VenueFilters
          onFilterChange={handleFilterChange}
          activeFilters={{ ...activeFilters, totalResults }}
          disabled={isSearching}
        />
        <div className="w-full md:w-[50%] mx-auto my-6">
          <div className="relative">
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search venues..."
              className="w-full px-5 p-3 border border-383838 rounded-full focus:outline-none placeholder:text-383838 text-sm font-general font-medium text-383838 focus:shadow-lg focus:border-abe400 transition-all duration-300"
              value={searchTerm}
              onChange={handleSearchChange}
            />
            {searchTerm && (
              <button
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                onClick={clearSearch}
              >
                ✕
              </button>
            )}
          </div>
        </div>
        {/* {isSearching && (
          <div className="mb-4 text-sm text-gray-600">
            {totalResults} {totalResults === 1 ? 'result' : 'results'} for "{debouncedSearchTerm}"
          </div>
        )} */}
        {hasNoResults ? (
          <div className="flex justify-center items-center min-h-[200px] w-full">
            {debouncedSearchTerm
              ? (
                <p className="text-383838 opacity-70 text-lg font-author font-medium">No venues found matching "{debouncedSearchTerm}"</p>
              )
              : (
                <div className="max-w-[500px] mx-auto">
                  <p className="font-author font-medium text-[34px] text-383838 opacity-70 mb-2 text-center">Widen the Net!</p>
                  <p className="font-general font-medium text-[14px] text-383838 opacity-70 mb-4 text-center">In the game of life, sometimes you get the pickle, sometimes the pickle gets you. But true pickleball champions never give up the search!</p>
                  <p className="font-general font-medium text-[14px] text-383838 opacity-70 mb-4 text-center">Expand your search radius to discover the best pickleball courts.</p>
                  <img src={VenueNotFound} alt="Venue not found" className="w-full h-[200px] object-contain" />
                </div>
              )}
          </div>
        ) : (
          <>
            <div className="max-md:mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
              {renderVenueCards()}

              {/* Loading indicator that doesn't shift layout */}
              {(isFetchingNextPage || hasNextPage) && (
                <div className="col-span-full h-20 flex justify-center items-center">
                  {isFetchingNextPage ? (
                    <Loader size="md" color="loading" />
                  ) : (
                    <div ref={ref} className="h-1 w-full"></div>
                  )}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default VenueListing;
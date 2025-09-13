import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import CourtSpecifications from '../components/CourtSpecifications/CourtSpecifications';
import Loader from '../components/Loader/Loader';
import PicklebayPromise from '../components/PicklebayPromise/PicklebayPromise';
import RelatedVenues from '../components/RelatedVenues/RelatedVenues';
import VenueAmenities from '../components/VenueAmenities/VenueAmenities';
import VenueCourtListing from '../components/VenueCourtListing/VenueCourtListing';
import VenueDetailsBannerSwiper from '../components/VenueDetailsBannerSwiper/VenueDetailsBannerSwiper';
import VenueDetailsBottomBanner from '../components/VenueDetailsBottomBanner/VenueDetailsBottomBanner';
import VenueDetailsInfo from '../components/VenueDetailsInfo/VenueDetailsInfo';
import VenueEquipments from '../components/VenueEquipments/VenueEquipments';
import VenueExploreGames from '../components/VenueExploreGames/VenueExploreGames';
import LayoutImage from '../components/LayoutImages/LayoutImage'
import { Helmet } from 'react-helmet';

function VenueDetails() {
  const { handle } = useParams();
  const navigate = useNavigate();
  const fetchVenueByHandle = async () => {
    if (!handle) {
      throw new Error('No venue handle provided');
    }

    const baseURL = import.meta.env.VITE_DEV_URL;
    try {
      const response = await axios.get(`${baseURL}/api/public/venues/${handle}`, {
        params: {
          price: 'price asc',
        },
      });

      if (!response.data) {
        throw new Error('Venue not found');
      }

      return response.data;
    } catch (error) {
      if (error.response?.status === 404) {
        navigate('/404');
      }
      throw error;
    }
  };

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['venue', handle],
    queryFn: fetchVenueByHandle,
    // retry: false, // Don't retry on 404s
    enabled: !!handle,
  });

  if (isLoading) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <Loader size="lg" color="loading "/>
      </div>
    );
  }

  if (isError) {
    return <p>Error: {error.message}</p>;
  }

  if (!data) {
    return (
      <div className="flex justify-center items-center min-h-[200px] w-full">
        <p className="text-gray-500 text-lg">Nothing to show here</p>
      </div>
    );
  }

  if (!data.data) {
    return (
      <div className="flex justify-center items-center min-h-[200px] w-full">
        <p className="text-gray-500 text-lg">Venue not listed yet</p>
      </div>
    );
  }

  const capitalizeFirstLetter = (string) =>
    string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  
  const venue = data?.data; // the full single venue object like you shared

const venueDetailsStructuredData = {
  "@context": "https://schema.org",
  "@type": "SportsActivityLocation",
  "name": venue.name,
  "url": `https://picklebay.com/venues/${venue.handle}`,
  "description": venue.description?.replace(/<\/?[^>]+(>|$)/g, "") || "",
  "image": venue.bannerImages?.filter(img => img.type !== "video")?.map(img => img.url) || [],
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
  ],
  "openingHoursSpecification": venue.availableDays
    .filter(day => day.active && day.day.toLowerCase() !== "all days")
    .map(day => ({
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": capitalizeFirstLetter(day.day),
      "opens": day.openingTime,
      "closes": day.closingTime
    }))
};

  const canonicalUrl = import.meta.env.VITE_CANONICAL_URL;
  return (
    <>
     <Helmet>
     <title>Picklebay - Venue Details page for pickleball venues and courts</title> 
     <meta name="description" content="Explore top pickleball venues, tournaments, and community events with Picklebay. Your one-stop destination for everything pickleball." />
     <link rel="canonical" href={`${canonicalUrl}/venues/${handle}`} />
      <script type="application/ld+json">
        {JSON.stringify(venueDetailsStructuredData)}
      </script>
    </Helmet>
   
    <div className="mx-auto bg-f2f2f2">
      <div className="bg-white max-w-[700px] mx-auto">
        <VenueDetailsBannerSwiper data={data} />
        <VenueDetailsInfo data={data} />
        <VenueCourtListing data={data} />
        {/* <PicklebayPromise /> */}
        <VenueAmenities data={data} />
        <LayoutImage data={data}/>
        <VenueEquipments data={data} />
        <CourtSpecifications data={data} />
        <VenueExploreGames venueHandle={handle} />
        <RelatedVenues data={data} />
        <VenueDetailsBottomBanner />
      </div>
    </div>
    </>
  );
}

export default VenueDetails;

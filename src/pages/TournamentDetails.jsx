/* eslint-disable react/prop-types */
import { useRef } from 'react';
import { useParams } from 'react-router-dom';
import Loader from '../components/Loader/Loader';
import ErrorState from '../components/Tournament/ErrorState/ErrorState';
import TournamentCategories from '../components/Tournament/TournamentCategories/TournamentCategories';
import TournamentDetailSwiper from '../components/Tournament/TournamentDetailSwiper/TournamentDetailSwiper';
import TournamentGallery from '../components/Tournament/TournamentGallery/TournamentGallery';
import TournamentInfo from '../components/Tournament/TournamentInfo/TournamentInfo';
import TournamentOrganizer from '../components/Tournament/TournamentOrganizer/TournamentOrganizer';
import TournamentPreRequisites from '../components/Tournament/TournamentPreRequisites/TournamentPreRequisites';
import TournamentRegisteration from '../components/Tournament/TournamentRegisteration/TournamentRegisteration';
import TournamentSponsors from '../components/Tournament/TournamentSponsors/TournamentSponsors';
import TournamentVenues from '../components/Tournament/TournamentVenues/TournamentVenues';
import TournamentWhatToExpect from '../components/Tournament/TournamentWhatToExpect/TournamentWhatToExpect';
import { useTournamentByHandleQuery } from '../hooks/TournamentHooks';
import TournamentMoreFromThisAuther from '../components/TournamentMoreFromThisAuther/TournamentMoreFromThisAuther';
import { Helmet } from 'react-helmet';

const TournamentDetails = () => {
  const { handle } = useParams();
  const { data: { tournament } = {}, isLoading, isError, error } = useTournamentByHandleQuery(handle);
  const categorySectionRef = useRef(null);

  if (!handle) return <ErrorState message="No tournament handle provided"></ErrorState>;

  if (isError) return <ErrorState message={error?.message || 'Something went wrong'}></ErrorState>;

  if (isLoading) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <Loader size="lg" />
      </div>
    );
  }

  const scrollCategorySectionIntoView = () => {
    categorySectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };
  const tournamentDetailsStructuredData = {
    "@context": "https://schema.org",
    "@type": "SportsEvent",
    "name": tournament.tournamentName,
    "url": `https://picklebay.com/tournaments/${tournament.handle}`,
    "description": tournament.description?.replace(/<\/?[^>]+(>|$)/g, "") || "",
    "image": [
      ...(tournament.bannerDesktopImages || []),
      ...(tournament.tournamentGallery || [])
    ],
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
    "additionalType": "https://schema.org/Tournament",
    "sport": "Pickleball",
    "audience": {
      "@type": "Audience",
      "audienceType": tournament.tournamentSkillLevel
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
      {
        "@type": "PropertyValue",
        "name": "categoryCount",
        "value": tournament.categoryCount
      },
      {
        "@type": "PropertyValue",
        "name": "prerequisites",
        "value": tournament.preRequisites?.replace(/<\/?[^>]+(>|$)/g, "") || ""
      },
      ...(tournament.tags || []).map(tag => ({
        "@type": "PropertyValue",
        "name": "tag",
        "value": tag
      }))
    ],
    "subEvent": (tournament.whatToExpect || []).map(item => ({
      "@type": "Event",
      "name": item.title,
      "description": item.description
    })),
    "sponsor": (tournament.sponsors || []).map(sponsor => ({
      "@type": "Organization",
      "name": sponsor.name,
      "url": sponsor.url || ""
    })),
    "sameAs": tournament.instagramHandle ? [tournament.instagramHandle] : []
  };
  const canonicalUrl = import.meta.env.VITE_CANONICAL_URL;
  return (
    <>
      <Helmet>
        <title>Picklebay - Tournament Details page for pickleball tournaments and games</title>
        <meta name="description" content="Explore top pickleball venues, tournaments, and community events with Picklebay. Your one-stop destination for everything pickleball." />
        <link rel="canonical" href={`${canonicalUrl}/tournaments/${tournament.handle}`} />
        <script type="application/ld+json">
          {JSON.stringify(tournamentDetailsStructuredData)}
        </script>
      </Helmet>
      <main className="w-full mx-auto bg-f2f2f2">
        <div className="max-w-[720px] mx-auto relative">
          <TournamentDetailSwiper tournament={tournament} />
          <TournamentInfo tournament={tournament} />
          <TournamentWhatToExpect tournament={tournament} />
          <TournamentVenues tournament={tournament} />
          <TournamentGallery tournament={tournament} />
          <TournamentPreRequisites tournament={tournament} />
          <TournamentCategories tournament={tournament} ref={categorySectionRef} />
          <TournamentSponsors tournament={tournament} />
          <TournamentOrganizer tournament={tournament} />
          <TournamentMoreFromThisAuther tournamentId={tournament?._id} ownerId={tournament?.ownerUserId} />
          {/*
          ┌─────────────────────────────────────────────────────────────────────────────┐
          │   Also Happening Section Tournament Recommendations                         │
          └─────────────────────────────────────────────────────────────────────────────┘
          */}
          <TournamentRegisteration scrollCategorySectionIntoView={scrollCategorySectionIntoView} />
        </div>
      </main>
    </>
  );
};

export default TournamentDetails;

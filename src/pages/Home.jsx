import { useLocation, useNavigate } from "react-router";
import BuildCourt from "../components/BuildCourt/BuildCourt";
import ChoosePicklebay from "../components/ChoosePicklebay/ChoosePicklebay";
import ExplorePicklebayFeatures from "../components/ExplorePicklebayFeatures/ExplorePicklebayFeatures";
import FAQ from "../components/FAQ/FAQ";
import FeaturedThisWeek from "../components/FeaturedThisWeek/FeaturedThisWeek";
import HomepageBanner from "../components/HomepageBanner/HomepageBanner";

import HomepageFeaturedTournaments from "../components/HomepageFeaturedTournaments/HomepageFeaturedTournaments";
import HomepageFeaturedVenues from "../components/HomepageFeaturedVenues/HomepageFeaturedVenues";
import HomepageGames from "../components/HomepageGames/HomepageGames";
import HomepageHeroBanner from "../components/HomepageHeroBanner/HomepageHeroBanner";
import NewsAndUpdates from "../components/NewsAndUpdates/NewsAndUpdates";
import PicklebayJournal from "../components/PicklebayJournal/PicklebayJournal";
import { Helmet } from "react-helmet-async";
import GetPendingGameVerification from "../components/GetPendingGameVerification/GetPendingGameVerification";

const HomePage = () => {
  return (
    <>
      <Helmet>
        <title>Picklebay - Discover Pickleball Venues & Events</title>
        <meta name="description" content="Explore top pickleball venues, tournaments, and community events with Picklebay. Your one-stop destination for everything pickleball."/>
        <link rel="canonical" href="https://www.picklebay.com/" />
        <link rel="icon" href="/favicon.ico" />
        
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": "https://www.picklebay.com"
              }
            ]
          })}
        </script>

      </Helmet>

      <main className="w-full overflow-hidden">
        <HomepageHeroBanner />
        <GetPendingGameVerification/>
        <ExplorePicklebayFeatures />
        <HomepageFeaturedTournaments />
        <FeaturedThisWeek />
        <HomepageFeaturedVenues />
        <HomepageGames />
        <ChoosePicklebay />
        <HomepageBanner />
        <PicklebayJournal />
        <NewsAndUpdates />
        <BuildCourt />
        <FAQ />
      </main>
    </>
  );
};

export default HomePage;
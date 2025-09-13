import { BottomBarHomeActiveIcon, SwiperButton } from "../../assets";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Navigation } from "swiper/modules";
import "swiper/css/navigation";
import { useRef, useState } from "react";
import TournamentCard from "../TournamentCard/TournamentCard";
import { SPOTLIGHT_TOURNAMENTS_TAG } from "../../constants";
import { useEffect } from "react";
import { nanoid } from "nanoid";
import axios from "axios";

const TournamentMoreFromThisAuther = ({ tournamentId, ownerId }) => {
  const [tournaments, setTournaments] = useState([]);
  const swiperRef = useRef(null);

  const fetchSpotlightTournaments = async () => {
    try {
      const baseURL = import.meta.env.VITE_DEV_URL;
      const response = await axios.get(
        `${baseURL}/api/public/tournaments?ownerUserId=${ownerId}&limit=10`
      );
      if (response.status !== 200) {
        throw new Error("Failed to fetch tournaments");
      }
      setTournaments(response.data.data.tournaments);
    } catch (error) {
      console.log("spotlight:", error);
    }
  };

  useEffect(() => {
    fetchSpotlightTournaments();
  }, []);

  const handlePrevClick = () => {
    if (swiperRef.current) {
      swiperRef.current.slidePrev();
    }
  };
  const handleNextClick = () => {
    if (swiperRef.current) {
      swiperRef.current.slideNext();
    }
  };



  // Filter out the current tournament
  const filteredTournaments = tournaments.filter(
    (tournament) => tournament._id !== tournamentId
  );

  // If there are no other tournaments, hide the section
  if (!filteredTournaments.length) {
    return null;
  }

  // Check if there's only one tournament
  const hasOnlyOneTournament = filteredTournaments.length === 1;

  return (
    <div className="bg-f2f2f2 py-8 md:py-10 px-6 md:px-0 also-happening-container">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center justify-start gap-3">
          <span>
            <img src={BottomBarHomeActiveIcon} alt="home-active-icon" />
          </span>
          <p className="font-general font-medium text-sm md:text-base text-383838 md:text-1c0e0eb3 opacity-70 md:opacity-100 capitalize">
            Also Happening In
          </p>
        </div>
        {!hasOnlyOneTournament && (
          <div className="flex items-center justify-between gap-3">
            <button
              className="flex w-[35px] h-[35px] items-center justify-center p-3 border rounded-full cursor-pointer hover:bg-gray-100"
              onClick={handlePrevClick}
            >
              <img src={SwiperButton} alt="Previous" className="rotate-180" />
            </button>
            <button
              className="flex w-[35px] h-[35px] items-center justify-center p-3 border rounded-full cursor-pointer hover:bg-gray-100"
              onClick={handleNextClick}
            >
              <img src={SwiperButton} alt="Next" />
            </button>
          </div>
        )}
      </div>

      <div>
        <Swiper
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
          }}
          modules={[Navigation]}
          spaceBetween={15}
          breakpoints={{
            320: {
              slidesPerView: 1.1,
            },
            389: {
              slidesPerView: 1.2,
            },
            840: {
              slidesPerView: 1,
            },
            1100: {
              slidesPerView: 1.8,
            },
          }}
        >
          {filteredTournaments.map((tournament) => (
            <SwiperSlide key={nanoid()}>
              <TournamentCard tournament={tournament} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default TournamentMoreFromThisAuther;
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

const SpotlightTournaments = () => {
  const [tournaments, setTournaments] = useState([]);

  const fetchSpotlightTournaments = async () => {
    try {
      const baseURL = import.meta.env.VITE_DEV_URL;
      const response = await axios.get(
        `${baseURL}/api/public/tournaments?tags=${SPOTLIGHT_TOURNAMENTS_TAG}&limit=5`
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

  const swiperRef = useRef(null);
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

  if (!tournaments.length) {
    return null;
  }

  return (
    <div className="bg-f2f2f2 py-10 my-10">
      <div className="px-4 md:px-[120px] flex items-center justify-between mb-7">
        <div className="flex items-center justify-start gap-3 pl-5">
          <span>
            <img src={BottomBarHomeActiveIcon} alt="home-active-icon "/>
          </span>
          <p className="font-general font-medium text-sm md:text-base text-383838 md:text-1c0e0eb3 opacity-70 md:opacity-100 capitalize">
            spotlight this week
          </p>
        </div>
        <div className="flex items-center justify-between gap-3">
          <button
            className="flex w-[35px] h-[35px] items-center justify-center p-3 border rounded-full cursor-pointer hover:bg-gray-100"
            onClick={handlePrevClick}
          >
            <img src={SwiperButton} alt="Previous" className="rotate-180 "/>
          </button>
          <button
            className="flex w-[35px] h-[35px] items-center justify-center p-3 border rounded-full cursor-pointer hover:bg-gray-100"
            onClick={handleNextClick}
          >
            <img src={SwiperButton} alt="Next "/>
          </button>
        </div>
      </div>
      <div className="pl-4 md:pl-[120px] pr-4 md:pr-[0px]">
        <Swiper
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
          }}
          modules={[Navigation]}
          spaceBetween={15}
          breakpoints={{
            320: {
              slidesPerView: 1,
            },
            389: {
              slidesPerView: 1.2,
            },
            840: {
              slidesPerView: 2.3,
            },
            1100: {
              slidesPerView: 3.4,
            },
          }}
        >
          {tournaments.map((tournament) => (
            <SwiperSlide>
              <TournamentCard key={nanoid()} tournament={tournament} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default SpotlightTournaments;

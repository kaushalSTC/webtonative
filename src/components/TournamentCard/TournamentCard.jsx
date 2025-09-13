/* eslint-disable react/prop-types */
import { useNavigate } from "react-router";
import { Calendar, Location } from "../../assets";
import { canBookOnDate, tournamentSkillLevelDefaults } from "../../utils/utlis";
import ThunderboltIcon from "../ThunderboltIcon/ThunderboltIcon";

const formatDate = (dateInput) => {
  if (!dateInput) return "Invalid Date";
  let date;

  // Check if input is in ISO format (YYYY-MM-DDTHH:mm:ss.sssZ)
  if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/.test(dateInput)) {
    date = new Date(dateInput);
  }
  // Check if input is in DD/MM/YYYY format
  else if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateInput)) {
    const [day, month, year] = dateInput.split("/").map(Number);
    date = new Date(year, month - 1, day); // Month is 0-based in JS Date
  }
  else {
    return "Invalid Date";
  }

  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
  });
};

const formatAddress = (address) => {
  return [address?.line1, address?.line2, address?.city]
    .filter(Boolean)
    .join(", ");
};

const TournamentCard = ({ tournament, imageLoading = "lazy" }) => {
  const navigate = useNavigate();
  const handle = tournament?.handle;
  const eventType = tournament?.eventType || "tournament";
  
  // Handle different naming conventions for tournaments vs social events
  const eventName = tournament?.tournamentName || tournament?.eventName || "Event";
  const eventImage = tournament?.bannerDesktopImages?.[0] || tournament?.images?.[0];
  const organizedBy = tournament?.ownerBrandName || "Picklebay";
  const startDate = tournament?.startDate ? formatDate(tournament.startDate) : "";
  
  // Handle different location structures
  const eventLocation = tournament?.tournamentLocation?.address || tournament?.eventLocation?.address;
  const locationText = eventLocation ? formatAddress(eventLocation) : "To be decided!";
  
  const isBookingAllowed = tournament.bookingEndDate ? canBookOnDate(tournament.bookingEndDate) : false;
  const bookingEndDate = tournament?.bookingEndDate ? formatDate(tournament.bookingEndDate) : null;
  const skillLevel = tournament?.tournamentSkillLevel || "All levels";
  
  let ThunderboltIconValue = 0;
  let displaySkillLevel = skillLevel;

  // Only show skill level for tournaments (social events don't have skill levels)
  if (eventType === "tournament") {
    // Check if skill level contains multiple levels (comma-separated string)
    if (typeof skillLevel === 'string') {
      // Split by comma and trim each level
      const skillLevels = skillLevel.split(',').map(level => level.trim().toLowerCase());

      // Check if "all levels" is included
      if (skillLevels.includes('all levels')) {
        ThunderboltIconValue = 4;
        displaySkillLevel = 'All levels';
      } else if (skillLevels.length > 1) {
        // Find the highest level (with highest index in the defaults array)
        let highestLevelIndex = -1;

        skillLevels.forEach(level => {
          const index = tournamentSkillLevelDefaults.findIndex(defaultLevel =>
            defaultLevel.toLowerCase() === level);
          if (index > highestLevelIndex) {
            highestLevelIndex = index;
            displaySkillLevel = tournamentSkillLevelDefaults[index];
          }
        });

        ThunderboltIconValue = highestLevelIndex !== -1 ? highestLevelIndex : 0;
      } else {
        // Single skill level
        const skillLevelIndex = tournamentSkillLevelDefaults.findIndex(level =>
          level.toLowerCase() === skillLevel.toLowerCase());
        ThunderboltIconValue = skillLevelIndex !== -1 ? skillLevelIndex : 0;
      }
    }
  }

  const eventClickHandler = (handle) => {
    // Route based on event type
    if (eventType === "socialEvents") {
      navigate(`/social-events/${handle}`);
    } else {
      navigate(`/tournaments/${handle}`);
    }
  };

  return (
    <div
      className="also-happening-card relative hover:shadow-lg transition-shadow duration-300 ease-in-out rounded-[20px] active:scale-[0.97] cursor-pointer"
      onClick={handle ? () => eventClickHandler(handle) : null}
    >
      <div className="aspect-[352/191] overflow-hidden w-full rounded-tl-[20px] rounded-tr-[20px]">
        <img
          src={eventImage}
          alt={`${eventName}-img`}
          className="w-full h-full object-cover"
          loading={imageLoading}
        />
      </div>
      <div className="border border-f0f0f0 rounded-bl-[20px] rounded-br-[20px] bg-white">
        <div className="pt-5 md:pt-4 pb-4 md:pb-2 px-5 border-b border-dbe0fc">
            <div className={`flex items-center justify-between w-full ${eventType === "tournament" ? "" : "invisible"}`}>
              <span className="flex items-center gap-1">
                <ThunderboltIcon
                  value={ThunderboltIconValue}
                  className="w-auto h-3 flex flex-row items-center"
                />
                <p className="font-general font-medium text-3838383 text-xs md:text-sm opacity-70 capitalize">
                  {skillLevel}
                </p>
              </span>
            </div>
          <p className="font-author font-medium text-2xl text-383838 truncate uppercase">
            {eventName}
          </p>
          {organizedBy && (
            <p className="font-general font-medium text-sm md:text-base text-383838 opacity-100 uppercase">
              <span className="font-general font-medium text-383838 text-xs md:text-sm opacity-70 capitalize">
                Organized By:{" "}
              </span>
              {organizedBy}
            </p>
          )}
        </div>
        <div className="flex items-center justify-between px-5 border-b border-dbe0fc">
          <div className="flex items-center gap-1 py-4 flex-none w-[45%] justify-center">
            <img src={Calendar} alt="calendar" className="w-4 h-4" />
            <p className="font-general font-medium text-xs md:text-sm text-383838 opacity-70 capitalize">
              <span>{startDate}</span> onwards
            </p>
          </div>
          <div className="w-[1px] h-[52px] bg-dbe0fc"></div>
          <div className="flex items-center gap-1 py-4 flex-none w-[47%] justify-center">
            <img src={Location} alt="location" className="w-4 h-4" />
            <p className="truncate font-general font-medium text-xs md:text-sm text-383838 opacity-70 capitalize">
              {locationText}
            </p>
          </div>
        </div>
        <p className="font-general font-medium text-383838 text-xs md:text-sm opacity-70 capitalize py-5 px-5 text-center">
          {isBookingAllowed ? 
            `Registration closes ${bookingEndDate ? `on ${bookingEndDate}` : "soon"}` : 
            `Registration closed ${bookingEndDate ? `on ${bookingEndDate}` : ""}`
          }
        </p>
      </div>
      <p className="uppercase font-general font-medium text-383838 text-xs bg-white py-[5px] px-[8px] absolute top-2 left-2 rounded-[22px]">
        {eventType === "socialEvents" ? "social event" : "tournament"}
      </p>
    </div>
  );
};

export default TournamentCard;
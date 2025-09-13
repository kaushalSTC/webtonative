import { OrganizerDefaultImgae } from "../../../assets";

/* eslint-disable react/prop-types */
const tournamentOrganizerDescription = "Championing the sport and celebrating the players shaping the future of pickleball.";
const TournamentOrganizer = ({ tournament }) => {

  if (tournament.ownerBrandName === "") return null;

  return (
    <div className="w-full bg-white px-9 md:px-20 py-10 pb-8 gap-[18px] flex flex-col mt-[10px]">
      <h2 className="font-general font-medium text-base text-1c0e0e opacity-70 capitalize">Organized By</h2>

      <div className="flex flex-row gap-1.5 md:gap-4 items-center">
      
      <img
  src={tournament?.ownerBrandLogoImage || OrganizerDefaultImgae}
  alt={tournament?.ownerBrandName}
  className="w-full max-w-14 md:max-w-20 h-auto rounded-full"
/>


        <div className="flex flex-col gap-0">
          <p className="font-author font-medium text-2xl text-383838">{tournament.ownerBrandName}</p>
        </div>
      </div>
    </div>
  )
}

export default TournamentOrganizer;
import { ProfileSavedVenue } from "../../assets"
const SavedVenues = () => {
  return (
    <div>
        <div className="w-full h-[2px] md:h-[10px] bg-f2f2f2 mb-[30px]"></div>
        <div className="px-[33px] md:px-[73px] pb-[30px]">
            <div>
                <img src={ProfileSavedVenue} alt="profile-activity" className="w-[11px] h-[15px] inline-block mr-[6px] "/>
                <span className="font-general font-medium text-sm md:text-base text-1c0e0eb3 capitalize inline" >Saved Venues</span>
            </div>
            <p className="font-general font-medium text-xs md:text-sm opacity-60 md:opacity-80 text-1c0e0eb3 capitalize mt-1">Your Saved Courts And Events Will Show Up Here!</p>
            <button disabled className="font-general font-medium text-sm md:text-base text-383838 w-full max-w-[568px] bg-f4f5ff border border-dbe0fc py-[18px] rounded-[38px] mt-[8px] md:mt-[20px] capitalize">Find Venues</button>
        </div>

    </div>
  )
}

export default SavedVenues
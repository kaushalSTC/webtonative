import ThunderboltIcon from '../../ThunderboltIcon/ThunderboltIcon'
import { CalendarIcon, Location, MapIcon, RightArrow, RightArrowLive, WhatsappIcon, WhatsappIconLive } from '../../../assets'
import { formatDate, tournamentSkillLevelDefaults } from '../../../utils/utlis'
import { useSelector } from 'react-redux';

const TournamentLiveInfo = (tournament) => {
  const skillLevel = tournament?.tournament?.tournamentSkillLevel;
  let ThunderboltIconValue = 0;
  const whatsappLink = tournament?.tournament?.whatsappGroupLink;

  const addressInfo = {
    line1: tournament?.tournament?.tournamentLocation?.address?.line1 || 'line 1',
    line2: tournament?.tournament?.tournamentLocation?.address?.line2 || 'line 2',
    city: tournament?.tournament?.tournamentLocation?.address?.city || 'city',
    state: tournament?.tournament?.tournamentLocation?.address?.state || 'state',
    postalCode: tournament?.tournament?.tournamentLocation?.address?.postalCode || 'postal code',
  }

  const handleOpenMap = () => {
    const fullAddress = `${addressInfo.line1}, ${addressInfo.line2}, ${addressInfo.city}, ${addressInfo.state}, ${addressInfo.postalCode}`;
    if (!fullAddress.trim()) return;
    const googleMapUrl = `https://www.google.com/maps?q=${encodeURIComponent(
      fullAddress
    )}`;
    window.open(googleMapUrl, "_blank");
  };

  // New function to handle opening WhatsApp group
  const handleJoinWhatsappGroup = () => {
    if (whatsappLink) {
      window.open(whatsappLink, "_blank");
    }
  };

  if (skillLevel.toLowerCase() === "all levels") {
    ThunderboltIconValue = 4;
  } else {
    const skillLevelIndex = tournamentSkillLevelDefaults.findIndex(level => level.toLowerCase() === skillLevel.toLowerCase());
    ThunderboltIconValue = skillLevelIndex;
  }

  const isLive = () => {
    const now = new Date();
    const startDate = tournament?.tournament?.startDate;
    const endDate = tournament?.tournament?.endDate;

    if (!startDate || !endDate) return false;

    const [startDay, startMonth, startYear] = startDate.split('/');
    const [endDay, endMonth, endYear] = endDate.split('/');
    const start = new Date(`${startYear}-${startMonth}-${startDay}T00:00:00`);
    const end = new Date(`${endYear}-${endMonth}-${endDay}T23:59:59`);

    return now >= start && now <= end;
  };
  const isLoggedIn = useSelector((state)=>state.auth.isLoggedIn)

  return (
    <div  className={`w-full bg-white px-9 md:px-20 py-10 gap-2 ${isLoggedIn ? "pb-10" : "pb-0"}`}>
      <div className='flex items-center justify-between gap-2 mb-2'>
        <p className='text-[34px] font-author font-medium text-383838 leading-8 tracking-normal w-[60%]'>{tournament?.tournament?.tournamentName}</p>
        {isLive() && (
        <div className='flex items-center gap-1 border border-56b918 rounded-2xl py-2 px-2'>
          <span className='inline-block w-[8px] h-[8px] rounded-full bg-56b918'></span>
          <p className='font-general font-medium text-56b918 text-[10px] md:text-xs uppercase leading-1'>live now</p>
        </div>
        )}
      </div>
      <div className='flex items-center gap-2 mb-2'>
        <ThunderboltIcon className='flex flex-row' value={ThunderboltIconValue} iconClassName='w-4 h-4 object-cover' />
        <p className='font-general font-medium text-383838 text-xs md:text-sm opacity-70 capitalize'>{tournament?.tournament?.tournamentSkillLevel}</p>
      </div>
      <div className='flex items-center justify-between'>
        <div className='flex items-start gap-1 max-w-[70%]'>
          <img src={Location} alt="location-icon" className="w-4 h-4 mt-2" />
          <div className='w-full max-w-full'>
          <p className='font-author font-medium text-sm md:text-2xl text-1c0e0e truncate'>{tournament?.tournament?.tournamentLocation?.name}</p>
          <p className='font-general font-medium text-xs md:text-base text-1c0e0e opacity-50 truncate'>{addressInfo.line1}, {addressInfo.line2}, {addressInfo.city}, {addressInfo.state}, {addressInfo.postalCode}</p>
          </div>
        </div>
        <div onClick={handleOpenMap} className="cursor-pointer w-[10%]">
          <span className="w-6 h-6 ml-auto block">
            <img src={MapIcon} alt="map-icon" className="w-6 h-6 " />
          </span>
          <p className="font-medium font-general text-sm text-244cb4 underline max-md:text-[12px] whitespace-nowrap">
            Map View
          </p>
        </div>
      </div>
      <div className='w-full h-[1px] bg-f2f2f2 my-6'></div>

      <div>
        <div className='flex items-center justify-between gap-2 flex-wrap'>
          <div>
            <p className='font-general font-medium text-383838 opacity-70 text-sm md:text-base'>Duration</p>
            <div className='flex items-center gap-2'>
              <img src={CalendarIcon} alt="calender-icon" className='w-4 h-4 mt-1' />
              <p className='font-medium font-general text-xs text-383838 opacity-70 md:text-sm'>
                {formatDate(tournament?.tournament?.startDate)} - {formatDate(tournament?.tournament?.endDate)}
              </p>
            </div>
          </div>
          {whatsappLink && (
            <div
              onClick={handleJoinWhatsappGroup}
              className='flex items-center bg-f2f2f2 px-4 py-3 rounded-xl gap-2 cursor-pointer hover:bg-opacity-80 transition-all max-[450px]:w-full justify-between'
            >
              <div className='flex items-center gap-2'>
                <img src={WhatsappIconLive} alt="whatsapp-icon" className='w-6 h-6' />
                <p className='font-general font-medium text-xs md:text-sm text-383838 opacity-70'>Join Whatsapp Group</p>
              </div>
              <img src={RightArrowLive} alt="whatsapp-icon" className='w-4 h-4' />
            </div>
          )}
        </div>
      </div>

    </div>
  )
}

export default TournamentLiveInfo
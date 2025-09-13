import parse from 'html-react-parser';
import PropTypes from 'prop-types';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { RWebShare } from 'react-web-share';
import { CalendarIcon, ShareIcon } from '../../../assets';
import { formatDate, tournamentSkillLevelDefaults } from '../../../utils/utlis';
import { canBookOnDate } from '../../../utils/utlis';
import ThunderboltIcon from '../../ThunderboltIcon/ThunderboltIcon';

const TournamentInfo = ({ tournament }) => {
  const [isSharing, setIsSharing] = useState(false);
  const navigate = useNavigate();
  const isBookingAllowed = tournament.bookingEndDate ? canBookOnDate(tournament.bookingEndDate) : false;
  const skillLevel = tournament?.tournamentSkillLevel;
  let ThunderboltIconValue = 0;
  let displaySkillLevel = skillLevel;
  const category= tournament.categories;
  
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

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [day, month, year] = tournament.bookingStartDate.split("/").map(Number);
  const bookingDate = new Date(year, month - 1, day); // month is 0-indexed

  const handleLiveClick = () => {
    navigate(`/tournaments/${tournament.handle}/live`);
  };

  return (
    <>
      <div className="w-full bg-white px-9 md:px-20 py-10 pb-8 gap-2">
        {/*
          ┌─────────────────────────────────────────────────────────────────────────────┐
          │         Skill Level                                                         │
          └─────────────────────────────────────────────────────────────────────────────┘
        */}
        {tournament.categories.length > 0 && <div className='flex flex-row items-center justify-start gap-3 mb-3 md:mb-1'>
          <ThunderboltIcon value={ThunderboltIconValue} className="w-auto h-3 flex flex-row items-center" />
          <p className='ffont-general font-medium text-3838383 text-xs md:text-sm opacity-70 capitalize'>{skillLevel}</p>
        </div>}


        <div className="flex flex-row items-center justify-between mb-3 md:mb-1">
          <h1 className="text-[34px] font-author font-medium text-383838 leading-8 tracking-normal">
            {tournament.tournamentName}
          </h1>

          <div className="flex">
            <RWebShare data={{ text: '', url: location.href, title: '' }} onShareWindowClose={() => setIsSharing(false)} beforeOpen={() => setIsSharing(true)} disabled={isSharing}>
              <img src={ShareIcon} alt="share-icon" className="w-5 h-5 ml-auto" style={{ opacity: isSharing ? 0.5 : 1 }} />
            </RWebShare>
          </div>
        </div>

        {/*
          ┌─────────────────────────────────────────────────────────────────────────────┐
          │       Tournament Duration                                                   │
          └─────────────────────────────────────────────────────────────────────────────┘
        */}
        <div className="flex flex-col gap-2">
          <p className="text-1c0e0eB3 text-[15px] font-general font-medium">Duration</p>
          <div className="flex flex-row gap-2">
            <img src={CalendarIcon} alt="" className='w-[11px] h-auto ' />
            <p className="text-383838 opacity-70 text-sm font-general font-medium">
              {formatDate(tournament.startDate, true, true, false)} - {formatDate(tournament.endDate, true, true, false)}
            </p>
          </div>
        </div>
      </div>

      {/*
        ┌─────────────────────────────────────────────────────────────────────────────┐
        │       Registration Closing Date                                            │
        └─────────────────────────────────────────────────────────────────────────────┘
      */}
      {tournament.isFixturePublished ? (
        <p className="font-general text-sm font-medium text-383838 bg-f4f5ff text-center p-2 cursor-pointer" onClick={handleLiveClick}>
          <span className='text-244cb4 underline text-sm font-medium font-general'>Click here</span> for Live Tournament Page - Draws, Schedule, Results and Standings
        </p>
      ) : (
        <>
          {isBookingAllowed ? (
            <div className="bg-f4f5ff text-center p-2 flex flex-col md:flex-row items-center justify-center gap-2 divide-y md:divide-y-0 md:divide-x divide-gray-400">

              <p className="font-general text-sm font-medium text-383838 w-full text-center pb-2 md:pb-0 md:pr-2">
                {bookingDate > today
                  ? `Registration Opens on - ${formatDate(tournament.bookingStartDate)}`
                  : `Registration Opened on - ${formatDate(tournament.bookingStartDate)}`}
              </p>
              <p className="font-general text-sm font-medium text-383838 w-full text-center md:text-left md:pl-2">
                Registration Closes on - {formatDate(tournament.bookingEndDate)}
              </p>
            </div>
          ) : (
              <p className="font-general text-sm font-medium text-383838 bg-f4f5ff text-center p-2 cursor-pointer">
                Registration Closed on - {formatDate(tournament.bookingEndDate)}
              </p>
          )}
        </>
      )}


      {/*
        ┌─────────────────────────────────────────────────────────────────────────────┐
        │       Description                                                           │
        └─────────────────────────────────────────────────────────────────────────────┘
      */}
      <div className="w-full bg-white px-9 md:px-20 py-10 pb-8 gap-2 [&_p_a]:break-words">
        <div className="prose max-w-none mx-auto">
          {parse(tournament.description)}
        </div>
      </div>
    </>
  );
};


TournamentInfo.propTypes = {
  tournament: PropTypes.shape({
    tournamentName: PropTypes.string,
    description: PropTypes.string,
    startDate: PropTypes.string,
    endDate: PropTypes.string,
    handle: PropTypes.string,
    isFixturePublished: PropTypes.bool,
    categories: PropTypes.arrayOf(
      PropTypes.shape({
        _id: PropTypes.string,
        tournamentId: PropTypes.string,
        categoryName: PropTypes.string,
        format: PropTypes.string,
        type: PropTypes.string,
        registrationFee: PropTypes.number,
        maxPlayers: PropTypes.number,
        minPlayers: PropTypes.number,
        skillLevel: PropTypes.string,
        categoryLocation: PropTypes.shape({
          name: PropTypes.string,
          address: PropTypes.shape({
            line1: PropTypes.string,
            line2: PropTypes.string,
            city: PropTypes.string,
            state: PropTypes.string,
            postalCode: PropTypes.string,
            location: PropTypes.shape({
              type: PropTypes.string,
              coordinates: PropTypes.arrayOf(PropTypes.number),
              is_location_exact: PropTypes.bool,
            }),
          }),
        }),
        categoryStartDate: PropTypes.string,
        createdAt: PropTypes.string,
        updatedAt: PropTypes.string,
      })
    ),
    bookingEndDate: PropTypes.string,
  }),
};

export default TournamentInfo;

import PropTypes from 'prop-types';
import { getSkillLevelsFromTournamentCategory, tournamentSkillLevelDefaults } from '../../../utils/utlis';
import ThunderboltIcon from '../../ThunderboltIcon/ThunderboltIcon';

const defaultTextClassName = 'font-general text-383838 opacity-70 text-sm';

const TournamentDetailsSkillLevel = ({ categories, textClassName = defaultTextClassName }) => {
  const skillLevel = getSkillLevelsFromTournamentCategory(categories);
  let ThunderboltIconValue = 0;
  let displaySkillLevel = skillLevel.name;
  // Check if skill level contains multiple levels (comma-separated string)
  if (typeof skillLevel.name === 'string') {
    // Split by comma and trim each level
    const skillLevels = skillLevel.name.split(',').map(level => level.trim().toLowerCase());
    
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
        level.toLowerCase() === skillLevel.name.toLowerCase());
      ThunderboltIconValue = skillLevelIndex !== -1 ? skillLevelIndex : 0;
    }
  }

  return (
    <div className="flex flex-row items-center justify-start gap-3 mb-3 md:mb-1">
      <ThunderboltIcon value={ThunderboltIconValue}
        className="flex flex-row gap-1"
        iconClassName="w-auto h-[13px]"
      />
      <p className={textClassName}>{skillLevel.name.capitalize()}</p>
    </div>
  );
};

TournamentDetailsSkillLevel.propTypes = {
  categories: PropTypes.arrayOf(
    PropTypes.shape({
      skillLevel: PropTypes.string,
    })
  ),
};

export default TournamentDetailsSkillLevel;

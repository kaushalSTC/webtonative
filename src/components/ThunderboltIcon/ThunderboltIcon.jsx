import PropTypes from 'prop-types';

const skillLevels = [
  {
    skill: "all levels",
    value: 4,
  },
  {
    skill: "beginner",
    value: 1,
  },
  {
    skill: "amateur",
    value: 2,
  },
  {
    skill: "intermediate",
    value: 3,
  },
  {
    skill: "advanced",
    value: 4,
  },
];

const ThunderboltIcon = ({
  value = 0, 
  level = '', 
  max = 4, 
  className = 'flex flex-row w-full', 
  iconClassName = 'w-5 h-5 object-cover'
}) => {
  // Determine the actual value to use
  let displayValue = value;
  
  // If level is provided, look up its corresponding value in skillLevels
  if (level && level !== '') {
    const skillLevel = skillLevels.find(item => item.skill === level.toLowerCase());
    if (skillLevel) {
      displayValue = skillLevel.value;
    }
  }
  
  return (
    <div className={className}>
      {[...Array(max)].map((_, i) => (
        <svg key={i} className={iconClassName} xmlns="http://www.w3.org/2000/svg" width="16" height="17.168" viewBox="0 0 16 17.168">
          <g id="Group_9" data-name="Group 9" transform="translate(0 0.585)">
            <rect id="Rectangle_8" data-name="Rectangle 8" width="16" height="16" fill="none"/>
            <path id="Path_6" data-name="Path 6" d="M50.981,29.9l.994-4.969L48,23.445l6.956-7.453-.994,4.969,3.975,1.491Z" transform="translate(-44.969 -14.949)" fill={`${i < displayValue ? '#abe400' : 'none'}`} stroke="#abe400" strokeWidth="1"/>
          </g>
        </svg>
      ))}
    </div>
  );
};

ThunderboltIcon.propTypes = {
  value: PropTypes.number,
  level: PropTypes.string,
  max: PropTypes.number,
  className: PropTypes.string,
  iconClassName: PropTypes.string,
};

export default ThunderboltIcon;
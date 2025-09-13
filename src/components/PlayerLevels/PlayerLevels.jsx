import { motion } from 'motion/react';
import PropTypes from 'prop-types';
import ThunderboltIcon from '../ThunderboltIcon/ThunderboltIcon';
import './PlayerLevels.css';

const defaultPlayerLevels = [
  {
    level: 1,
    title: 'Beginner',
    subTitle: 'I am exploring the sport',
  },
  {
    level: 2,
    title: 'Amateur',
    subTitle: 'I play sometimes',
  },
  {
    level: 3,
    title: 'Intermediate',
    subTitle: 'I play multiple times a week',
  },
  {
    level: 4,
    title: 'Advanced',
    subTitle: 'I’m a competitor driven by excellence',
  },
];

const PlayerLevels = ({ playerLevels = defaultPlayerLevels, staggerConatiner, staggerChildren, getValue }) => {
  // Function to handle input change
  const handleInputChange = (event) => {
    const selectedValue = event.target.value;
    getValue(selectedValue);
  };

  return (
    <motion.div variants={staggerConatiner} initial="initial" animate="default" className="grid grid-cols-2 gap-[10px]">
      {playerLevels.map((levelObject) => (
        <motion.div variants={staggerChildren} key={levelObject.title} className="relative">
          <input
            type="radio"
            name="level"
            id={levelObject.level}
            className="peer sr-only"
            value={levelObject.title.toLowerCase()}
            onChange={handleInputChange}
          />

          {/* Wrapper div that can be targeted by peer-checked */}
          <div className="input-radio flex flex-col w-full h-full gap-9 peer-checked:bg-white peer-checked:text-[#383838] bg-[#f8f8f81a] text-white rounded-r-20 p-4">
            <div className="flex flex-row justify-between">
              <ThunderboltIcon value={levelObject.level} max={playerLevels.length}></ThunderboltIcon>
              <div className="radio w-5 h-5 rounded-full bg-[#FFFFFF1A] border border-[#FCFDFF] "/>
            </div>

            <div className="flex flex-col">
              <p className="text-lg font-medium">{levelObject.title}</p>
              <p className="text-sm font-medium opacity-70">{levelObject.subTitle}</p>
            </div>
          </div>

          {/* Label positioned absolutely over the entire component for better click target */}
          <label htmlFor={levelObject.level} className="absolute inset-0 cursor-pointer "/>
        </motion.div>
      ))}
    </motion.div>
  );
};

PlayerLevels.propTypes = {
  staggerConatiner: PropTypes.object,
  staggerChildren: PropTypes.object,
  getValue: PropTypes.func,
  playerLevels: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      subTitle: PropTypes.string.isRequired,
    })
  ),
};

export default PlayerLevels;

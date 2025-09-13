/* eslint-disable react/prop-types */
import { AnimatePresence, motion } from 'motion/react';
import PropTypes from 'prop-types';
import { useRef, useState } from 'react';
import { useSelector } from 'react-redux';

const defaultGenders = [
  {
    label: 'Male',
    value: 'male',
  },
  {
    label: 'Female',
    value: 'female',
  },
  {
    label: 'Other',
    value: 'other',
  },
];

const defaultClassName = "w-full p-5 rounded-r-20 bg-[#f8f8f81A] border border-[#F2F2F21A] text-ffffff placeholder:font-general placeholder:font-medium placeholder:text-ffffff placeholder:opacity-50 focus:outline-hidden appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none";
const defaultDropDownClassName = "absolute z-10 flex flex-col items-start gap-3 top-full left-0 mt-2 w-full rounded-r-20 bg-[#f8f8f81A] border border-[#F2F2F21A] text-ffffff backdrop-blur focus:outline-hidden";

const GenderPicker = ({ staggerChildren, formInput, genders = defaultGenders, getValue, className = defaultClassName, dropDownClassName = defaultDropDownClassName, disabled = false, preFillPlayerData = true}) => {
  const [isOpen, setIsOpen] = useState(false);
  const player = useSelector((state) => state.player);
  const [selectedGender, setSelectedGender] = useState( preFillPlayerData && player.gender ? player.gender : '');
  const dropDownRef = useRef(null);
  
  const handleGenderSelect = (genderValue) => {
    setSelectedGender(genderValue);
    getValue(genderValue);
    setIsOpen(false);
  };

  return <motion.div variants={staggerChildren} className="relative w-1/2" ref={dropDownRef}>
    <motion.input
      variants={staggerChildren}
      className={className}
      type={formInput.type}
      placeholder={formInput.label}
      onClick={!disabled ? () => setIsOpen(!isOpen) : undefined}
      onBlur={!disabled ? () => setIsOpen(false) : undefined}
      onFocus={!disabled ? () => setIsOpen(true) : undefined}
      value={selectedGender ? genders.find(g => g.value === selectedGender)?.label || '' : ''}
      readOnly
    />
    <AnimatePresence>
      {isOpen && (
        <motion.div
          transition={{ delay: 0 }}
          initial={{ opacity: 0, y: "-5px" }}
          animate={{ opacity: 1, y: "0px" }}
          exit={{ opacity: 0, y: "-5px" }}
          className={dropDownClassName}
        >
          {genders.map((genderObject, index) => {
            return <div key={index} className="w-full p-3" onClick={() => handleGenderSelect(genderObject.value)}> {genderObject.label} </div>
          })}
        </motion.div>
        )
      }
    </AnimatePresence>
  </motion.div>
}

GenderPicker.propTypes = {
  staggerChildren: PropTypes.object,
  formInput: PropTypes.object,
  className: PropTypes.string,
  dropDownClassName: PropTypes.string,
  genders: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    })
  ),
  getValue: PropTypes.func,
}

export default GenderPicker
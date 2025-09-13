/* eslint-disable react/prop-types */
import { motion } from 'motion/react';
import PropType from 'prop-types';
import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import useClickOutside from '../../hooks/UseClickOutside';

const DatePicker = ({ className, containerClassName = "", type, placeholder, getValue, staggerChildren, disabled = false, preFillPlayerData = true }) => {
  const player = useSelector((state) => state.player);
  const [selectedDate, setSelectedDate] = useState('');
  const [inputValue, setInputValue] = useState(preFillPlayerData && player.dob ? player.dob : '');
  const [showCalendar, setShowCalendar] = useState(false);
  const [showCalendarYear, setShowCalendarYear] = useState(false);
  const [showCalendarMonth, setShowCalendarMonth] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [showAbove, setShowAbove] = useState(false);
  const inputRef = useRef(null);
  const calendarRef = useRef(null);
  const calendarParentRef = useRef(null);

  useClickOutside(calendarParentRef, () => {
    setShowCalendar(false);
  });

  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  useEffect(() => {
    if (selectedDate) {
      setInputValue(formatDate(selectedDate));
      getValue(formatDate(selectedDate));
    }
  }, [selectedDate, getValue]);

  useEffect(() => {
    if (showCalendar && inputRef.current && calendarRef.current) {
      const inputRect = inputRef.current.getBoundingClientRect();
      const calendarHeight = calendarRef.current.offsetHeight;
      const viewportHeight = window.innerHeight;
      const spaceBelow = viewportHeight - inputRect.bottom;
      const spaceAbove = inputRect.top;
      const PADDING = 10;
      setShowAbove(spaceBelow < calendarHeight + PADDING && spaceAbove > calendarHeight);
    }
  }, [showCalendar]);

  const validateDate = (dateString) => {
    // Accept formats: MM/DD/YYYY, MM-DD-YYYY
    const dateRegex = /^(0[1-9]|1[0-2])[/-](0[1-9]|[12]\d|3[01])[/-](19|20)\d{2}$/;

    if (!dateRegex.test(dateString)) {
      return null;
    }

    // Replace both / and - with / for consistent parsing
    const normalizedDate = dateString.replace(/-/g, '/');
    const [month, day, year] = normalizedDate.split('/').map(Number);
    const date = new Date(year, month - 1, day);

    // Check if the date is valid (e.g., not 02/31/2024)
    if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) {
      return null;
    }

    return date;
  };

  const handleInputBlur = () => {
    const validDate = validateDate(inputValue);
    if (validDate) {
      setSelectedDate(validDate);
      setCurrentMonth(validDate);
    } else {
      // Reset to previous valid date or empty
      setInputValue(selectedDate ? formatDate(selectedDate) : '');
      getValue(selectedDate ? formatDate(selectedDate) : '');
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    // Allow only numbers, forward slash, and hyphen
    if (/^[\d/-]*$/.test(value)) {
      setInputValue(value);
      getValue(value);
    }
  };

  const getYearsList = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    const startYear = 1950; // Changed from currentYear - 50 to fixed 1950
    const endYear = currentYear + 50;

    for (let year = startYear; year <= endYear; year++) {
      years.push(year);
    }
    return years;
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay();

    const days = [];
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(null);
    }

    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }

    return days;
  };

  const formatDate = (date) => {
    if (!date) return '';
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setShowCalendar(false);
  };

  const handlePrevMonth = (e) => {
    e.preventDefault();
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const handleNextMonth = (e) => {
    e.preventDefault();
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const handleYearSelect = (year) => {
    setCurrentMonth(new Date(year, currentMonth.getMonth()));
    setShowCalendarYear(false);
  };

  const handleMonthSelect = (monthIndex) => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), monthIndex));
    setShowCalendarMonth(false);
  };

  return (
    <div className={`relative ${containerClassName}`} ref={calendarParentRef}>
      <div className="relative" ref={inputRef}>
        <motion.input
          variants={staggerChildren}
          type={type}
          className={className}
          placeholder={placeholder}
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          onClick={!disabled ? () => setShowCalendar(true) : undefined}
          onFocus={!disabled ? () => setShowCalendar(true) : undefined}
        />
      </div>

      {showCalendar && (
        <div
          ref={calendarRef}
          className={`absolute w-full bg-white border rounded-lg shadow-lg z-50 max-w-60 left-1/2 -translate-x-1/2 ${
            showAbove ? 'bottom-full mb-1' : 'top-full mt-1'
          }`}
        >
          {showCalendarYear ? (
            <div className="grid grid-cols-3 gap-3 p-2 place-items-center overflow-y-auto max-h-44">
              {getYearsList().map((year) => (
                <span
                  key={year}
                  className="font-semibold cursor-pointer hover:bg-blue-100 p-2 rounded-lg w-full text-center"
                  onClick={() => handleYearSelect(year)}
                >
                  {year}
                </span>
              ))}
            </div>
          ) : showCalendarMonth ? (
            <div className="grid grid-cols-3 gap-3 p-2 place-items-center">
              {months.map((month, index) => (
                <span
                  key={month}
                  className={`font-semibold cursor-pointer hover:bg-blue-100 p-2 rounded-lg w-full text-center ${
                    currentMonth.getMonth() === index ? 'bg-blue-500 text-white hover:bg-blue-600' : ''
                  }`}
                  onClick={() => handleMonthSelect(index)}
                >
                  {month.slice(0, 3)}
                </span>
              ))}
            </div>
          ) : (
            <>
              <div className="flex justify-between items-center p-2 border-b">
                <button type="button" onClick={handlePrevMonth} className="p-1 hover:bg-gray-100 rounded-sm">
                  ←
                </button>
                <span
                  className="font-semibold cursor-pointer hover:bg-gray-100 p-1 rounded-sm"
                  onClick={() => setShowCalendarMonth(true)}
                >
                  {currentMonth.toLocaleDateString('en-US', { month: 'long' })}
                </span>
                <span
                  className="font-semibold cursor-pointer hover:bg-gray-100 p-1 rounded-sm"
                  onClick={() => setShowCalendarYear(true)}
                >
                  {currentMonth.toLocaleDateString('en-US', { year: 'numeric' })}
                </span>
                <button type="button" onClick={handleNextMonth} className="p-1 hover:bg-gray-100 rounded-sm">
                  →
                </button>
              </div>
              <div className="grid grid-cols-7 gap-1 p-2">
                {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
                  <div key={day} className="text-center text-sm font-medium text-gray-600">
                    {day}
                  </div>
                ))}

                {getDaysInMonth(currentMonth).map((date, index) => (
                  <div
                    key={index}
                    className={`
                      text-center p-1 cursor-pointer hover:bg-blue-100 rounded-sm
                      ${date ? '' : 'invisible'}
                      ${
                        date && selectedDate && date.toDateString() === selectedDate.toDateString()
                          ? 'bg-blue-500 text-white hover:bg-blue-600'
                          : ''
                      }
                    `}
                    onClick={() => date && handleDateSelect(date)}
                  >
                    {date ? date.getDate() : ''}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

DatePicker.propTypes = {
  className: PropType.string,
};

export default DatePicker;
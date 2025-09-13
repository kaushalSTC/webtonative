import React, { useState, useEffect, useCallback } from 'react';

const TimeInput = ({ onTimeChange }) => {
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

  const handleInputChange = useCallback((e, isStartTime) => {
    const input = e.target.value.replace(/[^0-9:]/g, '');
    
    // Prevent more than 5 characters total
    if (input.length > 5) return;

    // If input doesn't contain :, add it after 2 digits
    let formattedTime = input;
    if (input.length === 2 && !input.includes(':')) {
      formattedTime = `${input}:`;
    }
    
    // Prevent more than 4 digits total
    const digitCount = input.replace(/:/g, '').length;
    if (digitCount > 4) return;

    // Update state based on which input is being modified
    if (isStartTime) {
      setStartTime(formattedTime);
    } else {
      setEndTime(formattedTime);
    }
  }, []);

  const validateTime = useCallback((time) => {
    // Remove any non-numeric characters
    const cleanTime = time.replace(/[^0-9]/g, '');
    
    // Ensure we have 4 digits
    if (cleanTime.length !== 4) return '';

    // Extract hours and minutes
    const hours = cleanTime.slice(0, 2);
    const minutes = cleanTime.slice(2);

    // Validate hours and minutes
    const numHours = parseInt(hours, 10);
    const numMinutes = parseInt(minutes, 10);

    if (numHours > 23 || numMinutes > 59) return '';

    return `${hours}:${minutes}`;
  }, []);

  useEffect(() => {
    const validStartTime = validateTime(startTime);
    const validEndTime = validateTime(endTime);
    
    if (validStartTime && validEndTime) {
      onTimeChange({
        startTime: validStartTime,
        endTime: validEndTime
      });
    }
  }, [startTime, endTime, onTimeChange, validateTime]);

  return (
    <div className="flex items-center space-x-5">
      <input 
        type="text" 
        value={startTime}
        onChange={(e) => handleInputChange(e, true)}
        placeholder="HH:MM"
        className="w-[130px] bg-f2f2f2 border border-d6d6d6 rounded-[15px] text-sm mr-5 text-center py-4 font-general font-medium text-383838"
      />
      <input 
        type="text" 
        value={endTime}
        onChange={(e) => handleInputChange(e, false)}
        placeholder="HH:MM"
        className="w-[130px] bg-f2f2f2 border border-d6d6d6 rounded-[15px] text-sm mr-5 text-center py-4 font-general font-medium text-383838"
      />
    </div>
  );
};

export default TimeInput;
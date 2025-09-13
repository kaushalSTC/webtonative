import React, { useState, useEffect, useCallback, useRef } from 'react';

const SelectTime = ({ onTimeChange = null, initialTime = null, readOnly = false }) => {
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const hasValidTimes = useRef(false); // Ref to track if both times were valid

    useEffect(() => {
        if (initialTime?.startTime) {
            setStartTime(initialTime.startTime);
        }
        if (initialTime?.endTime) {
            setEndTime(initialTime.endTime);
        }
    }, [initialTime]);

    const handleInputChange = useCallback((e, isStartTime) => {
        const input = e.target.value.replace(/[^0-9:]/g, '');

        if (input.length > 5) return;

        let formattedTime = input;
        if (input.length === 2 && !input.includes(':')) {
            formattedTime = `${input}:`;
        }

        const digitCount = input.replace(/:/g, '').length;
        if (digitCount > 4) return;

        if (isStartTime) {
            setStartTime(formattedTime);
        } else {
            setEndTime(formattedTime);
        }
        hasValidTimes.current = false; // Reset the flag on input change
    }, []);

    const validateTime = useCallback((time) => {
        if (!time) {
            return '';
        }
        const cleanTime = time.replace(/[^0-9]/g, '');
        if (cleanTime.length !== 4) return '';
        const hours = cleanTime.slice(0, 2);
        const minutes = cleanTime.slice(2);
        const numHours = parseInt(hours, 10);
        const numMinutes = parseInt(minutes, 10);
        if (numHours > 23 || numMinutes > 59) return '';
        return `${hours}:${minutes}`;
    }, []);

    useEffect(() => {
        const validStartTime = validateTime(startTime);
        const validEndTime = validateTime(endTime);

        if (validStartTime && validEndTime && !hasValidTimes.current) {
            onTimeChange({
                startTime: validStartTime,
                endTime: validEndTime
            });
            hasValidTimes.current = true; // Set the flag to prevent further calls
        } else if (!validStartTime || !validEndTime) {
            hasValidTimes.current = false; // Reset the flag if either time becomes invalid
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

export default SelectTime;
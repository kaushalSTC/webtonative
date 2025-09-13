import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const SelectFormat = ({ saveFormat, initialFormat }) => {
    const [selectedFormat, setSelectedFormat] = useState(null); // 'single' or 'double'
    
    // Handle initial format when component mounts or initialFormat changes
    useEffect(() => {
        if (initialFormat) {
            // Convert the format from API value to component value
            if (initialFormat === 'SE') {
                setSelectedFormat('singles');
            } else if (initialFormat === 'DE') {
                setSelectedFormat('doubles');
            }
        }
    }, [initialFormat]);
    
    const handleFormatChange = (format) => {
        setSelectedFormat((prev) => (prev === format ? null : format)); // Toggle logic
        
        if (format === 'singles') {
            saveFormat('SE');
        } else if (format === 'doubles') {
            saveFormat('DE');
        } else {
            // If format is deselected (null), pass null to parent
            saveFormat(null);
        }
    };

    const renderRadioButton = (format) => {
        const isSelected = selectedFormat === format;

        return (
            <div className="flex flex-row items-start gap-5">
                {/* Radio Button */}
                <div onClick={() => handleFormatChange(format)} className="cursor-pointer">
                    <input type="radio" checked={isSelected} readOnly className="hidden "/>
                    <span className='mt-5 block w-5 h-5 rounded-full border border-56b918 bg-transparent transition data-[checked]:bg-transparent'>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 22 22" style={{
                            strokeDashoffset: isSelected ? '0' : '-30',
                            strokeDasharray: '30',
                            strokeLinecap: 'round',
                            strokeLinejoin: 'round',
                            }}
                            className="w-5 h-5 fill-none stroke-56b918 stroke-2 transition-[stroke-dashoffset] duration-250 ease-in-out" >
                            {isSelected && <circle cx="10" cy="10" r="3" fill="white"></circle>}
                        </svg>
                    </span>
                </div>

                {/* Format Display */}
                <div className={`${isSelected ? 'border-56b918' : 'border-f0f0f0'}  border rounded-r-20 flex flex-col w-full`}>
                    <button onClick={() => handleFormatChange(format)} className={`${isSelected ? 'pl-5 pt-5 pr-5 pb-5' : 'p-5'} cursor-pointer w-full text-left flex flex-row justify-between items-center`}>
                        <p className="font-general font-medium text-base text-1c0e0e opacity-70 capitalize">
                            {format}
                        </p>
                    </button>
                </div>
            </div>
        );
    };

    return (
        <div className="space-y-4">
            {renderRadioButton('singles')}
            {renderRadioButton('doubles')}
        </div>
    );
}

export default SelectFormat
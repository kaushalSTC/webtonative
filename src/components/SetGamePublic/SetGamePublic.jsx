import React, { useEffect, useState } from 'react'
import { Switch } from '@headlessui/react'
import { useChangeGameVisibility } from '../../hooks/GameHooks'
import { createToast } from '../../utils/utlis';

const SetGamePublic = ({ userID, handle, initialVisibility, isGameDatePast = false }) => {
    // Initialize state based on the API data
    const [enabled, setEnabled] = useState(initialVisibility === 'PUBLIC');
    const { mutate, isLoading, isError, error } = useChangeGameVisibility();
    
    useEffect(() => {
        console.log(userID, 'userID');
        // Update the toggle state if initialVisibility changes
        if (initialVisibility) {
            setEnabled(initialVisibility === 'PUBLIC');
        }
    }, [userID, initialVisibility]);
    
    const handleChange = (value) => {
        setEnabled(value);
        let visibilityObj = { visibility: value ? 'PUBLIC' : 'PRIVATE' };
        mutate({ userID, handle, visibilityObj },
            {
                onSuccess: () => {
                    createToast('Game visibility changed successfully');
                },
                onError: (error) => {
                    createToast(error?.message || 'Error changing game visibility');
                }
            }
        );
    }

    return (
        <div className='flex items-center justify-between pt-10'>
            <p className='font-general font-medium text-sm md:text-base text-1c0e0eb3'>Set game visibility to public</p>
            <Switch
                checked={enabled}
                onChange={() => handleChange(!enabled)}
                className={`group relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-gray-200 transition-colors duration-200 ease-in-out focus:outline-hidden data-checked:bg-56b918 ${isGameDatePast ? 'opacity-50 pointer-events-none' : ''}`}
            >
                <span className="sr-only">Use setting</span>
                <span
                    aria-hidden="true"
                    className="pointer-events-none inline-block size-5 transform rounded-full bg-white ring-0 shadow-sm transition duration-200 ease-in-out group-data-checked:translate-x-5"
                />
            </Switch>
        </div>
    )
}

export default SetGamePublic
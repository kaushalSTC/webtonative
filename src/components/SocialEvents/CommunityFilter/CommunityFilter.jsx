import React from 'react';

const CommunityFilter = ({ onFilterChange, activeFilter }) => {
    const formatDate = (date) => {
        return date.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    const getThisWeekDateRange = () => {
        const today = new Date();
        const startDate = new Date(today);
        startDate.setDate(today.getDate() - today.getDay()); // Start of week (Sunday)
        const endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + 6); // End of week (Saturday)
        
        return {
            startDate: formatDate(startDate),
            endDate: formatDate(endDate),
        };
    };

    const getThisMonthDateRange = () => {
        const today = new Date();
        const startDate = new Date(today.getFullYear(), today.getMonth(), 1); // First day of month
        const endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0); // Last day of month
        
        return {
            startDate: formatDate(startDate),
            endDate: formatDate(endDate),
        };
    };

    const isFilterActive = (filterType) => {
        if (!activeFilter) return false;
        return activeFilter.includes(filterType);
    };

    const handleFilterClick = (filterType) => {
        let newActiveFilter;
        let newDateRange = null;

        if (filterType === 'past') {
            // Toggle past events filter
            if (activeFilter && activeFilter.includes('past')) {
                // Remove past from active filter
                newActiveFilter = activeFilter.replace('past', '').replace(/^,|,$/, '').replace(/,,/, ',');
                newActiveFilter = newActiveFilter || null;
            } else {
                // Add past to active filter
                newActiveFilter = activeFilter ? `${activeFilter},past` : 'past';
            }
        } else if (filterType === 'week' || filterType === 'month') {
            // Handle week/month filters (mutually exclusive)
            const isPastActive = activeFilter && activeFilter.includes('past');
            
            if (activeFilter === filterType || (activeFilter && activeFilter.includes(filterType))) {
                // Remove this filter
                newActiveFilter = isPastActive ? 'past' : null;
            } else {
                // Set this filter (and keep past if it was active)
                newActiveFilter = isPastActive ? `${filterType},past` : filterType;
            }
        }

        // Set date range based on the new filter
        if (newActiveFilter && newActiveFilter.includes('week')) {
            newDateRange = getThisWeekDateRange();
        } else if (newActiveFilter && newActiveFilter.includes('month')) {
            newDateRange = getThisMonthDateRange();
        }

        onFilterChange(newDateRange, newActiveFilter);
    };

    return (
        <div className='mb-[30px]'>
            <div className='flex items-center justify-center gap-5 whitespace-nowrap flex-nowrap py-3 md:py-[30px] border-b border-f2f2f2'>
                <button
                    onClick={() => handleFilterClick('week')}
                    className={`max-md:text-xs block border rounded-3xl cursor-pointer select-none px-3 py-2 text-[14px] font-general font-medium transition-colors ${
                        isFilterActive('week')
                            ? 'bg-383838 text-white border-383838'
                            : 'border-383838 text-383838'
                    }`}
                >
                    This Week
                </button>
                <button
                    onClick={() => handleFilterClick('month')}
                    className={`max-md:text-xs block border rounded-3xl cursor-pointer select-none px-3 py-2 text-[14px] font-general font-medium transition-colors ${
                        isFilterActive('month')
                            ? 'bg-383838 text-white border-383838'
                            : 'border-383838 text-383838'
                    }`}
                >
                    This Month
                </button>
                <button
                    onClick={() => handleFilterClick('past')}
                    className={`max-md:text-xs block border rounded-3xl cursor-pointer select-none px-3 py-2 text-[14px] font-general font-medium transition-colors ${
                        isFilterActive('past')
                            ? 'bg-383838 text-white border-383838'
                            : 'border-383838 text-383838'
                    }`}
                >
                    Past Events
                </button>
            </div>
        </div>
    );
};

export default CommunityFilter;
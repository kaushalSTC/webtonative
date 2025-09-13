import React from 'react'
import { Link } from 'react-router';

const getStatus = (startTimeDate, endTimeDate) => {
    const now = new Date();
    const start = new Date(startTimeDate);
    const end = new Date(endTimeDate);

    if (now < start) {
        return "Upcoming";
    } else if (now >= start && now <= end) {
        return "Live now";
    } else {
        return "Finished";
    }
};

const SocialEventBookingHistoryCard = ({ booking }) => {
    const eventTitle = booking?.eventId?.eventName;
    const lastBookedDate = booking?.updatedAt;
    const status = getStatus(booking?.eventId?.startTimeDate, booking?.eventId?.endTimeDate);
    const eventAddress = booking?.eventId?.eventLocation?.name;
    const eventHandle = booking?.eventId?.handle;
    console.log(eventHandle, 'eventHandle');

    // Format last booked date
    const timestamp = lastBookedDate;
    const date = new Date(timestamp);
    const day = String(date.getUTCDate()).padStart(2, "0");
    const month = String(date.getUTCMonth() + 1).padStart(2, "0"); // Months are 0-based
    const year = String(date.getUTCFullYear()); // Get last two digits of the year
    const formattedDate = `${day}-${month}-${year}`;

    // Format event date and times
    const formatEventDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        const day = String(date.getUTCDate()).padStart(2, "0");
        const month = String(date.getUTCMonth() + 1).padStart(2, "0");
        const year = String(date.getUTCFullYear());
        return `${day}-${month}-${year}`;
    };

    const eventDate = formatEventDate(booking?.eventId?.startDate);
    const eventStartTime = booking?.eventId?.startTime || '';
    const eventEndTime = booking?.eventId?.endTime || '';

    return (
        <>
            {eventHandle ? (
                <Link to={`/social-events/${eventHandle}`}>
                    <div className='w-full max-w-[400px] rounded-2xl border border-f0f0f0 py-5 px-3 hover:shadow-lg transition-shadow duration-300 ease-in-out mb-5 shadow-level-1'>
                        <div className='flex justify-between items-center'>
                            <div>
                                <p className='font-medium font-general text-base md:text-[19px] text-383838'>{eventTitle}</p>
                            </div>
                            <div className='min-w-[65px] text-center'>
                                <p className='font-general font-medium text-[10px] text-244cb4 uppercase border border-244cb4 py-[5px] px-[7px] rounded-2xl'>{status}</p>
                            </div>
                        </div>
                        <div>
                            <p className='font-medium font-general opacity-70 text-383838 text-sm'>{eventAddress}</p>
                        </div>
                        <p className='w-full bg-f0f0f0 h-[.5px] my-2'></p>

                        {/* Event Date Section */}
                        <div className='mb-3'>
                            <p className='font-medium font-general opacity-70 text-383838 text-sm'>Event Date</p>
                            <p className='font-medium font-general text-[14px] text-383838'>
                                {eventDate} (`{eventStartTime} to {eventEndTime} IST`)
                            </p>
                        </div>

                        {/* Last Booked Section */}
                        <div>
                            <p className='font-medium font-general opacity-70 text-383838 text-sm'>Last Booked</p>
                            <p className='font-medium font-general text-[14px] text-383838'>{formattedDate}</p>
                        </div>
                    </div>
                </Link>
            ) : (
                <div className='w-full max-w-[400px] rounded-2xl border border-f0f0f0 py-5 px-3 mb-5'>
                    <div className='flex justify-between items-center'>
                        <div>
                            <p className='font-medium font-general text-base md:text-[19px] text-383838'>{eventTitle}</p>
                        </div>
                        <div className='min-w-[65px] text-center'>
                            <p className='font-general font-medium text-[10px] text-244cb4 uppercase border border-244cb4 py-[5px] px-[7px] rounded-2xl'>{status}</p>
                        </div>
                    </div>
                    <div>
                        <p className='font-medium font-general opacity-70 text-383838 text-sm'>{eventAddress}</p>
                    </div>
                    <p className='w-full bg-f0f0f0 h-[.5px] my-2'></p>

                    {/* Event Date Section */}
                    <div className='mb-3'>
                        <p className='font-medium font-general opacity-70 text-383838 text-sm'>Event Date</p>
                        <p className='font-medium font-general text-[14px] text-383838'>
                            {eventDate} ({eventStartTime} to {eventEndTime})
                        </p>
                    </div>

                    {/* Last Booked Section */}
                    <div>
                        <p className='font-medium font-general opacity-70 text-383838 text-sm'>Last Booked</p>
                        <p className='font-medium font-general text-[14px] text-383838'>{formattedDate}</p>
                    </div>
                </div>
            )}
        </>
    )
}

export default SocialEventBookingHistoryCard 
import React from 'react'
import { Link } from 'react-router';
import { formatISOToCustomDate } from '../../utils/utlis';

const getStatus = (startDate, endDate) => {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (now < start) {
        return "Upcoming";
    } else if (now >= start && now <= end) {
        return "Live now";
    } else {
        return "Finished";
    }
};

const BookingHistoryCard = ({ booking }) => {
    console.log("🚀 ~ BookingHistoryCard ~ booking:", booking)
    if (!booking?.tournament || booking?.tournament?.length === 0) return null;
    const bookingTitle = booking?.tournament?.tournamentName;
    const addressName = booking?.tournament?.tournamentLocation?.address?.line1;
    const tournamentStartDate = booking?.tournament?.startDate;
    const bookingDate = booking?.tournament?.updatedAt;
    const bookedCategories = booking?.bookingItems;

    const timestamp = bookingDate;
    const date = new Date(timestamp);
    const day = String(date.getUTCDate()).padStart(2, "0");
    const month = String(date.getUTCMonth() + 1).padStart(2, "0"); // Months are 0-based
    const year = String(date.getUTCFullYear()); // Get last two digits of the year

    const formattedDate = `${day}-${month}-${year}`;
    const tournamentHandle = booking?.tournament?.handle;
    const status = getStatus(booking?.tournament?.startDate, booking?.tournament?.endDate);

    return (
        <Link to={`/tournaments/${tournamentHandle}/live`}>
            <div className='w-full max-w-[450px] rounded-2xl border border-f0f0f0 py-5 px-3 hover:shadow-lg transition-shadow duration-300 ease-in-out mb-5 shadow-level-1'>
                <div className='flex justify-between items-center'>
                    <div>
                        <p className='font-medium font-general text-base md:text-[19px] text-383838 line-clamp-1'>{bookingTitle}</p>
                        <p className='font-medium font-general opacity-70 text-383838 text-sm line-clamp-1'>{addressName}</p>
                    </div>
                    <div className='min-w-[70px] text-center'>
                        <p className='font-general font-medium text-[10px] text-244cb4 uppercase border border-244cb4 py-[5px] px-[7px] rounded-2xl'>{status}</p>
                    </div>
                </div>
                <p className='w-full bg-f0f0f0 h-[.5px] my-2'></p>
                <div>
                    <div>
                        <p className='font-medium font-general opacity-70 text-383838 text-sm'>Tournament Date</p>
                        <p className='font-medium font-general text-[14px] text-383838'>{formatISOToCustomDate(tournamentStartDate)}</p>
                    </div>
                </div>
                <p className='w-full bg-f0f0f0 h-[.5px] my-2'></p>
                <p className='font-medium font-general opacity-70 text-383838 text-sm'>Last Booked</p>
                <p className='font-medium font-general text-[14px] text-383838'>{formattedDate}</p>
                <p className='w-full bg-f0f0f0 h-[.5px] my-2'></p>
                <div>
                    <p className='font-medium font-general opacity-70 text-383838 text-sm'>Booked Categories</p>
                    {bookedCategories?.length > 0 && (
                        <p className='font-medium font-general text-383838 text-sm w-full line-clamp-1'>
                            {bookedCategories[0]?.category?.categoryName}
                            {bookedCategories.length > 1 && ` (+${bookedCategories.length - 1})`}
                        </p>
                    )}
                </div>
            </div>
        </Link>
    )
}

export default BookingHistoryCard
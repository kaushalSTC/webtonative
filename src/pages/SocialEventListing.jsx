import React, { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { useGetPublicEvents } from '../hooks/SocialEventHooks';
import SocialEventCard from '../components/SocialEventCard/SocialEventCard';
import Loader from '../components/Loader/Loader';
import PromotionalBanner from '../components/SocialEventBanner/PromotionalBanner';
import { VenueNotFound } from '../assets';
import { getCardsPerSection } from '../utils/utlis';

function SocialEventListing({ dateRange, filterType }) {
    const { 
        data, 
        isLoading, 
        isError, 
        error, 
        fetchNextPage, 
        hasNextPage, 
        isFetchingNextPage, 
        refetch 
    } = useGetPublicEvents(dateRange, filterType);

    // Filter events based on date range (only for client-side filtering if needed)
    const filterEventsByDateRange = (events, range) => {
        if (!range) return events;

        const rangeStartDate = new Date(range.startDate.split('/').reverse().join('-'));
        const rangeEndDate = new Date(range.endDate.split('/').reverse().join('-'));

        return events.filter(event => {
            const eventStartDate = new Date(event.startDate.split('/').reverse().join('-'));
            return eventStartDate >= rangeStartDate && eventStartDate <= rangeEndDate;
        });
    };

    // Extract all events from all pages
    const allEvents = data?.pages?.flatMap(page => page.data.data.events) || [];
    // For past events, we don't need additional client-side filtering since it's handled by the API
    const isPastActive = filterType && filterType.includes('past');
    const filteredEvents = isPastActive ? allEvents : filterEventsByDateRange(allEvents, dateRange);
    const totalResults = data?.pages[0]?.data?.data?.total || 0;

    // Intersection observer for infinite scroll
    const { ref, inView } = useInView({
        threshold: 0,
        rootMargin: '200px 0px',
        triggerOnce: false,
    });

    // Infinite scroll effect
    useEffect(() => {
        if (inView && hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
        }
    }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <Loader size="lg" color="loading" />
            </div>
        );
    }

    if (isError) {
        console.error('Events Error:', error);
        return (
            <div className="text-center py-10">
                <p className="text-red-500">Error loading events</p>
            </div>
        );
    }

    const getHeaderText = () => {
        const isPastActive = filterType && filterType.includes('past');
        const isWeekActive = filterType && filterType.includes('week');
        const isMonthActive = filterType && filterType.includes('month');
        
        if (isPastActive) {
            if (isWeekActive) {
                return 'Past Events - This Week';
            } else if (isMonthActive) {
                return 'Past Events - This Month';
            }
            return 'Past Community Events';
        }
        return 'Upcoming Community Events';
    };

    return (
        <>
            <div className="flex items-center justify-between mb-5">
                <p className="font-general font-medium text-sm md:text-base text-383838 md:text-1c0e0e opacity-70 md:opacity-100">
                    {getHeaderText()}
                </p>
                <p className="font-general font-medium opacity-80 text-1c0e0eb3 text-xs md:text-sm">
                    Showing {totalResults} Results
                </p>
            </div>
            
            {filteredEvents.length === 0 ? (
                <div className="max-w-[500px] mx-auto">
                    <p className="font-author font-medium text-[34px] text-383838 opacity-70 mb-2 text-center">
                        {isPastActive ? 'No community events here (yet)!' : 'Keep Swinging!'}
                    </p>
                    <p className="font-general font-medium text-[14px] text-383838 opacity-70 mb-2 text-center">
                        {isPastActive 
                            ? "Looks like the court's a little quiet right now. "
                            : 'Sometimes the bracket\'s full, sometimes it\'s waiting for you. But true competitors know the game is always on somewhere!'
                        }
                    </p>
                    <p className="font-general font-medium text-[14px] text-383838 opacity-70 mb-4 text-center">
                        {isPastActive 
                            ? 'But hey, this could be your moment to host one, or check back soon—someone might just serve up something fun'
                            : 'Try adjusting your date range to uncover community events waiting to be joined.'
                        }
                    </p>
                    <img src={VenueNotFound} alt="Venue not found" className="w-full h-[200px] object-contain" />
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
                        {(() => {
                            const cardsPerSection = getCardsPerSection();
                            const renderSections = [];
                            let eventIndex = 0;

                            // First section of cards (0 to cardsPerSection)
                            for (let i = 0; i < Math.min(cardsPerSection, filteredEvents.length); i++) {
                                const event = filteredEvents[eventIndex];
                                renderSections.push(
                                    <SocialEventCard 
                                        key={`event-${event._id}-${eventIndex}`}
                                        event={event}
                                        imageLoading={eventIndex < 3 ? "eager" : "lazy"}
                                    />
                                );
                                eventIndex++;
                            }

                            // Only show Promotional Banner if there are 6 or more events and we haven't shown all events yet
                            // Don't show promotional banner for past events
                            if (filteredEvents.length >= 6 && eventIndex < filteredEvents.length && !isPastActive) {
                                renderSections.push(
                                    <div key="promo-banner" className="col-span-full flex justify-center items-center my-6 w-full">
                                        <div className="max-w-[950px] w-full">
                                            <PromotionalBanner />
                                        </div>
                                    </div>
                                );
                            }

                            // Remaining cards
                            for (let i = eventIndex; i < filteredEvents.length; i++) {
                                const event = filteredEvents[i];
                                renderSections.push(
                                    <SocialEventCard 
                                        key={`event-${event._id}-${i}`}
                                        event={event}
                                        imageLoading="lazy"
                                    />
                                );
                            }

                            return renderSections;
                        })()}
                    </div>

                    {/* Loading indicator and observer reference */}
                    <div className="mt-8 mb-8 flex justify-center">
                        {isFetchingNextPage ? (
                            <Loader size="md" color="loading" />
                        ) : hasNextPage ? (
                            <div ref={ref} className="h-10">
                                {/* This empty div is the observer target */}
                            </div>
                        ) : filteredEvents.length > 0 ? (
                            <p className="text-gray-500 hidden">No more events to load</p>
                        ) : null}
                    </div>
                </>
            )}
        </>
    );
}

export default SocialEventListing;
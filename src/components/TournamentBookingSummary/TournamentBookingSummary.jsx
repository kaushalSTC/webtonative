import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { getDateString } from '../../utils/utlis';
import { Calendar, DownArrow, RightArrow, TournamentSuccessDesktop, TournamentSuccessMobile } from '../../assets';
import TournamentCatgoryPlayerInfo from '../TournamentBookingFlow/TournamentDraftBooking/TournamentCategoryPlayerInfo/TournamentCatgoryPlayerInfo';
import { useNavigate, Link } from 'react-router';
import { resetBooking } from '../../store/reducers/tournament-registeration-slice';

const TournamentBookingSummary = () => {
    const tournamentRegisteration = useSelector((state) => state.tournamentRegisteration);
    const player = useSelector((state) => state.player);

    const TournamentDetails = tournamentRegisteration.tournament;
    const selectedCategories = tournamentRegisteration.selectedCategories;
    const booking = tournamentRegisteration.booking;
    const navigate = useNavigate();
    const dispatch = useDispatch();
    
    useEffect(() => {
        // Cleanup function that runs when component unmounts (leaving the page)
        return () => {
            dispatch(resetBooking());
        };
    }, [dispatch]);

    return (
        <div>
            <div className='bg-f2f2f2 w-full max-w-[720px] mx-auto'>
                <div>
                    <img src={TournamentSuccessDesktop} alt="Tournament-booking-successfull" className='w-full h-auto hidden md:block '/>
                    <img src={TournamentSuccessMobile} alt="Tournament-booking-successfull" className='w-full h-auto md:hidden '/>
                </div>
                <div className='max-w-[354px] md:max-w-[536px] w-full mx-auto p-6'>
                    <p className='font-general font-medium text-sm md:text-base opacity-80 md:opacity-100 mb-5 text-1c0e0eb3 capitalize'>Registration Summary</p>
                    <div className='bg-white w-full border border-f0f0f0 rounded-[30px] shadow-[0px_13px_16px_#A7A7A729] py-[15px] md:py-[30px]'>
                        {/* Tournament Details */}
                        <p className='font-general font-medium text-383838 opacity-50 text-sm mb-[10px] md:mb-[26px] mx-[15px]'>{TournamentDetails.tournamentId}</p>
                        <div className='flex justify-between items-center mb-[35px] md:mb-[40px] mx-[15px]'>
                            <p className='font-author font-medium md:text-2xl text-xl text-383838 max-w-[50%]'> {TournamentDetails.tournamentName}</p>
                            <div className='flex items-end justify-end flex-col gap-2'>
                                <div className='flex items-center justify-end'>
                                    <img src={Calendar} alt="Calendar" className="w-[11px] h-[15px] inline-block mr-[6px] "/>
                                    <p className='font-general font-medium text-sm text-383838 opacity-70'>{getDateString(TournamentDetails?.startDate)} - {getDateString(TournamentDetails?.endDate)}</p>
                                </div>
                                <p className='font-general font-medium text-white text-[10px] bg-56b918 rounded-[15px] px-3 py-2'>Confirmed</p>
                            </div>
                        </div>
                        {/* Tournament Categories */}
                        {selectedCategories.map((category, index) => {
                            return (
                                <div key={index}>
                                    <p className='font-general font-medium text-sm md:text-base text-383838 bg-f4f5ff mb-2 pl-[15px]'>{category.categoryName}</p>
                                    {category.isDoubles ? (
                                        <div>
                                            <div>
                                                <TournamentCatgoryPlayerInfo player={player} showBorder={false} self={true}></TournamentCatgoryPlayerInfo>
                                            </div>
                                            <div className='h-0 border border-d2d2d2 mx-[15px]'></div>
                                            <div>
                                                <TournamentCatgoryPlayerInfo player={category.partnerDetails} showBorder={false}></TournamentCatgoryPlayerInfo>
                                            </div>

                                        </div>) : (
                                        <div>
                                            <TournamentCatgoryPlayerInfo player={player} showBorder={false} self={true}></TournamentCatgoryPlayerInfo>
                                        </div>)}
                                </div>
                            )
                        })}
                        {/* Payment Summary */}
                    </div>
                    <div className="">
                        <div className="flex flex-col gap-5 pt-12 pb-20">
                            <p className="text-383838 opacity-70 text-base font-general font-medium">
                                Payment Summary
                            </p>

                            {booking.totalAmount > 0 && (
                                <div className="w-full flex flex-row justify-between">
                                    <p className="text-383838 text-sm font-general font-medium opacity-80">
                                        Registration Fees
                                    </p>
                                    <p className="text-383838 text-base font-general font-medium">
                                        INR {booking.totalAmount}
                                    </p>
                                </div>
                            )}

                            {booking.gstAmount > 0 && (
                                <div className="w-full flex flex-row justify-between">
                                    <p className="text-383838 text-sm font-general font-medium opacity-80">
                                        GST
                                    </p>
                                    <p className="text-383838 text-base font-general font-medium">
                                        INR {booking.gstAmount}
                                    </p>
                                </div>
                            )}

                            {booking.discountAmount > 0 && (
                                <div className="w-full flex flex-row justify-between">
                                    <p className="text-383838 text-sm font-general font-medium opacity-80">
                                        Registration Fees
                                    </p>
                                    <p className="text-383838 text-base font-general font-medium">
                                        INR {booking.discountAmount}
                                    </p>
                                </div>
                            )}

                            {booking.finalAmount > 0 && (
                                <div className="w-full flex flex-row justify-between py-5 border-1 border-t-d2d2d2 border-b-d2d2d2 border-l-0 border-r-0">
                                    <p className="text-[#1C0E0EB3] text-base font-general font-medium opacity-80">
                                        Subtotal
                                    </p>
                                    <p className="text-[#1C0E0EB3] text-base font-general font-semibold">
                                        INR {booking.finalAmount}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                    {/* Instagram Widget */}
                    <div className='bg-white w-full border border-f0f0f0 rounded-[30px] shadow-[0px_13px_16px_#A7A7A729] mb-20 py-[25px] px-[20px]'>
                        <p className='font-general font-medium text-383838 text-sm md:text-base'>Stay Tuned</p>
                        <p className='mb-3 font-general font-medium text-383838 text-xs md:text-sm'>We will be sharing some of our best picks from the last few weeks on our social media pages. Stay tuned for more updates.</p>
                        <Link to="https://www.instagram.com/picklebayofficial">
                            <p className='font-general font-regular text-xs md:text-sm bg-8ebe01 py-3 px-[20px] text-white rounded-[21px] w-fit'>Picklebay's Instragram
                                <span> <img src={RightArrow} alt="Right Arrow" className='w-[10px] h-[10px] inline-block mr-[6px] '/></span>
                            </p>
                        </Link>
                    </div>
                    {/* Refund and Terms and Conditions */}
                    <div className='max-w-[340px] mx-auto pb-30'>
                        <div
                            className='flex items-center justify-between w-full mb-10 cursor-pointer'
                            onClick={() => navigate( '/pages/termsConditions')}
                        >
                            <p className='text-xs md:text-sm font-general font-medium text-383838'>Terms & Conditions</p>
                            <img src={DownArrow} alt="Down Arrow" className='w-[25px] h-[25px] inline-block mr-[6px] rotate-270 '/>
                        </div>
                        <div
                            className='flex items-center justify-between w-full mb-10 cursor-pointer'
                            onClick={() => navigate( '/pages/refundsCancellations')}
                        >
                            <p className='text-xs md:text-sm font-general font-medium text-383838'>Refunds & Cancellations</p>
                            <img src={DownArrow} alt="Down Arrow" className='w-[25px] h-[25px] inline-block mr-[6px] rotate-270 '/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TournamentBookingSummary
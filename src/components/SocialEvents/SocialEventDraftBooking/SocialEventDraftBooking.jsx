/* eslint-disable react/prop-types */
import { Checkbox } from '@headlessui/react';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router';
import { CalendarIcon, ChevronIcon } from '../../../assets';
import { formatDate } from '../../../utils/utlis';
import ErrorMessage from '../../ErrorMessage/ErrorMessage';
import SocialEventCheckoutBar from '../SocialEventCheckoutBar/SocialEventCheckoutBar';
import parse from 'html-react-parser';

const SocialEventDraftBooking = ({
  isCreateDraftBookingSuccess,
  isCreateDraftBookingError,
  createDraftBookingError,
}) => {
  const navigate = useNavigate();
  const socialEventRegistration = useSelector((state) => state.socialEventRegistration);


  const [isPaymentSummaryTrue, setIsPaymentSummaryTrue] = useState(false);
  const [isBookingValid, setIsBookingValid] = useState(false);
  const [termsAndConditionChecked, setTermsAndConditionChecked] = useState(false);
  const [privacyPolicyChecked, setPrivacyPolicyChecked] = useState(false);

  const { event, booking } = socialEventRegistration;

  /*
    ┌─────────────────────────────────────────────────────────────────────────────┐
    │   Navigation and Validation                                                 │
    └─────────────────────────────────────────────────────────────────────────────┘
  */
  useEffect(() => {
    if (Object.keys(socialEventRegistration).length === 0) {
      navigate('/social-events');
    }
  }, [socialEventRegistration, navigate]);

  /*
    ┌─────────────────────────────────────────────────────────────────────────────┐
    │   Booking Validation                                                        │
    └─────────────────────────────────────────────────────────────────────────────┘
  */
  useEffect(() => {
    setIsPaymentSummaryTrue(booking.eventId !== '' && booking.playerId !== '');
    setIsBookingValid(isPaymentSummaryTrue && termsAndConditionChecked && privacyPolicyChecked);
  }, [isCreateDraftBookingSuccess, booking, termsAndConditionChecked, privacyPolicyChecked, isPaymentSummaryTrue]);

  return (
    <main className="w-full mx-auto bg-f2f2f2">
      <div className="max-w-[720px] mx-auto relative">
        <div className="w-full bg-white relative">
          {/*
            ┌─────────────────────────────────────────────────────────────────────────────┐
            │           Error Message                                                     │
            └─────────────────────────────────────────────────────────────────────────────┘
          */}
          {isCreateDraftBookingError && (
            <div className="flex flex-row items-center justify-start gap-3 px-[16px] md:px-[88px] bg-f4f5ff pt-2">
              <div
                className="flex flex-row items-center justify-start gap-1 cursor-pointer"
                onClick={() => navigate(`/social-events/${event.handle}`)}
              >
                <img
                  src={ChevronIcon}
                  alt="Back Button"
                  className="rotate-180 border border-383838 rounded-full p-1 w-4 h-4"
                />
                <div className="font-general font-medium text-244cb4 text-sm underline leading-1">Back</div>
              </div>
              <ErrorMessage
                message={createDraftBookingError.message}
                className="text-right text-sm text-rose-500 font-general font-medium"
              />
            </div>
          )}

          {/*
            ┌─────────────────────────────────────────────────────────────────────────────┐
            │           Event Header                                                      │
            └─────────────────────────────────────────────────────────────────────────────┘
          */}
          <div className="flex flex-row justify-between items-center px-[30px] pt-9 pb-6 bg-gradient-to-b from-f4f5ff to-[#fcfdff] border-b border-f0f0f0">
            <div className="flex flex-col items-start gap-1.5 max-w-[50%]">
              <h1 className="font-author font-medium text-383838 text-2xl leading-none capitalize">{event.eventName}</h1>
              <p className="font-author font-medium text-383838 text-2xl capitalize">
                {event?.eventLocation?.address?.city}
              </p>
            </div>

            <div className="flex flex-col items-end gap-5">
              <div className="flex flex-row gap-2">
                <img src={CalendarIcon} alt="" className="w-[11px] h-auto" />
                <p className="text-383838 opacity-70 text-sm font-general font-medium">
                  {formatDate(event.startDate, true, 'MMM', false)}
                </p>
              </div>
            </div>
          </div>

          {/*
            ┌─────────────────────────────────────────────────────────────────────────────┐
            │           Registration Details                                              │
            └─────────────────────────────────────────────────────────────────────────────┘
          */}
          <div className="block pt-10 mb-5">
            <p className="text-383838 opacity-70 text-base px-[36px] md:px-[88px] font-general font-medium">
              Registration Details
            </p>
          </div>

          {/*
            ┌─────────────────────────────────────────────────────────────────────────────┐
            │           Event Details                                                     │
            └─────────────────────────────────────────────────────────────────────────────┘
          */}
          <div className="flex flex-col">
            <div className="flex flex-row items-center justify-between px-[36px] md:px-[88px] py-4 bg-f4f5ff">
              <div className="flex flex-col gap-1">
                <h3 className="text-383838 text-base font-general font-medium">{event.eventName}</h3>
                <p className="text-383838 opacity-70 text-sm font-general font-medium">
                  {formatDate(event.startDate, true, 'MMM', false)}
                </p>
              </div>
              <div className="flex flex-col items-end gap-1">
                <p className="text-383838 text-base font-general font-medium">INR {event.registrationFee}/-</p>
                {event.maxParticipants && (
                  <p className="text-383838 opacity-70 text-sm font-general font-medium">
                    Max Participants: {event.maxParticipants}
                  </p>
                )}
              </div>
            </div>
            <div className="flex flex-col my-7 gap-5 px-[36px] md:px-[88px] w-full">
              <div className="flex flex-col gap-2">
                <p className="text-383838 text-sm font-general font-medium">Event Description</p>
                <p className="text-383838 opacity-70 text-sm font-general font-normal">
                {parse(event.description) || 'No description available'}
                </p>
              </div>
              {event.eventlocation && (
                <div className="flex flex-col gap-2">
                  <p className="text-383838 text-sm font-general font-medium">Location</p>
                  <p className="text-383838 opacity-70 text-sm font-general font-normal">
                    {event.eventlocation.address.addressLine1}, {event.eventlocation.address.city}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/*
            ┌─────────────────────────────────────────────────────────────────────────────┐
            │           Payment Summary                                                   │
            └─────────────────────────────────────────────────────────────────────────────┘
          */}
          {isPaymentSummaryTrue && (
            <div className="pb-30 md:pb-52">
              <div className="flex flex-col gap-5 pt-12 px-[36px] md:px-[88px] pb-20">
                <p className="text-383838 opacity-70 text-base font-general font-medium">Payment Summary</p>

                <div className="w-full flex flex-row justify-between">
                  <p className="text-383838 text-sm font-general font-medium opacity-80">Registration Fee</p>
                  <p className="text-383838 text-base font-general font-medium">INR {event.registrationFee}/-</p>
                </div>

                {booking.gstAmount > 0 && (
                  <div className="w-full flex flex-row justify-between">
                    <p className="text-383838 text-sm font-general font-medium opacity-80">GST</p>
                    <p className="text-383838 text-base font-general font-medium">INR {booking.gstAmount}/-</p>
                  </div>
                )}

                {booking.discountAmount > 0 && (
                  <div className="w-full flex flex-row justify-between">
                    <p className="text-383838 text-sm font-general font-medium opacity-80">Discount</p>
                    <p className="text-383838 text-base font-general font-medium text-red-500">- INR {booking.discountAmount}/-</p>
                  </div>
                )}

                <div className="w-full flex flex-row justify-between py-5 border-1 border-t-d2d2d2 border-b-d2d2d2 border-l-0 border-r-0">
                  <p className="text-[#1C0E0EB3] text-base font-general font-medium opacity-80">Total Amount</p>
                  <p className="text-[#1C0E0EB3] text-base font-general font-semibold">
                    INR {(booking.finalAmount || event.registrationFee)}/-
                  </p>
                </div>
              </div>

              {/*
                ┌─────────────────────────────────────────────────────────────────────────────┐
                │           Terms and Privacy Policy                                          │
                └─────────────────────────────────────────────────────────────────────────────┘
              */}
              <div className="block mx-auto w-72">
                <div className="flex flex-row items-center justify-start gap-2 mb-5">
                  <Checkbox
                    checked={termsAndConditionChecked}
                    onChange={() => setTermsAndConditionChecked(!termsAndConditionChecked)}
                    className="block w-5 h-5 rounded border border-56b918 bg-transparent transition data-[checked]:bg-transparent"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      style={{
                        strokeDashoffset: termsAndConditionChecked ? '0' : '-30',
                        strokeDasharray: '30',
                        strokeLinecap: 'round',
                        strokeLinejoin: 'round',
                      }}
                      className="w-5 h-5 fill-none stroke-56b918 stroke-2 transition-[stroke-dashoffset] duration-250 ease-in-out"
                    >
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </Checkbox>
                  <p className="text-383838 font-general font-medium text-sm">
                    I agree to the
                    <Link className="ml-1 text-244cb4 font-general font-medium underline" to="/pages/termsConditions">
                      Terms and Conditions
                    </Link>
                  </p>
                </div>

                <div className="flex flex-row items-center justify-start gap-2">
                  <Checkbox
                    checked={privacyPolicyChecked}
                    onChange={() => setPrivacyPolicyChecked(!privacyPolicyChecked)}
                    className="block w-5 h-5 rounded border border-56b918 bg-transparent transition data-[checked]:bg-transparent"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      style={{
                        strokeDashoffset: privacyPolicyChecked ? '0' : '-30',
                        strokeDasharray: '30',
                        strokeLinecap: 'round',
                        strokeLinejoin: 'round',
                      }}
                      className="w-5 h-5 fill-none stroke-56b918 stroke-2 transition-[stroke-dashoffset] duration-250 ease-in-out"
                    >
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </Checkbox>
                  <p className="text-383838 font-general font-medium text-sm">
                    I agree to the
                    <Link className="ml-1 text-244cb4 font-general font-medium underline" to="/pages/privacyPolicy">
                      Privacy Policy
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          )}

          {/*
            ┌─────────────────────────────────────────────────────────────────────────────┐
            │           Checkout Bar                                                      │
            └─────────────────────────────────────────────────────────────────────────────┘
          */}
          <SocialEventCheckoutBar isBookingValid={isBookingValid} createDraftBookingError={createDraftBookingError} />
        </div>
      </div>
    </main>
  );
};

export default SocialEventDraftBooking;
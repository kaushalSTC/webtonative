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
import { useGetPlayerTournamentFormData } from '../../../hooks/PlayerHooks';
import TournamentDetailsSkillLevel from '../../Tournament/TournamentDetailsSkillLevel/TournamentDetailsSkillLevel';
import TournamentCategoryName from '../../TournamentBookingFlow/TournamentCategoryName/TournamentCategoryName';
import TournamentCatgoryPlayerInfo from '../../TournamentBookingFlow/TournamentDraftBooking/TournamentCategoryPlayerInfo/TournamentCatgoryPlayerInfo';
import PartnerDetails from '../../TournamentBookingFlow/PartnerDetails/PartnerDetails';
import SocialEventCategoryName from '../SocialEventCategoryName/SocialEventCategoryName';
import SocialEventBookingName from '../SocialEventBookingName/SocialEventBookingName';
import SocialEventsPartnerDetails from '../SocialEventsPartnerDetails/SocialEventsPartnerDetails';

// Floating Label Input Component
const FloatingLabelInput = ({
  label,
  type = "text",
  value = "",
  onChange,
  required = false,
  className = ""
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const hasValue = value && value.toString().trim() !== "";
  const shouldFloat = isFocused || hasValue;

  return (
    <div className={`relative ${className}`}>
      <input
        type={type}
        value={value}
        onChange={onChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        required={required}
        className="w-full border border-d2d2d2 px-4 pt-6 pb-2 rounded-lg transition-all duration-200 bg-white focus:border-56b918 focus:outline-none peer"
      />
      <label
        className={`absolute left-4 transition-all duration-200 pointer-events-none ${shouldFloat
          ? 'top-1 text-xs text-56b918 font-medium'
          : 'top-4 text-base text-gray-500'
          } ${required ? "after:content-['*'] after:text-red-500 after:ml-1" : ''}`}
      >
        {label}
      </label>
    </div>
  );
};

const SocialEventDraftBooking = ({
  isCreateDraftBookingSuccess,
  isCreateDraftBookingError,
  createDraftBookingError,
}) => {
  const navigate = useNavigate();
  const socialEventRegistration = useSelector((state) => state.socialEventRegistration);
  const player = useSelector((state) => state.player);

  const [isPaymentSummaryTrue, setIsPaymentSummaryTrue] = useState(false);
  const [isBookingValid, setIsBookingValid] = useState(false);
  const [termsAndConditionChecked, setTermsAndConditionChecked] = useState(false);
  const [privacyPolicyChecked, setPrivacyPolicyChecked] = useState(false);

  const { event, booking, selectedCategories, selectedSocialEvent } = socialEventRegistration;
  const [playerFormData, setPlayerFormData] = useState({});
  const isCollectPlayerData = event?.tournamentData?.collectPlayerData;
  const { data: playerTournamentFormDataResponse, isLoading: isLoadingPlayerData, error: playerDataError, refetch: refetchPlayerData } = useGetPlayerTournamentFormData(player?.id, event?.tournamentData?._id, { enabled: false });



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

  // Prefill form data when API data is loaded successfully
  useEffect(() => {
    if (playerTournamentFormDataResponse?.data?.formData && event?.tournamentData?.playerFormFields) {
      const prefilledData = {};
      const formData = playerTournamentFormDataResponse.data.formData;

      // Map API data to form fields by exact label match
      event?.tournamentData?.playerFormFields.forEach((field) => {
        if (formData[field.label]) {
          prefilledData[field.label] = formData[field.label];
        }
      });

      setPlayerFormData(prevData => ({
        ...prevData,
        ...prefilledData
      }));
    }
  }, [playerTournamentFormDataResponse, event?.tournamentData?.playerFormFields]);

  useEffect(() => {
    if (isCollectPlayerData) refetchPlayerData?.();
  }, [isCollectPlayerData, refetchPlayerData]);

  useEffect(() => {
    const isDoubleCategoriesInBooking = booking.bookingItems.filter((category) => category?.isDoubles);

    const isDoublesCategoriesFilledWithPartners = isDoubleCategoriesInBooking.every((category) => category.partnerDetails);

    setIsPaymentSummaryTrue(booking.eventId !== '' && booking.playerId !== '' && isDoublesCategoriesFilledWithPartners);

    const playerFormValid = !event?.tournamentData?.collectPlayerData ? true : event?.tournamentData?.playerFormFields.every((field) => {
      const value = playerFormData[field.label];
      if (field.isRequired && (!value || value.toString().trim() === "")) return false;
      if (field.type === "Number" && value && isNaN(Number(value))) return false;

      return true;
    });

    setIsBookingValid(isPaymentSummaryTrue && termsAndConditionChecked && privacyPolicyChecked && playerFormValid);
  }, [isCreateDraftBookingSuccess, booking, termsAndConditionChecked, privacyPolicyChecked, isPaymentSummaryTrue, playerFormData]);

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
                  {formatDate(event.startDate, true, 'MMM', false)} -{' '}
                  {formatDate(event.endDate, true, 'MMM', false)}
                </p>
              </div>
              {event?.tournamentData?.categories?.length > 0 && (
                <TournamentDetailsSkillLevel
                  categories={event?.tournamentData?.categories}
                  textClassName="font-general text-383838 opacity-70 text-xs font-medium"
                />
              )}
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
            │           Event Category Details                                            │
            └─────────────────────────────────────────────────────────────────────────────┘
          */}
          {selectedSocialEvent && (
            <div className="flex flex-col">
              <SocialEventBookingName createDraftBookingError={createDraftBookingError} eventName={event.eventName}></SocialEventBookingName>
              <div className="flex flex-col my-7 gap-5 px-[26px] md:px-[50px] w-full">
                <TournamentCatgoryPlayerInfo player={player}></TournamentCatgoryPlayerInfo>
              </div>
            </div>
          )}

          {selectedCategories.map((category, index) => {
            return (
              <div key={index} className="flex flex-col">
                <SocialEventCategoryName
                  category={category}
                  createDraftBookingError={createDraftBookingError}
                ></SocialEventCategoryName>
                <div className="flex flex-col my-7 gap-5 px-[26px] md:px-[50px] w-full">
                  <TournamentCatgoryPlayerInfo player={player}></TournamentCatgoryPlayerInfo>
                  {category.isDoubles && <SocialEventsPartnerDetails category={category}></SocialEventsPartnerDetails>}
                  {/* {category.isDoubles && <PartnerDetails category={category}></PartnerDetails>} */}
                </div>
              </div>
            );
          })}

          {/*
            ┌─────────────────────────────────────────────────────────────────────────────┐
            │           Player Additional Details Form                                    │
            └─────────────────────────────────────────────────────────────────────────────┘
          */}

          {event?.tournamentData?.collectPlayerData && event?.tournamentData?.playerFormFields?.length > 0 && (
            <div className="block pt-10 mb-1">
              <p className="text-383838 opacity-70 text-base px-[36px] md:px-[88px] font-general font-medium">
                Add Additional Information
              </p>

              {isLoadingPlayerData && (
                <div className="px-[26px] md:px-[88px] mt-6">
                  <p className="text-gray-500 text-sm">Loading player data...</p>
                </div>
              )}

              <div
                className={`grid gap-5 px-[26px] md:px-[88px] w-full mt-6`}
                style={{
                  gridTemplateColumns:
                    event?.tournamentData?.playerFormFields?.length > 3
                      ? "repeat(auto-fit, minmax(280px, 1fr))"
                      : "1fr",
                }}
              >
                {event?.tournamentData?.playerFormFields?.map((field, idx) => (
                  <FloatingLabelInput
                    key={idx}
                    label={field.label}
                    type={field.type === "Number" ? "number" : "text"}
                    value={playerFormData[field.label] || ""}
                    onChange={(e) =>
                      setPlayerFormData((prev) => ({
                        ...prev,
                        [field.label]: e.target.value,
                      }))
                    }
                    required={field.isRequired}
                  />
                ))}
              </div>
            </div>
          )}

          {/*
            ┌─────────────────────────────────────────────────────────────────────────────┐
            │           Payment Summary                                                   │
            └─────────────────────────────────────────────────────────────────────────────┘
          */}
          {isPaymentSummaryTrue && (
            <div className="pb-30 md:pb-52">
              <div className="flex flex-col gap-5 pt-12 px-[36px] md:px-[88px] pb-20">
                <p className="text-383838 opacity-70 text-base font-general font-medium">Payment Summary</p>

                {booking.totalAmount > 0 && (
                  <div className="w-full flex flex-row justify-between">
                    <p className="text-383838 text-sm font-general font-medium opacity-80">Registration Fees</p>
                    <p className="text-383838 text-base font-general font-medium">INR. {booking.totalAmount}</p>
                  </div>
                )}

                {booking.gstAmount > 0 && (
                  <div className="w-full flex flex-row justify-between">
                    <p className="text-383838 text-sm font-general font-medium opacity-80">GST</p>
                    <p className="text-383838 text-base font-general font-medium">INR. {booking.gstAmount}</p>
                  </div>
                )}

                {booking.discountAmount > 0 && (
                  <div className="w-full flex flex-row justify-between">
                    <p className="text-383838 text-sm font-general font-medium opacity-80">Registration Fees</p>
                    <p className="text-383838 text-base font-general font-medium">INR. {booking.discountAmount}</p>
                  </div>
                )}

                {booking.finalAmount > 0 && (
                  <div className="w-full flex flex-row justify-between py-5 border-1 border-t-d2d2d2 border-b-d2d2d2 border-l-0 border-r-0">
                    <p className="text-[#1C0E0EB3] text-base font-general font-medium opacity-80">Subtotal</p>
                    <p className="text-[#1C0E0EB3] text-base font-general font-semibold">INR. {booking.finalAmount}</p>
                  </div>
                )}
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
          <SocialEventCheckoutBar isBookingValid={isBookingValid} createDraftBookingError={createDraftBookingError} playerFormData={playerFormData} />
        </div>
      </div>
    </main>
  );
};

export default SocialEventDraftBooking;
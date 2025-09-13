/* eslint-disable react/prop-types */
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";
import { AnimatePresence, motion } from "motion/react";
import { Fragment, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  useSendPartnerOTPMutation,
  useVerifyAndUpdatePartnerMutation,
} from "../../../hooks/TournamentHooks";
import Button from "../../Button/Button";
import DatePicker from "../../DatePicker/DatePicker";
import ErrorMessage from "../../ErrorMessage/ErrorMessage";
import GenderPicker from "../../GenderPicker/GenderPicker";
import SplitNumberInput from "../../SplitNumberInput/SplitNumberInput";
import CountryCodeSelect from "../../CountryCodeSelect/CountryCodeSelect";

const firstLoginData = {
  page1: {
    formInputs: [
      {
        label: "Full Name",
        placeholder: "Full Name",
        type: "text",
      },
      {
        label: "Gender",
        placeholder: "Gender",
        type: "text",
      },
      {
        label: "D.O.B.",
        placeholder: "D.O.B.",
        type: "text",
      },
    ],
  },
};

const AddPartnerManually = ({ categoryId }) => {
  const {
    booking: { _id: bookingId },
    tournamentId,
  } = useSelector((state) => state.tournamentRegisteration);
  const player = useSelector((state) => state.player);
  const [name, setName] = useState("");
  const [gender, setGender] = useState("");
  const [dob, setDob] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [countryCode, setCountryCode] = useState("+91");
  const [otp, setOtp] = useState("");
  const [isFormValid, setIsFormValid] = useState(false);
  const [resendOtp, setResendOtp] = useState(false);
  const [otpView, setOtpView] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  let {
    mutate: sendPartnerOTP,
    isSuccess: isOTPSent,
    isPending: isOTPPending,
    isError: isOTPError,
    error: OTPError,
  } = useSendPartnerOTPMutation();
  const {
    mutate: verifyAndUpdatePartner,
    isSuccess: isPartnerVerificationSuccess,
    isPending: isVerificationPending,
    isError: isVerificationError,
    error: verificationError,
  } = useVerifyAndUpdatePartnerMutation();

  useEffect(() => {
    if (name && gender && dob && phoneNumber) {
      setIsFormValid(true);
    } else {
      setIsFormValid(false);
    }
  }, [name, gender, dob, phoneNumber]);

  useEffect(() => {
    if (isOTPSent) {
      setOtpView(true);
      startResendTimer();
    }
  }, [isOTPSent]);

  useEffect(() => {
    // dispatch()
  }, [isPartnerVerificationSuccess]);

  useEffect(() => {
    let interval;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prevTime) => prevTime - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  const startResendTimer = () => {
    setResendTimer(30);
  };

  const handleGender = (value) => {
    setGender(value);
  };

  const handleOTPInput = (value) => {
    setOtp(`${value}`);
  };

  const handlePhoneInput = (value) => {
    setPhoneNumber(`${value}`);
  };

  const handleCountryCodeInput = (value) => {
    setCountryCode(value);
  };

  const handleisOTPSent = () => {
    if (isFormValid) {
      sendPartnerOTP({
        playerId: player.id,
        bookingId: bookingId,
        phone: phoneNumber,
        countryCode: countryCode,
        tournamentId: tournamentId,
      });
    }
  };

  const verifyPartner = () => {
    if (isFormValid) {
      verifyAndUpdatePartner({
        playerId: player.id,
        tournamentId: tournamentId,
        otp: otp,
        bookingId: bookingId,
        categoryId: categoryId,
        name: name,
        gender: gender,
        dob: dob,
        phone: phoneNumber,
        countryCode: countryCode, 
      });
    }
  };

  const handlePhoneChange = () => {
    setPhoneNumber("");
    setOtpView(false);
    setOtp("");
  };

  const handleResendOTP = () => {
    if (resendTimer === 0) {
      setOtp("");
      sendPartnerOTP({
        playerId: player.id,
        bookingId: bookingId,
        phone: phoneNumber,
        countryCode: countryCode,
        tournamentId: tournamentId,
      });
      startResendTimer();
    }
  };
  return (
    <>
      <p className="font-general font-medium text-xs text-383838 text-center opacity-80">
        Or
      </p>
      <Disclosure
        as="div"
        className="flex flex-col items-center justify-center rounded-r-20 w-full"
      >
        {({ open }) => (
          <>
            <DisclosureButton
              className="px-2 py-1 mx-auto block text-center text-xs text-244cb4 font-general font-medium underline capitalize"
              onClick={() => (isOTPError = false)}
            >
              Add Manually
            </DisclosureButton>
            <AnimatePresence>
              {open && (
                <DisclosurePanel static as={Fragment} className="w-full">
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="origin-top flex flex-col items-center justify-center gap-3 mt-3"
                  >
                    {!otpView && (
                      <form className="flex flex-col gap-3 w-full">
                        <div className="flex flex-col sm:flex-row gap-3 w-full ">
                          <div className="w-full sm:w-1/2 inline-flex flex-row items-center justify-evenly gap-2 py-5 px-3 rounded-r-20 border border-d2d2d2 m-0">
                            <CountryCodeSelect
                              getValue={(value) => handleCountryCodeInput(value)}
                              selectedCodeColor='text-383838'
                            />
                            <div className="input-container flex flex-row items-center gap-[0px]">
                              <SplitNumberInput
                                digits={15}
                                className="w-4 h-5 mt-1 pb-1 text-center bg-transparent text-383838 text-sm font-medium font-general border-b border-b-383838 focus:outline-hidden appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                getValue={(value) => handlePhoneInput(value)}
                              />
                            </div>
                          </div>
                          <input
                            className="w-full sm:w-1/2 p-5 rounded-r-20 bg-[#ffffff] border border-d2d2d2 text-383838 text-sm placeholder:font-general placeholder:font-medium placeholder:text-sm placeholder:text-383838 placeholder:opacity-70 focus:outline-hidden appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                            placeholder={
                              firstLoginData.page1.formInputs[0].label
                            }
                            type={firstLoginData.page1.formInputs[0].type}
                            onChange={(e) => setName(e.target.value)}
                            value={name}
                          />
                        </div>
                        <div className="flex flex-row gap-3 w-full">
                          <GenderPicker
                            preFillPlayerData={false}
                            formInput={firstLoginData.page1.formInputs[1]}
                            getValue={handleGender}
                            dropDownClassName="absolute z-10 flex flex-col items-start gap-3 top-full left-0 mt-2 w-full rounded-r-20 bg-ffffff border border-d2d2d2 text-383838 focus:outline-hidden"
                            className="w-full p-5 rounded-r-20 bg-[#ffffff] border border-d2d2d2 text-383838 text-sm placeholder:font-general placeholder:font-medium placeholder:text-sm placeholder:text-383838 placeholder:opacity-70 focus:outline-hidden appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                            value={gender}
                          />
                          <DatePicker
                            preFillPlayerData={false}
                            getValue={(value) => setDob(value)}
                            type={firstLoginData.page1.formInputs[2].type}
                            placeholder={
                              firstLoginData.page1.formInputs[2].label
                            }
                            containerClassName="w-1/2"
                            className="w-full p-5 rounded-r-20 bg-[#ffffff] border border-d2d2d2 text-383838 text-sm placeholder:font-general placeholder:font-medium placeholder:text-sm placeholder:text-383838 placeholder:opacity-70 focus:outline-hidden appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                            value={dob}
                          />
                        </div>
                      </form>
                    )}

                    {otpView && (
                      <>
                        <div className="flex flex-col items-center gap-1 w-full mb-2">
                          <p className="text-383838 text-sm font-general font-medium opacity-80 leading-none">Verify your phone number:</p>
                          <p className="text-383838 text-base font-general font-medium leading-none">{phoneNumber}</p>
                          <p className="text-56b918 underline text-xs cursor-pointer font-general font-medium opacity-80 leading-none" onClick={handlePhoneChange}>Change Phone Number</p>
                        </div>
                        <form className="flex flex-col gap-3 w-full">
                          <div className="flex flex-row justify-center gap-3 w-full">
                            <div className="flex flex-row gap-2">
                              <SplitNumberInput
                                getValue={(value) => handleOTPInput(value)}
                                className="w-12 h-12 text-center rounded-r-20 bg-ffffff text-383838 text-sm font-semibold font-general border border-[#3838384D] focus:outline-hidden appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                              />
                            </div>
                          </div>
                        </form>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            disabled={resendTimer > 0}
                            onClick={handleResendOTP}
                            className={`text-56b918 ${resendTimer > 0 ? 'opacity-50' : 'underline cursor-pointer'} text-xs font-general font-medium opacity-80 leading-none`}
                            style={resendTimer > 0 ? { cursor: 'not-allowed' } : {}}
                          >
                            Resend OTP
                          </button>
                          {resendTimer > 0 && (
                            <span className="text-383838 text-xs font-general font-medium opacity-80">
                              {resendTimer}s
                            </span>
                          )}
                        </div>
                      </>
                    )}

                    {!otpView && !isOTPError && !isVerificationError && (
                      <p className="font-general font-medium text-xs text-383838 text-center">
                        An OTP will be sent to the added player
                      </p>
                    )}

                    {isOTPError && (
                      <ErrorMessage
                        message={OTPError?.message}
                        className="text-sm text-red-400 font-general font-medium mt-2 text-center"
                      ></ErrorMessage>
                    )}

                    {isVerificationError && (
                      <ErrorMessage
                        message={verificationError.message}
                        className="text-sm text-red-400 font-general font-medium mt-2 text-center"
                      ></ErrorMessage>
                    )}

                    {!otpView && (
                      <Button
                        disabled={!isFormValid}
                        onClick={handleisOTPSent}
                        isLoading={isOTPPending}
                        className={`flex justify-center px-12 py-3.5 text-center rounded-full bg-383838 text-ffffff font-general font-medium text-base active:scale-[0.97]`}
                      >
                        Send OTP
                      </Button>
                    )}

                    {otpView && (
                      <Button
                        disabled={!otp || otp.length < 4}
                        onClick={verifyPartner}
                        isLoading={isVerificationPending}
                        className={`flex justify-center px-12 py-3.5 text-center rounded-full bg-383838 text-ffffff font-general font-medium text-base active:scale-[0.97]`}
                      >
                        Verify
                      </Button>
                    )}
                  </motion.div>
                </DisclosurePanel>
              )}
            </AnimatePresence>
          </>
        )}
      </Disclosure>
    </>
  );
};

export default AddPartnerManually;
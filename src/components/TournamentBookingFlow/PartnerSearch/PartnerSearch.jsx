import { debounce } from 'lodash';
import { nanoid } from 'nanoid';
import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { DefaultProfileImage, PartnerIcon, SearchIcon } from '../../../assets';
import { useSearchPlayersQuery } from '../../../hooks/PlayerHooks';
import { useSendPartnerOTPMutation, useVerifyAndUpdatePartnerMutation } from '../../../hooks/TournamentHooks';
import useClickOutside from '../../../hooks/UseClickOutside';
import Button from '../../Button/Button';
import ErrorMessage from '../../ErrorMessage/ErrorMessage';
import SplitNumberInput from '../../SplitNumberInput/SplitNumberInput';

const PartnerSearch = ({categoryId}) => {
  const { booking: { _id: bookingId }, tournamentId } = useSelector((state) => state.tournamentRegisteration);
  const player = useSelector((state) => state.player);
  const [inputSearchQuery, setInputSearchQuery] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [partnerObject, setPartnerObject] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [otp, setOtp] = useState('');
  const [isChangingPlayer, setIsChangingPlayer] = useState(false);
  const searchRef = useRef(null);
  const [resendTimer, setResendTimer] = useState(0);
  const {mutate: sendPartnerOTP, isSuccess: isOTPSent, isPending: isOTPPending, isError: isOTPError,  error: OTPError, reset: resetOTP } = useSendPartnerOTPMutation();

  const {mutate: verifyAndUpdatePartner, isPending: isVerificationPending, isError: isVerificationError, error: verificationError, reset: resetVerification} = useVerifyAndUpdatePartnerMutation();

  const { data: searchedPlayers, isLoading: isSearching } = useSearchPlayersQuery(searchQuery);

  useClickOutside(searchRef, () => {
    setIsOpen(false);
  });

  const debouncedSearch = debounce((query) => {
    setSearchQuery(query);
  }, 300);

  const resetSelection = () => {
    setPartnerObject(null);
    setInputSearchQuery('');
    setOtp('');
    resetOTP();
    resetVerification();
    setIsChangingPlayer(true);
  };

  const handleInputChange = (e) => {
    // Only allow input changes if there's no verification error or if we're explicitly changing players
    if (!isVerificationError || isChangingPlayer) {
      const value = e.target.value;
      setInputSearchQuery(value);
      setPartnerObject(null);
      resetVerification();
      if (value.trim()) {
        debouncedSearch(value);
        setInputSearchQuery(value);
        setIsOpen(true);
      } else {
        setIsOpen(false);
      }
    }
  };

  const handleSuggestionClick = async (player) => {
    setInputSearchQuery(player.name);
    setIsOpen(false);
    setPartnerObject(player);
    resetOTP();
    resetVerification();
    setIsChangingPlayer(false);
  };

  // Start resend timer
  const startResendTimer = () => {
    setResendTimer(30);
  };

  // Handle sending OTP (with timer)
  const handleisOTPSent = () => {
    sendPartnerOTP({
      playerId: player.id,
      partnerId: partnerObject._id,
      phone: partnerObject.phone,
      bookingId: bookingId,
      tournamentId: tournamentId,
      countryCode: partnerObject?.countryCode,
    });
    startResendTimer();
  };

  // Handle resend OTP
  const handleResendOTP = () => {
    if (resendTimer === 0) {
      setOtp('');
      sendPartnerOTP({
        playerId: player.id,
        partnerId: partnerObject._id,
        phone: partnerObject.phone,
        bookingId: bookingId,
        tournamentId: tournamentId,
        countryCode: partnerObject?.countryCode,
      });
      startResendTimer();
    }
  };

  // Timer effect
  useEffect(() => {
    let interval;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prevTime) => prevTime - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  const verifyPartner = () => {
    verifyAndUpdatePartner({
      tournamentId: tournamentId,
      categoryId: categoryId,
      playerId: player.id,
      partnerId: partnerObject._id,
      name: partnerObject.name,
      gender: partnerObject.gender,
      dob: partnerObject.dob,
      phone: partnerObject.phone,
      otp: otp,
      bookingId: bookingId,
      countryCode: partnerObject?.countryCode || "+91",
    });
  };

  // Determine if the input should be readonly
  const isInputReadOnly = (isOTPSent && !isVerificationError) || (isVerificationError && !isChangingPlayer);

  return (
    <>
      <div className="flex w-full rounded-full border border-d2d2d2 p-[5px]" ref={searchRef}>
        <div className="relative flex flex-row w-full items-center justify-between gap-3">
          <div className="flex grow flex-row items-center gap-3">
            <div className="flex flex-row items-center justify-center bg-f2f2f2 rounded-full min-w-10 h-10 p-1">
              <img src={PartnerIcon} alt="Partner Icon" className="w-5 h-auto rounded-full"></img>
            </div>
            <div className="flex flex-row items-center gap-1 grow">
              <input
                className={`
                  ${isInputReadOnly ? 'bg-[#F2F2F2] border border-[#F2F2F2] text-383838' : ''}
                  w-full px-4 py-2 pl-2 text-383838 text-base font-general font-medium placeholder:text-sm placeholder:font-general placeholder:font-medium rounded-r-20 focus:border focus:border-none focus:outline-hidden
                `}
                type="text"
                value={inputSearchQuery}
                placeholder={`Search players on Picklebay...`}
                onChange={handleInputChange}
                readOnly={isInputReadOnly}
              />
              <img src={SearchIcon} alt="Search Icon" className="p-3 "/>
            </div>
          </div>

          {isOpen && !isInputReadOnly && (
            <div className="absolute w-[90%] left-1/2 -translate-x-1/2 bottom-[120%] z-[1] lg:mt-2 mb-2 lg:mb-0 bg-white border border-f0f0f0 rounded-r-20 shadow-lg max-h-64 overflow-y-auto">
              {isSearching && <p className="p-4 text-center text-383838 font-general font-medium text-sm opacity-70">Loading...</p>}
              {searchedPlayers?.length <= 0 && <p className="p-4 text-center text-383838 font-general font-medium text-sm opacity-70">No Players Found</p>}

              {searchedPlayers?.length > 0 && (
                <ul className="px-[18px]">
                  {searchedPlayers.map((player) => (
                    <li
                      key={nanoid()}
                      onClick={() => handleSuggestionClick(player)}
                      className="flex items-center gap-3 py-4 border-b border-b-f0f0f0 hover:bg-gray-100 cursor-pointer"
                    >
                      <img src={player.profilePic ? player.profilePic : DefaultProfileImage} alt="Profile Picture" className="w-10 h-10 rounded-full object-cover"></img>
                      <p className="text-383838 text-sm font-general font-medium">{player.name}</p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      </div>

      {partnerObject && !isVerificationError && (
        <div className="flex flex-col justify-center items-center gap-3 w-full">
          {isOTPSent && (
            <>
              <form className="flex flex-col gap-3 w-full">
                <div className="flex flex-row justify-center gap-3 w-full">
                  <div className="flex flex-row gap-2">
                    <SplitNumberInput
                      getValue={(value) => setOtp(`${value}`)}
                      className={`w-12 h-12 text-center rounded-r-20 bg-ffffff text-383838 text-sm font-semibold font-general border border-[#3838384D] focus:outline-hidden appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`}
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

          {!isOTPSent && (
            <p className="font-general font-medium text-xs text-383838 text-center">
              An OTP will be sent to the added player
            </p>
          )}

          {isOTPError && <ErrorMessage message={OTPError.message} className='text-sm text-red-400 font-general font-medium mt-2 text-center'></ErrorMessage>}

          {!isOTPSent && (
            <Button
              disabled={isOTPSent}
              onClick={handleisOTPSent}
              isLoading={isOTPPending}
              className={`flex justify-center px-12 py-3.5 text-center rounded-full bg-383838 text-ffffff font-general font-medium text-base active:scale-[0.97]`}
            >
              Send OTP
            </Button>
          )}

          {isOTPSent && (
            <Button
              disabled={!otp || otp.length < 4}
              onClick={verifyPartner}
              isLoading={isVerificationPending}
              className={`flex justify-center px-12 py-3.5 text-center rounded-full bg-383838 text-ffffff font-general font-medium text-base active:scale-[0.97]`}
            >
              Verify
            </Button>
          )}
        </div>
      )}

      {isVerificationError && !isChangingPlayer && (
        <div className="flex flex-col justify-center items-center gap-3 w-full">
          <ErrorMessage message={verificationError.message} className='text-sm text-red-400 font-general font-medium mt-2 text-center'></ErrorMessage>
          <Button
            onClick={resetSelection}
            className={`flex justify-center px-12 py-3.5 text-center rounded-full bg-383838 text-ffffff font-general font-medium text-base active:scale-[0.97]`}
          >
            Change Player
          </Button>
        </div>
      )}
    </>
  );
};

export default PartnerSearch;
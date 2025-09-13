import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useMediaQuery } from 'react-responsive';
import { useNavigate, useSearchParams } from 'react-router';
import Button from '../components/Button/Button';
import CountryCodeSelect from '../components/CountryCodeSelect/CountryCodeSelect';
import ErrorMessage from '../components/ErrorMessage/ErrorMessage';
import FirstTimeLogin from '../components/FirstTimeLogin/FirstTimeLogin';
import Logo from '../components/Logo/Logo';
import ResendOTPButton from '../components/ResendOTPButton/ResendOTPButton';
import SocialLogin from '../components/SocialLogin/SocialLogin';
import SplitNumberInput from '../components/SplitNumberInput/SplitNumberInput';
import { OTP_VALIDITY } from '../constants';
import { useLoginMutation, useOTPMutation, useResendOTPMutation } from '../hooks/LoginHooks';
import { setOTPRequested, setOTPRequestedDate } from '../store/reducers/auth-slice';
import { trackLogin } from '../utils/gtm';

const loginPageData = {
  title: 'Start your Pickleball journey now.',
  subTitle: 'Verify your phone number:',
  buttonText: 'Get OTP',
  enableGoogleLogin: false,
  orLoginUsing: 'Or Login Using',
  alreadyHaveAnAccount: 'Already Have an Account?',
};

const OTPPageData = {
  title: 'Start your Pickleball journey now.',
  subTitle: 'Verify your phone number:',
  enterOTPText: 'Enter OTP',
  buttonText: 'Submit',
  resendOTPText: 'Resend OTP',
};

function LoginLogo() {
  return (
    <div className="w-full flex justify-center absolute top-[calc(100vh-86.7%)] left-1/2 -translate-x-1/2 pb-16 pt-[8.333vh] md:static md:translate-none">
      <Logo className={'w-full h-auto max-w-[153px] md:max-w-80 m-0'}></Logo>
    </div>
  );
}

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get("redirect");
  const redirectionURL = !redirect ? '/' : redirect;
  const auth = useSelector((state) => state.auth);
  const player = useSelector((state) => state.player);

  /*
    ┌─────────────────────────────────────────────────────────────────────────────┐
    │   Mutations                                                                 │
    └─────────────────────────────────────────────────────────────────────────────┘
  */
  const { mutate: sendOtp, isSuccess: isOTPSent, isPending: isOTPPending, isError: isOTPError, error: OTPError, reset: resetOTPError } = useOTPMutation();
  const { mutate: login, isSuccess: isLoginSuccess, isPending: isLoginPending, isError: isLoginError, error: loginError, reset: resetLoginError } = useLoginMutation();
  const { mutate: resendOTP, isSuccess: isResendOTPSuccess, isPending: isResendOTPPending, isError: isResendOTPError, error: resendOTPError, reset: resetResendOTPError } = useResendOTPMutation();

  useEffect(() => {
    if (auth.isLoggedIn && !player.firstTimeLogin) {
      navigate(redirectionURL);
    }
  }, []);

  const isMobile = useMediaQuery({ query: '(max-width: 768px)' });

  const [uiState, setUiState] = useState(auth.isOTPRequested ? 'OTP-Sent' : auth.isLoggedIn && player.firstTimeLogin ? 'First-Login' : 'default'); // default, OTP-Sent, First-Login
  // const [uiState, setUiState] = useState('First-Login'); // default, OTP-Sent, First-Login
  const [phoneNumber, setPhoneNumber] = useState(auth.OTPRequestedPhoneNumber || '');
  const [otp, setOtp] = useState('');
  const [countryCode, setCountryCode] = useState(auth.OTPRequestedCountryCode|| '+91');
  const [clearInput, setClearInput] = useState(false);
  /*
    ┌─────────────────────────────────────────────────────────────────────────────┐
    │   Animation Variants                                                        │
    └─────────────────────────────────────────────────────────────────────────────┘
  */
  const backgroundVariants = {
    default: {
      width: isMobile ? 'calc(100vw - 0%)' : 'calc(100vw - 57.68%)',
      height: isMobile ? 'calc(100vh - 35.42%)' : 'calc(100vh - 22.55%)',
      borderRadius: '20px 20px 0 0',
      bottom: '0px',
      left: '50%',
      transform: 'translateX(-50%)',
    },
    expanded: {
      width: 'calc(100vw - 0%)',
      height: 'calc(100vh - 0%)',
      borderRadius: '0px',
      bottom: '0px',
      top: '0px',
      left: '50%',
      transform: 'translateX(-50%)',
    },
  };

  const staggerConatiner = {
    initial: {
      opacity: 0,
    },
    default: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1, // Time between each child animation
      },
    },
  };

  const staggerChildren = {
    initial: {
      opacity: 0,
      y: -5, // Starts -5px below
    },
    default: {
      opacity: 1,
      y: 0, // Moves to its final position
    },
  };

  // If the OTP is already requested, open the modal even if the page is refreshed for 2 minutes
  // Assuminmg OTP will be valid after 2 minutes
  useEffect(() => {
    if (auth.dateOTPRequested) {
      const currentTime = Date.now();                               // Current timestamp in ms
      const differenceMs = currentTime - auth.dateOTPRequested;     // Difference in milliseconds
      const differenceMinutes = differenceMs / (1000 * 60);         // Convert to minutes
      if (differenceMinutes >= OTP_VALIDITY) {
        dispatch(setOTPRequested(false));
        dispatch(setOTPRequestedDate(null));
      }
    }
  }, [auth.dateOTPRequested, dispatch]);

  useEffect(() => {
    if (isOTPSent) {
      setUiState('OTP-Sent');
    }
    if (isOTPError) {
      trackLogin('phone_otp', 'otp_failed', OTPError.message);
    }
  }, [isOTPSent, OTPError, isOTPPending, isOTPError]);

  useEffect(() => {
    if (isLoginSuccess && player.firstTimeLogin) {
      setUiState('First-Login');
    }

    if (isLoginSuccess && !player.firstTimeLogin) {
      navigate(redirectionURL);
    }

    if (isLoginError) {
      trackLogin('phone_otp', 'failed', loginError.message);
    }
  }, [isLoginSuccess, player.firstTimeLogin, navigate, isLoginError, loginError]);

  useEffect(() => {
    if (clearInput) {
      setTimeout(() => setClearInput(false), 100); // Reset state after input clears
    }
  }, [clearInput]);

  /*
    ┌─────────────────────────────────────────────────────────────────────────────┐
    │   Handlers                                                                  │
    └─────────────────────────────────────────────────────────────────────────────┘
  */
  const handlePhoneInput = (value) => {
    // setPhoneNumber(`${countryCode + value}`);
    setPhoneNumber(`${value}`);
  };

  const handleOTPInput = (value) => {
    // setPhoneNumber(`${countryCode + value}`);
    setOtp(`${value}`);
  };

  const handleCountryCodeInput = (value) => {
    setCountryCode(value);
  };

  const getOTPHandler = () => {
    const fullPhoneNumber = `${countryCode}${phoneNumber}`;
    trackLogin('phone_otp', fullPhoneNumber);
    sendOtp({ phone: phoneNumber, countryCode: countryCode });
  };

  const loginHandler = () => {
    login({ phone: phoneNumber, otp: otp, countryCode: countryCode });
  };

  const resendOTPHandler = () => {
    resendOTP({ phone: phoneNumber, countryCode: countryCode });
    resetLoginError();
    setClearInput(true)
  };

  useEffect(() => {
    if (isOTPError) {
      const timer = setTimeout(() => {
        resetOTPError();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isOTPError, resetOTPError]);

  useEffect(() => {
    if (isLoginError) {
      const timer = setTimeout(() => {
        resetLoginError();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isLoginError, resetLoginError]);

  useEffect(() => {
    if (isResendOTPError) {
      const timer = setTimeout(() => {
        resetResendOTPError();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isResendOTPError, resetResendOTPError]);

  return (
    <main className="relative w-screen h-screen overflow-hidden md:bg-login-pattern md:bg-cover md:bg-fixed md:bg-origin-border md:bg-center md:bg-no-repeat">
      {uiState === 'default' && <LoginLogo></LoginLogo>}

      <motion.div
        initial={uiState === 'default' ? 'default' : 'expanded'}
        animate={uiState === 'default' ? 'default' : 'expanded'}
        variants={backgroundVariants}
        className="absolute mx-auto bg-[radial-gradient(#244cb3,_#173175)] bg-no-repeat bg-origin-padding
          after:absolute after:top-[-40px] after:content-[''] after:block after:w-full after:h-[95px] after:opacity-50 after:bg-[#143589] after:blur-[50px]
          md:after:hidden md:after:content-[unset]
        "
      >
        <div
          className={`
            ${uiState === 'default' ? 'max-h-[calc(100vh-19.24%)]' : 'max-h-[unset]'}
            scrollbar-thin scrollbar-thumb-rounded scrollbar-track-rounded-full scrollbar-thumb-dbe0fc scrollbar-track-1c4ba3
            w-full md:max-w-[498px] mx-auto flex flex-col items-center gap-16 absolute bottom-0 left-1/2 transform -translate-x-1/2 h-full px-[15px] py-10 md:py-14 md:px-10 overflow-y-auto scrollbar-hide
          `}
        >
          {/*
            ┌─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
            │         Phone Number and OTP Screen                                                                                 │
            └─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
          */}

          <AnimatePresence>
            {uiState !== 'First-Login' && (
              <motion.div
                variants={staggerConatiner}
                initial="initial"
                animate="default"
                className={`
                  ${uiState === 'default' ? loginPageData.enableGoogleLogin ? 'justify-between' : 'justify-start' : ''}
                  ${uiState === 'default' ? 'gap-16 justify-start' : 'gap-[8.5625rem] md:gap-20 justify-evenly md:justify-center'}
                  flex flex-col gap-16 items-center h-full w-full`}
              >
                {/*
                  ┌─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
                  │           Common Header - Phone Number and OTP Screen                                                               │
                  └─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
                */}
                <div className="flex flex-col items-start md:items-center gap-3 md:max-w-[402px]">
                  <motion.h2
                    variants={staggerChildren}
                    className="text-ffffff font-author font-medium text-[34px] md:text-[40px] leading-[1] text-left md:text-center"
                  >
                    {loginPageData.title}
                  </motion.h2>
                  <motion.p
                    variants={staggerChildren}
                    className="font-general text-sm text-left md:text-center text-ffffff opacity-70"
                  >
                    {loginPageData.subTitle}
                  </motion.p>
                  {uiState === 'OTP-Sent' && (
                    <div>
                      <motion.p
                        variants={staggerChildren}
                        className="font-general text-base text-left md:text-center text-ffffff opacity-70"
                      >
                        {phoneNumber}
                      </motion.p>
                      <motion.p
                        variants={staggerChildren}
                        className="font-general text-xs text-left underline md:text-center text-abe400 cursor-pointer"
                        onClick={() => setUiState('default')}
                      >
                        Change Phone Number
                      </motion.p>
                    </div>
                  )}
                </div>

                <div className={`
                  ${uiState === 'default' ? 'gap-[30px] md:gap-6' : 'gap-[8.5625rem] md:gap-6'}
                  phone-input-get-otp-container flex flex-col items-center w-full`}>
                  {uiState === 'default' && (
                    <motion.div
                      variants={staggerChildren}
                      className="number-input flex flex-row items-center gap-3 sm:gap-5 py-4 px-5 rounded-r-20 bg-[#f8f8f81a]"
                    >
                      <div className="flex flex-row items-center gap-[2px]">
                        {/* <p className='flex items-center gap-2 p-1 rounded-lg font-general text-sm text-ffffff font-medium hover:bg-[#f8f8f81a] active:scale-[0.97] transition-transform bg-transparent'>+91</p> */}
                        <CountryCodeSelect
                          getValue={(value) => handleCountryCodeInput(value)}
                        />
                      </div>
                      <div className="rounded-xs w-[1px] h-[27px] bg-[#ffffff80]"></div>
                      <div className="input-container flex flex-row items-center gap-[0px]">
                        <SplitNumberInput
                          digits={15}
                          className="w-4 h-5 pb-1 text-center bg-transparent text-ffffff text-sm font-medium font-general border-b border-b-ffffff focus:outline-hidden appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                          getValue={(value) => handlePhoneInput(value)}
                        />
                      </div>
                    </motion.div>
                  )}

                  {/*
                    ┌─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
                    │         Submit OTP                                                                                                  │
                    └─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
                  */}
                  {uiState === 'OTP-Sent' && (
                    <div className="flex flex-col items-center gap-3">
                      <motion.p variants={staggerChildren} className="text-ffffff text-sm font-genral">
                        {OTPPageData.enterOTPText}
                      </motion.p>
                      <motion.div variants={staggerChildren} className="flex flex-row gap-2">
                        <SplitNumberInput
                          getValue={(value) => handleOTPInput(value)}
                          clearInput={clearInput}
                          className="w-12 h-12 text-center rounded-r-20 bg-[#f8f8f8] text-383838 text-sm font-semibold font-general border border-[#3838384D] focus:outline-hidden appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        />
                      </motion.div>

                      <ResendOTPButton
                        OTPValidity={Math.floor((OTP_VALIDITY * 60) - ((Date.now() - auth.dateOTPRequested) / 1000))}
                        isLoading={isResendOTPPending}
                        className="text-abe400 underline text-sm font-genral"
                        onClick={resendOTPHandler}
                        otpRequestedTime={auth.dateOTPRequested}
                        label={OTPPageData.resendOTPText}
                      />
                      {isResendOTPError && <ErrorMessage message={resendOTPError.message} staggerChildren={staggerChildren}></ErrorMessage>}
                      {isResendOTPSuccess && <ErrorMessage message="OTP Sent" staggerChildren={staggerChildren}></ErrorMessage>}
                    </div>
                  )}

                  <motion.div variants={staggerChildren} className="flex flex-col items-center gap-2">
                    <Button
                      isLoading={isOTPPending || isLoginPending}
                      onClick={uiState === 'default' ? getOTPHandler : uiState === 'OTP-Sent' ? loginHandler : null}
                      className={`${uiState === 'default'
                        ? 'bg-ffffff text-1c4ba3'
                        : uiState === 'OTP-Sent'
                          ? 'bg-abe400 text-[#1d1b20]'
                          : 'bg-ffffff text-1c4ba3'
                        }
                        flex items-center justify-center shadow-2xl px-[45.6px] py-[18px] rounded-full font-general font-medium text-base active:scale-[0.97] transition-transform
                      `}
                    >
                      {uiState === 'default'
                        ? loginPageData.buttonText
                        : uiState === 'OTP-Sent'
                          ? OTPPageData.buttonText
                          : 'Continue'}
                    </Button>
                    {isOTPError && <ErrorMessage message={OTPError.message} staggerChildren={staggerChildren}></ErrorMessage>}
                    {isLoginError && <ErrorMessage message={loginError.message} staggerChildren={staggerChildren}></ErrorMessage>}
                  </motion.div>
                </div>

                <AnimatePresence>
                  {uiState === 'default' && loginPageData.enableGoogleLogin && <SocialLogin staggerChildren={staggerChildren} loginPageData={loginPageData}></SocialLogin>}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>

          {/*
            ┌─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
            │         Get User Details on 1st Time Login                                                                          │
            └─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
          */}

          <AnimatePresence>
            {uiState === 'First-Login' && (
              <FirstTimeLogin staggerConatiner={staggerConatiner} staggerChildren={staggerChildren} redirectionURL={redirectionURL}></FirstTimeLogin>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </main>
  );
};

export default Login;

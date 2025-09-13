import ReactDOM from 'react-dom'
import { useSelector, useDispatch } from 'react-redux'
import { useEffect, useState } from 'react';
import { Popover, PopoverButton, PopoverPanel } from '@headlessui/react';
import { createErrorToast, createToast } from '../../utils/utlis';
import { useGetEmailOtp, useVerifyEmailOtp } from '../../hooks/PlayerHooks';
import SplitNumberInput from '../SplitNumberInput/SplitNumberInput';
import { DeleteIcon } from '../../assets';
import { setPlayer } from '../../store/reducers/player-slice';
import { useNavigate } from 'react-router';
import { motion } from "motion/react"
import { useLocation } from 'react-router';
import Loader from '../Loader/Loader';

const CommunityButton = ({ buttonTitle = 'Community', handleCommunityButtonClick, buttonTitleStyle, enableLoader = false }) => {
    const player = useSelector((state) => state.player);
    const navigate = useNavigate();
    const loaction = useLocation();
    const functionAfterVerfing = handleCommunityButtonClick || (() => navigate('/community'))
    const dispatch = useDispatch();
    const [isOpen, setIsOpen] = useState(false);
    const [email, setEmail] = useState('');
    const [isEmailEntered, setIsEmailEntered] = useState(false);
    const [enableOTP, setEnableOTP] = useState(false);
    const [otp, setOtp] = useState('');
    const [isLoaderVisible, setIsLoaderVisible] = useState(false);

    const {
        mutate: sendOTP,
        isSuccess: isOTPSent,
        isPending: isOTPSendPending,
        isError: isOTPSendError,
        error: otpSendError
    } = useGetEmailOtp();

    const {
        mutate: verifyOTP,
        isSuccess: isOTPVerified,
        isPending: isOTPVerifyPending,
        isError: isOTPVerifyError,
        error: otpVerifyError
    } = useVerifyEmailOtp();


    const handleCommunityClick = () => {
        if (player.email) {
            setIsLoaderVisible(true);
            functionAfterVerfing();
            setTimeout(() => { setIsLoaderVisible(false) }, 3000);
        } else {
            setIsOpen(true);
        }
    };

    const handleCloseModal = () => {
        setIsOpen(false);
        setEnableOTP(false);
        setEmail('');
        setOtp('');
    };

    // New function to handle overlay click
    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            handleCloseModal();
        }
    };

    const handleEmailSubmit = () => {
        const emailRegex = /^[^\s@]+@[^\s@]+$/;
        const enteredEmail = email.trim();
        setIsEmailEntered(true);

        if (emailRegex.test(enteredEmail)) {
            setIsLoaderVisible(true);  // Show loader
            sendOTP({
                playerID: player.id,
                emailObj: {
                    email: enteredEmail
                }
            });
        } else {
            createErrorToast('Please enter a valid email address');
        }
    };


    useEffect(() => {
        if (isOTPSendError || otpSendError) {
            createErrorToast(otpSendError?.response?.data?.message || 'Failed to send OTP. Please try again.');
            setEnableOTP(false);
        } else if (isOTPSent && isEmailEntered && !isOTPSendPending && !isOTPSendError) {
            setEnableOTP(true);
        }
    }, [isOTPSent, isEmailEntered, isOTPSendPending, isOTPSendError, otpSendError]);

    const handleOtpChange = (e) => {
        setOtp(e);
    };

    const handleOTPSubmit = () => {
        if (otp.length < 4) {
            createErrorToast('Please enter a valid OTP');
            return;
        }
        setIsLoaderVisible(true);  // Show loader
        verifyOTP({
            playerID: player.id,
            emailObj: {
                email: email,
                otp: otp
            }
        });
    };


    useEffect(() => {
        if (isOTPSendError || otpSendError || isOTPVerifyError) {
            createErrorToast(otpSendError?.response?.data?.message || 'Failed to send OTP. Please try again.');
            setIsLoaderVisible(false);  // Hide loader on error
            setEnableOTP(false);
        } else if (isOTPSent && isEmailEntered && !isOTPSendPending && !isOTPSendError) {
            setEnableOTP(true);
            setIsLoaderVisible(false);  // Hide loader after success
        }

        if (isOTPVerified) {
            createToast('OTP verified successfully');
            setIsOpen(false);
            setEnableOTP(false);
            setIsLoaderVisible(false);  // Hide loader after success

            dispatch(setPlayer({
                player: {
                    ...player,
                    email: email,
                    isEmailVerified: true
                }
            }));

            navigate('/community');
        }
    }, [isOTPSent, isEmailEntered, isOTPSendPending, isOTPSendError, otpSendError, isOTPVerified, isOTPVerifyError]);


    // Handle body overflow when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }

        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [isOpen]);

    const defaultButtonStyle = `text-sm font-general font-medium cursor-pointer ${location.pathname === '/community' ? 'text-56b918' : 'text-383838'
        }`;

    return (
        <Popover className='relative'>
            <PopoverButton
                className={buttonTitleStyle || defaultButtonStyle}
                onClick={handleCommunityClick}
            >
                {enableLoader && isLoaderVisible ? (
                    <Loader size='sm' color='loading' className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2' />
                ) : (
                    buttonTitle
                )}
            </PopoverButton>

            {isOpen && ReactDOM.createPortal(
                <motion.div
                    className="fixed w-full h-full top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-1c0e0eb3 z-[999]"
                    onClick={handleOverlayClick}
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                >
                    <div className='w-full max-w-[90%] md:max-w-[500px] mx-auto bg-white rounded-[20px] p-5 flex items-center justify-center flex-col shadow-level-2' onClick={e => e.stopPropagation()}>
                        <div className={`ml-auto cursor-pointer mb-5 ${enableOTP ? "flex justify-between w-full" : ""}`}>
                            {enableOTP && <button
                                className='text-sm py-2 px-3 rounded-xl font-medium font-general text-383838 hover:cursor-pointer hover:underline'
                                onClick={() => setEnableOTP(false)}
                                disabled={isLoaderVisible}  // Disable button while loading
                            >
                                Change Email
                            </button>}
                            <img
                                src={DeleteIcon}
                                alt="Delete Icon"
                                className='w-7 h-auto inline-block cursor-pointer ml-auto'
                                onClick={handleCloseModal}
                            />
                        </div>
                        <p className='text-[20px] text-383838 font-author font-medium text-center mb-5'>
                            Get your email verified to continue!!
                        </p>
                        <div className='w-full flex flex-col mb-5 items-end'>
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className={`w-full border border-cecece p-2 rounded-[10px] text-sm md:text-base mb-1
                                    text-383838 placeholder:text-383838 placeholder:font-general font-general font-medium 
                                    focus:outline-none ${enableOTP ? "bg-gray-100 text-gray-500 cursor-not-allowed" : "bg-white"}`}
                                value={email}
                                disabled={enableOTP}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            {enableOTP &&
                                <button
                                    className='text-sm font-medium font-general text-383838 hover:cursor-pointer underline text-right w-fit'
                                    onClick={handleEmailSubmit}
                                // Disable button while loading
                                >
                                    Re-send OTP
                                </button>}

                        </div>

                        {enableOTP && (
                            <div className='flex items-center gap-3 mb-5'>
                                <SplitNumberInput
                                    digits={4}
                                    className="w-12 h-12 text-center text-slate-900 border border-f2f2f2 rounded-md font-medium focus:border-244cb4 focus:outline-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                    getValue={handleOtpChange}
                                />
                            </div>
                        )}

                        {enableOTP ? (


                            <button
                                className='bg-abe400 text-sm py-2 px-3 rounded-xl font-medium font-general text-383838 hover:cursor-pointer hover:bg-8ebe01 flex items-center justify-center'
                                onClick={handleOTPSubmit}
                                disabled={isLoaderVisible}  // Disable button while loading
                            >
                                {isLoaderVisible ? <Loader size='sm' color='loading' /> : 'Verify OTP'}
                            </button>

                        ) : (
                            <button
                                className='bg-abe400 text-sm py-2 px-3 rounded-xl font-medium font-general text-383838 hover:cursor-pointer hover:bg-8ebe01 flex items-center justify-center'
                                onClick={handleEmailSubmit}
                                disabled={isLoaderVisible}  // Disable button while loading
                            >
                                {isLoaderVisible ? <Loader size='sm' color='loading' /> : 'Verify Email'}
                            </button>
                        )}
                    </div>
                </motion.div>,
                document.getElementById('portal-drawer')
            )}
        </Popover>
    );
};

export default CommunityButton;
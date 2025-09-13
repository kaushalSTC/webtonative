import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import Button from '../Button/Button';

// Format time as MM:SS
const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export const ResendOTPButton = ({ OTPValidity, isLoading, onClick, otpRequestedTime, className = 'text-abe400 underline text-sm font-genral', label = 'Resend OTP'}) => {
  const [timeLeft, setTimeLeft] = useState(OTPValidity);
  const [isDisabled, setIsDisabled] = useState(true);

  useEffect(() => {
    // Reset timer when new OTP is requested
    if (otpRequestedTime) {
      setTimeLeft(OTPValidity);
      setIsDisabled(true);
    }

    // Start countdown
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          setIsDisabled(false);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [otpRequestedTime]);

  const handleClick = () => {
    if (!isDisabled && !isLoading) {
      onClick();
      setTimeLeft(OTPValidity);
      setIsDisabled(true);
    }
  };

  return (
    <Button
      isLoading={isLoading}
      disabled={isDisabled || isLoading}
      className={`${className} ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      onClick={handleClick}
    >
      {isDisabled ? `Resend OTP in ${formatTime(timeLeft)}` : label}
    </Button>
  );
};

ResendOTPButton.propTypes = {
  OTPValidity: PropTypes.number,
  isLoading: PropTypes.bool,
  onClick: PropTypes.func,
  otpRequestedTime: PropTypes.number,
  className: PropTypes.string,
  label: PropTypes.string,
};

export default ResendOTPButton;

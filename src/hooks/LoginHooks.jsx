import { useMutation } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';
import { login, logout, resendOTP, updatePlayerDetails } from '../api/auth';
import { resetOTPRequested, setLogin, setLogout, setOTPRequested, setOTPRequestedDate, setOTPRequestedPhoneNumber, setOTPRequestedCountryCode } from '../store/reducers/auth-slice';
import { resetPlayer, setPlayer, updatePlayer } from '../store/reducers/player-slice';
import { resetBooking } from '../store/reducers/tournament-registeration-slice';

export const useOTPMutation = () => {
  const dispatch = useDispatch();
  return useMutation({
    mutationFn: ({phone, countryCode}) => {
      dispatch(setOTPRequestedPhoneNumber(`${phone}`));
      dispatch(setOTPRequestedCountryCode(`${countryCode}`));
      return login({phone, countryCode})
    },
    onSuccess: () => {
      dispatch(setOTPRequested(true));
      dispatch(setOTPRequestedDate(new Date().getTime()));
    },
    onError: (error) => {
      console.error(`🚀 || LoginHooks.jsx:20 || useOTPMutation || error:`, error);
      dispatch(resetOTPRequested());
    }
  })
}

export const useLoginMutation = () => {
  const dispatch = useDispatch();
  return useMutation({
    mutationFn: ({ phone, otp, countryCode }) => login({ phone, otp, countryCode }),
    onSuccess: (data) => {
      if (data.status === 'success') {
        dispatch(setLogin());
        dispatch(setPlayer(data.data));
        dispatch(resetOTPRequested());
      }
    },
    onError: (error) => {
      console.error(`🚀 || LoginHooks.jsx:38 || useLoginMutation || error:`, error);
      // dispatch(setLogin());
      dispatch(resetPlayer());
      dispatch(resetBooking());
    }
  })
}

export const usePlayerMutaion = () => {
  const dispatch = useDispatch();
  return useMutation({
    mutationFn: ({ playerID, player }) => updatePlayerDetails(playerID, player),
    onSuccess: (data) => {
      console.log("🚀 API Response Data:", data);
      dispatch(updatePlayer(data.data));
    },
    onError: (error) => {
      console.error(`🚀 || LoginHooks.jsx:54 || usePlayerMutaion || error:`, error);
    }
  })
}

export const useResendOTPMutation = () => {
  const dispatch = useDispatch();
  return useMutation({
    mutationFn: ({phone, countryCode}) => {
      dispatch(setOTPRequestedPhoneNumber(`${phone}`));
      dispatch(setOTPRequestedCountryCode(`${countryCode}`));
      return resendOTP({phone, countryCode})
    },
    onSuccess: () => {
      dispatch(setOTPRequested(true));
      dispatch(setOTPRequestedDate(new Date().getTime()));
    },
    onError: (error) => {
      dispatch(setOTPRequested(false));
      dispatch(setOTPRequestedPhoneNumber(null));
      dispatch(setOTPRequestedCountryCode(null));
      console.error("🚀 || file: LoginHooks.jsx:67 || useResendOTPMutation || error:", error);
    }
  })
}

export const useLogoutMutation = () => {
  const dispatch = useDispatch();
  return useMutation({
    mutationFn: () => logout(),
    onSuccess: () => {
      dispatch(setLogout());
      dispatch(resetPlayer());
      dispatch(resetBooking());

      // For Safari compatibility
      const communityLogoutUrl = `${import.meta.env.VITE_CIRCLE_API_URL}/users/sign_out`;

      if (/^((?!chrome|android).)*safari/i.test(navigator.userAgent)) {
        // Safari: Open community logout in new window
        const communityWindow = window.open(communityLogoutUrl, '_blank');

        // Redirect main window to login after a brief delay
        setTimeout(() => {
          if (communityWindow) {
            communityWindow.close();
          }
          window.location.href = '/login';
        }, 1000);
      } else {
        // Other browsers: Use iframe approach
        const iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        iframe.src = communityLogoutUrl;
        document.body.appendChild(iframe);

        setTimeout(() => {
          document.body.removeChild(iframe);
          window.location.href = '/login';
        }, 500);
      }
    },
    onError: (error) => {
      console.error("🚀 || file: LoginHooks.jsx:86 || useLogoutMutation || error:", error);
    }
  })
}
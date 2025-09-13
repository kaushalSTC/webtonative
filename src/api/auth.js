import axios from 'axios';
import { LOGIN_ENDPOINT, LOGOUT_ENDPOINT, PLAYER_ENDPOINT, RESEND_OTP_ENDPOINT, SEND_OTP_ENDPOINT } from '../constants';

export const login = async ({phone = null, otp = null, countryCode = null}) => {
  const BASE_URL = !otp ? SEND_OTP_ENDPOINT : LOGIN_ENDPOINT;

  if (!phone) {
    throw new Error('Phone Number is required');
  }

  phone = phone && typeof phone === 'string' ? phone : phone.toString();

  let data = { phone, countryCode };

  if (otp !== null) {
    if (otp === '') {
      throw new Error("OTP can't be empty");
    }

    if (!otp.match(/^\d{4}$/)) {
      throw new Error('OTP is invalid');
    }
    otp = typeof otp === 'string' ? otp : otp.toString();
    data.otp = otp;
  }

  let config = {
    method: 'POST',
    maxBodyLength: Infinity,
    url: BASE_URL,
    headers: {
      'Content-Type': 'application/json',
    },
    data: JSON.stringify(data),
    withCredentials: !otp ? false : true, // ✅ This enables cookies to be sent with the request
  };

  try {
    const response = await axios.request(config);
    return response.data;
  } catch (error) {
    console.error("🚀 || file: auth.js:46 || login || error:", error);
    throw error.response?.data || error;
  }
};

export const resendOTP = async ({phone = null, countryCode = '+91'}) => {
  if (!phone) {
    throw new Error('Phone Number is required');
  }

  // if (!phone.match(/(\+*)((0[ -]*)*|((91 )*))((\d{12})+|(\d{10})+)|\d{5}([- ]*)\d{6}/)) {
  //   throw new Error('Phone Number is invalid');
  // }

  phone = phone && typeof phone === 'string' ? phone : phone.toString();

  let data = { phone, countryCode };

  let config = {
    method: 'POST',
    maxBodyLength: Infinity,
    url: RESEND_OTP_ENDPOINT,
    headers: {
      'Content-Type': 'application/json',
    },
    data: JSON.stringify(data),
  };

  try {
    const response = await axios.request(config);
    return response.data;
  } catch (error) {
    console.error("🚀 || file: auth.js:78 || resendOTP || error:", error);
    throw error.response?.data || error;
  }
};

export const updatePlayerDetails = async (playerID, player) => {
  const URL = `${PLAYER_ENDPOINT}/${playerID}/update-profile`;

  let data = JSON.stringify(player);

  let config = {
    method: 'POST',
    maxBodyLength: Infinity,
    url: `${URL}`,
    headers: {
      'Content-Type': 'application/json',
    },
    data: data,
    withCredentials: true, // ✅ This enables cookies to be sent with the request
  };

  try {
    const response = await axios.request(config);
    return response.data;
  } catch (error) {
    console.error("🚀 || file: auth.js:103 || updatePlayerDetails || error:", error);
    throw error.response?.data || error;
  }
};

export const logout = async () => {
  let config = {
    method: 'POST',
    maxBodyLength: Infinity,
    url: LOGOUT_ENDPOINT,
    withCredentials: true,
  };

  try {
    const response = await axios.request(config);
    return response.data;
  } catch (error) {
    console.error("🚀 || file: auth.js:120 || logout || error:", error);
    throw error.response?.data || error;
  }
};

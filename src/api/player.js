import axios from "axios";
import { SEARCH_PLAYERS } from "../constants";

export const searchPlayers = async ({ searchQuery }) => {
  if (!searchQuery) {
    throw new Error("Search Can't be Empty");
  }

  const ENDPOINT = `${SEARCH_PLAYERS}/?search=${searchQuery}`;

  let config = {
    method: "GET",
    maxBodyLength: Infinity,
    url: ENDPOINT,
    withCredentials: true,
  };

  try {
    const response = await axios.request(config);
    return response.data.data.players;
  } catch (error) {
    console.error(`🚀 || player.js:22 || deleteCategory || error:`, error);
    throw error.response?.data || error;
  }
};

export const activitySummary = async (playerID) => {
  if (!playerID) throw new Error("Player ID not found");
  const baseURL = import.meta.env.VITE_DEV_URL;
  try {
    const response = await axios.get(`${baseURL}/api/players/${playerID}/activity`, {
      withCredentials: true,
      headers: {
        "Content-type": "application/json",
      },
    });
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

// Get Email otp
export const getEmailOtp = async ({ playerID, emailObj }) => {
  const baseURL = import.meta.env.VITE_DEV_URL;
  try {
    const response = await axios.post(`${baseURL}/api/players/${playerID}/send-otp-email`, emailObj, {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Verify email

export const verifyEmailOtp = async ({ playerID, emailObj }) => {
  const baseURL = import.meta.env.VITE_DEV_URL;
  try {
    const response = await axios.post(`${baseURL}/api/players/${playerID}/verify-otp-email`, emailObj, {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deletePlayerProfile = async (playerID) => {
  if (!playerID) throw new Error("Player ID not found");
  const baseURL = import.meta.env.VITE_DEV_URL;

  const ENDPOINT = `${baseURL}/api/players/${playerID}/delete-profile`;
  let config = {
    method: "POST",
    maxBodyLength: Infinity,
    url: ENDPOINT,
    withCredentials: true,
  };

  try {
    const response = await axios.request(config);
    return response.data;
  } catch (error) {
    console.error("🚨 Error deleting profile:", error);
    throw error.response?.data || error;
  }
};

export const getPlayerTournamentsBooking = async (playerID) => {
  if (!playerID) throw new Error("Player ID not found");
  const baseURL = import.meta.env.VITE_DEV_URL;
  const ENDPOINT = `${baseURL}/api/players/${playerID}/bookings/confirmed`;

  let config = {
    method: "GET",
    maxBodyLength: Infinity,
    url: ENDPOINT,
    withCredentials: true,
  };

  try {
    const response = await axios.request(config);
    return response.data?.data?.bookings || [];
  } catch (error) {
    console.error("🚨 Error getting tournaments booking:", error);
    throw error.response?.data || error;
  }
}

export const getUpcomingMatches = async ({ playerID, tournamentHandle }) => {
  if (!playerID) throw new Error("Player ID not found");
  const baseURL = import.meta.env.VITE_DEV_URL;
  const ENDPOINT = `${baseURL}/api/players/${playerID}/activity/tournaments/${tournamentHandle}/upcoming-matches`;

  let config = {
    method: "GET",
    maxBodyLength: Infinity,
    url: ENDPOINT,
    withCredentials: true,
  };

  try {
    const response = await axios.request(config);
    return response.data?.data;
  } catch (error) {
    console.error("🚨 Error getting tournaments booking:", error);
    throw error.response?.data || error;
  }
}

export const getPlayerEventBookings = async (playerID) => {
  if (!playerID) throw new Error("Player ID not found");
  const baseURL = import.meta.env.VITE_DEV_URL;
  const ENDPOINT = `${baseURL}/api/players/${playerID}/event-bookings/confirmed`;

  let config = {
    method: "GET",
    maxBodyLength: Infinity,
    url: ENDPOINT,
    withCredentials: true,
  };

  try {
    const response = await axios.request(config);
    return response.data?.data?.bookings || [];
  } catch (error) {
    console.error("🚨 Error getting event bookings:", error);
    throw error.response?.data || error;
  }
}

export const getPlayerActivity = async (playerId) => {
  if (!playerId) throw new Error("Player ID not found");
  const baseURL = import.meta.env.VITE_DEV_URL;
  const ENDPOINT = `${baseURL}/api/players/${playerId}/activity/games/stats`;

  let config = {
    method: "GET",
    maxBodyLength: Infinity,
    url: ENDPOINT,
    withCredentials: true,
  };

  try {
    const response = await axios.request(config);
    return response.data?.data || {};
  } catch (error) {
    console.error("🚨 Error getting player activity:", error);
    throw error.response?.data || error;
  }
}

export const getPlayerDraftGames = async (playerID) => {
  if (!playerID) throw new Error("Player ID not found");
  const baseURL = import.meta.env.VITE_DEV_URL;
  const ENDPOINT = `${baseURL}/api/players/${playerID}/games/created?scoreStatus=draft`;

  let config = {
    method: "GET",
    maxBodyLength: Infinity,
    url: ENDPOINT,
    withCredentials: true,
  };

  try {
    const response = await axios.request(config);
    return response?.data || {};
  } catch (error) {
    console.error("🚨 Error getting player draft games:", error);
    throw error.response?.data || error;
  }
}

export const getPlayerTournamentFormData = async (playerID, tournamentId) => {
  if (!playerID) throw new Error("Player ID not found");
  const baseURL = import.meta.env.VITE_DEV_URL;
  const ENDPOINT = `${baseURL}/api/players/${playerID}/form-data/${tournamentId}`;

  let config = {
    method: "GET",
    maxBodyLength: Infinity,
    url: ENDPOINT,
    withCredentials: true,
  };

  try {
    const response = await axios.request(config);
    return response?.data || {};
  } catch (error) {
    console.error("🚨 Error getting player draft games:", error);
    throw error.response?.data || error;
  }
}

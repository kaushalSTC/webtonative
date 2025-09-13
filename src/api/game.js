import axios from "axios";
import { GET_GAMES_ENDPOINT, PLAYER_ENDPOINT } from "../constants";

// Create new game 
export const createGame = async (userID, gameObj) => {
  const baseURL = import.meta.env.VITE_DEV_URL;
  try {
    const response = await axios.post(`${baseURL}/api/players/${userID}/games`, gameObj, {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error(error, "error");
    throw error;
  }
};

// Get game by handle
export const fetchGameByHandle = async (handle) => {
  const baseURL = import.meta.env.VITE_DEV_URL;
  try {
    const response = await axios.get(`${baseURL}/api/public/games/${handle}`, {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// Invite player to game
export const invitePlayerToGame = async (userID, gameHandle, inviteObj) => {
  const baseURL = import.meta.env.VITE_DEV_URL;
  try {
    const response = await axios.post(`${baseURL}/api/players/${userID}/games/${gameHandle}/invite`, inviteObj, {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// Change the visibility of game
export const changeGameVisibility = async ({ userID, handle, visibilityObj }) => {
  console.log("🚀 ~ changeGameVisibility ~ visibilityObj:", visibilityObj);
  const baseURL = import.meta.env.VITE_DEV_URL;
  try {
    const response = await axios.post(`${baseURL}/api/players/${userID}/games/${handle}/visibility`, visibilityObj, {
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

// Join Game
export const joinGame = async ({ userID, handle, joinObj }) => {
  const baseURL = import.meta.env.VITE_DEV_URL;
  try {
    const response = await axios.post(`${baseURL}/api/players/${userID}/games/${handle}/join`, joinObj, {
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

// Leave Game
export const leaveGame = async ({ userID, handle }) => {
  const baseURL = import.meta.env.VITE_DEV_URL;
  try {
    const response = await axios.post(
      `${baseURL}/api/players/${userID}/games/${handle}/leave`,
      {},
      {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Update game details
export const updateGame = async ({ userID, handle, gameObj }) => {
  // Delete is_location_exact from gameObj
  delete gameObj?.gameLocation?.address?.location?.is_location_exact;
  const baseURL = import.meta.env.VITE_DEV_URL;
  try {
    const response = await axios.post(`${baseURL}/api/players/${userID}/games/${handle}/update-details`, gameObj, {
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

// Get All Player Invites
export const getPlayerGameInvites = async (playerId) => {
  const ENDPOINT = `${PLAYER_ENDPOINT}/${playerId}/games/invites`;

  let config = {
    method: "GET",
    maxBodyLength: Infinity,
    url: ENDPOINT,
    withCredentials: true,
    headers: {
      "Content-Type": "application/json",
    },
  };

  try {
    const response = await axios.request(config);
    return response.data.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Get All Created Games By Player
export const getCreatedGames = async (playerId) => {
  const ENDPOINT = `${PLAYER_ENDPOINT}/${playerId}/games/created`;

  let config = {
    method: "GET",
    maxBodyLength: Infinity,
    url: ENDPOINT,
    withCredentials: true,
    headers: {
      "Content-Type": "application/json",
    },
  };

  try {
    const response = await axios.request(config);
    return response.data.data.games;
  } catch (error) {
    console.error(error, "error");
    throw error;
  }
};

// Get All Games Joined By Player
export const getJoinedGames = async (playerId, currentDate) => {
  const ENDPOINT = `${PLAYER_ENDPOINT}/${playerId}/games?dateRange[startDate]=${currentDate}&sort=date`;

  let config = {
    method: "GET",
    maxBodyLength: Infinity,
    url: ENDPOINT,
    withCredentials: true,
    headers: {
      "Content-Type": "application/json",
    },
  };

  try {
    const response = await axios.request(config);
    return response.data.data.games;
  } catch (error) {
    console.error(error, "error");
    throw error;
  }
};

// Get All Games sorted on the basis Location
export const getGameByLocation = async ({ lat, lng, page = 1, limit = 5 }) => {
  const baseURL = import.meta.env.VITE_DEV_URL;
  try {
    const response = await axios.get(`${baseURL}/api/public/games?lat=${lat}&lng=${lng}&page=${page}&limit=${limit}`);
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

// Get All Games of a Venue
export const getGamesByVenue = async (handle) => {
  const baseURL = import.meta.env.VITE_DEV_URL;
  try {
    const response = await axios.get(`${baseURL}/api/public/games?venueHandle=${handle}`);
    return response.data.data.games;
  } catch (error) {
    throw error;
  }
};

//Remove player from game
export const removePlayer = async ({ userID, handle, removePlayerObj }) => {
  const baseURL = import.meta.env.VITE_DEV_URL;
  try {
    const response = await axios.post(`${baseURL}/api/players/${userID}/games/${handle}/remove-player`, removePlayerObj, {
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

// Get games for homepage
export const getGamesHomepage = async ({ lat, lng }) => {
  const baseURL = import.meta.env.VITE_DEV_URL;
  try {
    const response = await axios.get(`${baseURL}/api/public/games?lat=${lat}&lng=${lng}`);
    return response.data.data.games;
  } catch (error) {
    throw error;
  }
};

// Crate game post for community 
export const createGamePost = async ({ playerID, gameHandle, gameLinkObj }) => {
  const baseURL = import.meta.env.VITE_DEV_URL;
  try {
    const response = await axios.post(`${baseURL}/api/players/${playerID}/games/${gameHandle}/post`, gameLinkObj, {
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

// Change Game Status
export const changeGameStatus = async ({playerID, gameHandle, gameObj }) => {
  const baseURL = import.meta.env.VITE_DEV_URL;
  try {
    const response = await axios.post(`${baseURL}/api/players/${playerID}/games/${gameHandle}/status`, gameObj, {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data
  } catch (error) {
    throw error;
  }
}

// Get deleted games
export const getDeletedGames = async (playerId) => {
  const ENDPOINT = `${PLAYER_ENDPOINT}/${playerId}/games/cancelled`;

  let config = {
    method: "GET",
    maxBodyLength: Infinity,
    url: ENDPOINT,
    withCredentials: true,
    headers: {
      "Content-Type": "application/json",
    },
  };

  try {
    const response = await axios.request(config);
    return response.data.data.games;
  } catch (error) {
    console.error(error, "error");
    throw error;
  }
};

export const acceptGameInvite = async (playerID, gameHandle, acceptObj) => {
  const baseURL = import.meta.env.VITE_DEV_URL;
  try {
    const response = await axios.post(`${baseURL}/api/players/${playerID}/games/${gameHandle}/respond`, acceptObj, {
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

export const rejectGameInvite = async (playerID, gameHandle, rejectObj) => {
  const baseURL = import.meta.env.VITE_DEV_URL;
  try {
    const response = await axios.post(`${baseURL}/api/players/${playerID}/games/${gameHandle}/respond`, rejectObj, {
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

export const getGameById = async (playerId, handle) => {
  const baseURL = import.meta.env.VITE_DEV_URL;
  try {
    const response = await axios.get(`${baseURL}/api/players/${playerId}/games/${handle}/matches`, {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response?.data?.data;
  } catch (error) {
    throw error;
  }
};

export const publishGameScore = async ({playerId, gameHandle, scoreObj}) => {
  const baseURL = import.meta.env.VITE_DEV_URL;
  try {
    const response = await axios.post(`${baseURL}/api/players/${playerId}/games/${gameHandle}/publish`, scoreObj, {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}

export const getPendingGameVerification = async ({playerID}) => {
  const baseURL = import.meta.env.VITE_DEV_URL;
  try {
    const response = await axios.get(`${baseURL}/api/players/${playerID}/games/verifications/pending`, {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data.data;
  } catch (error) {
    throw error;
  }
}

export const acceptGameScore = async ({playerID, gameHandle, acceptObj}) => {
  const baseURL = import.meta.env.VITE_DEV_URL;
  try {
    const response = await axios.post(`${baseURL}/api/players/${playerID}/games/${gameHandle}/verify`, acceptObj, {
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

export const rejectGameScore = async ({playerID, gameHandle, rejectObj}) => {
  const baseURL = import.meta.env.VITE_DEV_URL;
  try {
    const response = await axios.post(`${baseURL}/api/players/${playerID}/games/${gameHandle}/verify`, rejectObj, {
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


// Filters to be added with this api
export const getAllPlayingActivity = async (playerID, filter = 'game') => {
  const baseURL = import.meta.env.VITE_DEV_URL;
  try {
    const response = await axios.get(`${baseURL}/api/players/${playerID}/activity/games/played?format=${filter}`, {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

export const updateGameScore = async ({ playerId, gameHandle, scoreObj }) => {
  const baseURL = import.meta.env.VITE_DEV_URL;
  try {
    const response = await axios.post(`${baseURL}/api/players/${playerId}/games/${gameHandle}/score`, scoreObj, {
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

export const addPlayerInGame = async ({ playerId, gameHandle, playerObj }) => {
  const baseURL = import.meta.env.VITE_DEV_URL;
  try {
    const response = await axios.post(`${baseURL}/api/players/${playerId}/games/${gameHandle}/players`, playerObj, {
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

export const resendScoreVerification  = async ({playerId, gameHandle}) => {
  const baseURL = import.meta.env.VITE_DEV_URL;
  try {
    const response = await axios.post(`${baseURL}/api/players/${playerId}/games/${gameHandle}/resend-verification`, {}, {
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
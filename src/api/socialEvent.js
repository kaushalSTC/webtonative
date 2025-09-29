import axios from 'axios'
import { PLAYER_ENDPOINT } from '../constants';

/* 
  ┌─────────────────────────────────────────────────────────────────────────┐
  │ // Get Public Events                                                    │
  └─────────────────────────────────────────────────────────────────────────┘
 */

export const getPublicEvents = async ({ pageParam = 1, limit = 17, dateRange, filterType }) => {
    const baseURL = import.meta.env.VITE_DEV_URL;
    const params = {
        page: pageParam,
        limit: limit
    };

    if (dateRange) {
        // Format dates in DD/MM/YYYY format for the API
        params['dateRange[startDate]'] = dateRange.startDate;
        params['dateRange[endDate]'] = dateRange.endDate;
    }

    if (filterType && filterType.includes('past')) {
        params.status = 'completed';
    }

    const response = await axios.get(`${baseURL}/api/public/events`, {
        params
    });

    if (response.status !== 200) {
        throw new Error("Failed to fetch events");
    }
    return response;
}

/*
  ┌─────────────────────────────────────────────────────────────────────────┐
  │ Get Event by Handle                                                     │
  └─────────────────────────────────────────────────────────────────────────┘
*/
export const eventByHandle = async ({ handle }) => {
  if (!handle) {
    throw new Error('Event handle is required');
  }

  const baseURL = import.meta.env.VITE_DEV_URL;
  const ENDPOINT = `${baseURL}/api/public/events/${handle}`;

  try {
    const response = await axios.get(ENDPOINT);
    if (response.status !== 200) {
      throw new Error('Failed to fetch event');
    }
    return response.data.data;
  } catch (error) {
    console.error('🚀 || file: socialEvent.js || eventByHandle || error:', error);
    throw error.response?.data || error;
  }
};

/*
  ┌─────────────────────────────────────────────────────────────────────────┐
  │ Get Event by ID                                                         │
  └─────────────────────────────────────────────────────────────────────────┘
*/
export const eventById = async ({ eventId }) => {
  if (!eventId) {
    throw new Error('Event ID is required');
  }

  const baseURL = import.meta.env.VITE_DEV_URL;
  const ENDPOINT = `${baseURL}/api/public/events/id/${eventId}`;

  try {
    const response = await axios.get(ENDPOINT);
    if (response.status !== 200) {
      throw new Error('Failed to fetch event');
    }
    return response.data.data;
  } catch (error) {
    console.error('🚀 || file: socialEvent.js || eventById || error:', error);
    throw error.response?.data || error;
  }
};

/*
  ┌─────────────────────────────────────────────────────────────────────────┐
  │ Create Draft Booking for Social Event                                    │
  └─────────────────────────────────────────────────────────────────────────┘
*/
export const createEventDraftBooking = async ({ playerId, payload }) => {
  if (!playerId || !payload) {
    throw new Error('Player ID and Event ID are required');
  }

  const ENDPOINT = `${PLAYER_ENDPOINT}/${playerId}/event-bookings`;

  let config = {
    method: 'POST',
    maxBodyLength: Infinity,
    url: ENDPOINT,
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json'
    },
    data: payload,
  };

  try {
    const response = await axios.request(config);
    return response.data.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};


/* 
  ┌─────────────────────────────────────────────────────────────────────────┐
  │ Delete social event boooking                                            │
  └─────────────────────────────────────────────────────────────────────────┘
 */

export const deleteSocialEventBooking = async ({ playerId, bookingId, payload }) => {
  if (!playerId || !bookingId || !payload) {
    throw new Error('Player ID, Booking ID and payload are required');
  }

  const ENDPOINT = `${PLAYER_ENDPOINT}/${playerId}/event-bookings/${bookingId}/delete`;

  const config = {
    method: 'POST',
    maxBodyLength: Infinity,
    url: ENDPOINT,
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json'
    },
    data: payload,
  };

  try {
    const response = await axios.request(config);
    return response.data.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};


/*
  ┌─────────────────────────────────────────────────────────────────────────┐
  │ Create Draft Checkout for Social Event                                   │
  └─────────────────────────────────────────────────────────────────────────┘
*/
export const createEventDraftCheckout = async ({ 
  playerId, 
  bookingId, 
  eventId,
  totalAmount,
  discountAmount = 0,
  amountAfterDiscount,
  gstAmount,
  finalAmount ,
  bookingItems
}) => {
  if (!playerId) {
    throw new Error('Player Not Logged In');
  }

  if (!bookingId) {
    throw new Error('Booking Not Created');
  }

  if (!eventId) {
    throw new Error('Event Not Found');
  }

  const ENDPOINT = `${PLAYER_ENDPOINT}/${playerId}/event-bookings/${bookingId}/checkout`;

  let data = {
    eventId,
    totalAmount,
    discountAmount,
    amountAfterDiscount,
    gstAmount,
    finalAmount,
    bookingItems
  };

  let config = {
    method: 'POST',
    maxBodyLength: Infinity,
    url: ENDPOINT,
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json'
    },
    data: JSON.stringify(data)
  };

  try {
    const response = await axios.request(config);
    return response.data.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/*
  ┌─────────────────────────────────────────────────────────────────────────┐
  │ Create Order for Payment                                                 │
  └─────────────────────────────────────────────────────────────────────────┘
*/
export const createOrderForPayment = async ({ playerId, bookingId, amount }) => {
  if (!playerId) {
    throw new Error('Player Not Logged In');
  }

  if (!bookingId) {
    throw new Error('Booking Not Created');
  }

  const ENDPOINT = `${PLAYER_ENDPOINT}/${playerId}/event-bookings/${bookingId}/pay-now`;

  let data = {
    amount
  };

  let config = {
    method: 'POST',
    maxBodyLength: Infinity,
    url: ENDPOINT,
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json'
    },
    data: JSON.stringify(data)
  };

  try {
    const response = await axios.request(config);
    return response.data.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/*
  ┌─────────────────────────────────────────────────────────────────────────┐
  │ Verify Payment                                                           │
  └─────────────────────────────────────────────────────────────────────────┘
*/
export const verifyPayment = async ({ playerId, bookingId, paymentDetails }) => {
  if (!playerId || !bookingId || !paymentDetails) {
    throw new Error('Missing required payment verification data');
  }

  const ENDPOINT = `${PLAYER_ENDPOINT}/${playerId}/event-bookings/${bookingId}/payment-verification`;

  let config = {
    method: 'POST',
    maxBodyLength: Infinity,
    url: ENDPOINT,
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json'
    },
    data: JSON.stringify(paymentDetails)
  };

  try {
    const response = await axios.request(config);
    return response.data.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Trending Community Events
export const getTrendingCommunityEvents = async () => {
  const baseURL = import.meta.env.VITE_DEV_URL;
  const response = await axios.get(`${baseURL}/api/public/social-events?section=featuredSocialEvents`);
  if (response.status !== 200) {
    throw new Error('Failed to fetch trending community events');
  }
  return response.data.data?.[0] || {};
};

// Post event join link for social event (community)
export const createEventPost = async ({ playerID, eventHandle, eventLinkObj }) => {
  const baseURL = import.meta.env.VITE_DEV_URL;
  try {
    const response = await axios.post(
      `${baseURL}/api/players/${playerID}/events/${eventHandle}/post`,
      eventLinkObj,
      {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};


export const socialEventSendPartnerOTP = async ({ playerId, phone, bookingId, partnerId, tournamentId, countryCode }) => {
  if (!playerId) {
    throw new Error('Player Not Logged In');
  }

  if (!bookingId) {
    throw new Error('Booking Not Created');
  }

  let data = {}
  if (phone) {
    data.phone = phone;
  }
  if (partnerId) {
    data.playerId = partnerId; // Partner ID
  }
  if (tournamentId) {
    data.tournamentId = tournamentId;
  }
  if (countryCode) {
    data.countryCode = countryCode;
  }
  const ENDPOINT = `${PLAYER_ENDPOINT}/${playerId}/bookings/${bookingId}/send-partner-otp`;

  let config = {
    method: 'POST',
    maxBodyLength: Infinity,
    url: ENDPOINT,
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json',
    },
    data: JSON.stringify(data),
  };

  try {
    const response = await axios.request(config);
    return response.data.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const SocialEventVerifyAndUpdatePartner = async ({ tournamentId, categoryId, playerId, partnerId, name, gender, dob, phone, otp, bookingId, countryCode }) => {
  if (!tournamentId) {
    throw new Error('Tournament Not Found');
  }
  if (!categoryId) {
    throw new Error('Category Not Found');
  }
  if (!bookingId) {
    throw new Error('Booking Not Created');
  }

  const ENDPOINT = `${PLAYER_ENDPOINT}/${playerId}/bookings/${bookingId}/verify-update-partner`;
  let data = {partnerDetails: {}}

  if (tournamentId) {
    data.tournamentId = tournamentId;
  }

  if (categoryId) {
    data.categoryId = categoryId;
  }

  if (partnerId) {
    data.partnerDetails.playerId = partnerId;
  }

  if (name) {
    data.partnerDetails.name = name;
  }

  if (gender) {
    data.partnerDetails.gender = gender;
  }

  if (dob) {
    data.partnerDetails.dob = dob;
  }

  if (phone) {
    data.partnerDetails.phone = phone;
  }

  if (otp) {
    data.partnerDetails.otp = otp;
  }

  if (countryCode) {
    data.partnerDetails.countryCode = countryCode;
  }

  let config = {
    method: 'POST',
    maxBodyLength: Infinity,
    url: ENDPOINT,
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json',
    },
    data: JSON.stringify(data),
  };

  try {
    const response = await axios.request(config);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};
import axios from 'axios';
import { PLAYER_ENDPOINT, TOURNAMENT_DETAILS_ENDPOINT, TOURNAMENT_LISTING_ENDPOINT } from '../constants';

/*
  ┌─────────────────────────────────────────────────────────────────────────┐
  │ All Tournament Listing API with filters                                 │
  └─────────────────────────────────────────────────────────────────────────┘
 */

export const tournamentListing = async ({ pageParam = 1, limit, filters }) => {
  const params = {
    page: pageParam,
    limit,
  };

  if (filters.skillLevel && filters.skillLevel.length > 0) {
    params.skillLevel = filters.skillLevel.join(',');
  }

  if (filters.dateRange) {
    params['dateRange[startDate]'] = filters.dateRange.startDate;
    params['dateRange[endDate]'] = filters.dateRange.endDate;
  }

  if (filters.status) {
    params.status = filters.status;
  }

  try {
    const response = await axios.get(TOURNAMENT_LISTING_ENDPOINT, {
      params,
    });

    console.log('API Raw Response:', response); // Debug log

    if (response.status !== 200) {
      throw new Error('Failed to fetch tournaments');
    }

    return response;
  } catch (error) {
    console.error('Tournament API Error:', error);
    throw error;
  }
};

/*
  ┌─────────────────────────────────────────────────────────────────────────┐
  │ Weekly Tournaments API                                                  │
  └─────────────────────────────────────────────────────────────────────────┘
 */

export const fetchWeeklyTournaments = async ({ startDate, endDate }) => {
  const response = await axios.get(TOURNAMENT_LISTING_ENDPOINT, {
    params: {
      page: 1,
      limit: 17,
      'dateRange[startDate]': startDate,
      'dateRange[endDate]': endDate,
    },
  });

  if (response.status !== 200) {
    throw new Error('Failed to fetch weekly tournaments');
  }

  return response;
};

/*
  ┌─────────────────────────────────────────────────────────────────────────┐
  │ Get Tournaments by Handle                                               │
  └─────────────────────────────────────────────────────────────────────────┘
*/
export const tournamentByHandle = async ({ handle }) => {
  if (!handle) {
    throw new Error('Tournament handle is required');
  }

  const ENDPOINT = `${TOURNAMENT_DETAILS_ENDPOINT}/${handle}`;

  let config = {
    method: 'GET',
    maxBodyLength: Infinity,
    url: ENDPOINT,
  };

  try {
    const response = await axios.request(config);
    return response.data.data;
  } catch (error) {
    console.error('🚀 || file: tournament.js:18 || tournamentByHandle || error:', error);
    throw error.response?.data || error;
  }
};

export const createDraftBooking = async ({ playerId, tournamentId, categoryIds, selectedCategories, discountCode }) => {
  if (!tournamentId) {
    throw new Error('Tournament Handle Not Found');
  }

  if (!categoryIds) {
    throw new Error('Category Not Selected');
  }

  if (!playerId) {
    throw new Error('Player Not Logged In');
  }

  const ENDPOINT = `${PLAYER_ENDPOINT}/${playerId}/bookings`;

  let data = {
    tournamentId: `${tournamentId}`,
    bookingItems: categoryIds.map((categoryId) => {
      const categoryObj = selectedCategories?.find((c) => c._id === categoryId);
      let bookingItem = { categoryId };

      if(categoryObj?.selectedGender) {
        bookingItem.registrationCategory  = categoryObj.selectedGender;
      }
      return bookingItem;
    })
  };

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
    console.error(`🚀 || tournament.js:68 || createDraftBooking || error:`, error);
    throw error.response?.data || error;
  }
};

export const sendPartnerOTP = async ({ playerId, phone, bookingId, partnerId, tournamentId, countryCode }) => {
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
    console.error(`🚀 || tournament.js:99 || sendPartnerOTP || error:`, error);
    throw error.response?.data || error;
  }
};

export const verifyAndUpdatePartner = async ({ tournamentId, categoryId, playerId, partnerId, name, gender, dob, phone, otp, bookingId, countryCode }) => {
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
    console.error(`🚀 || tournament.js:99 || sendPartnerOTP || error:`, error);
    throw error.response?.data || error;
  }
};

export const deleteCategory = async ({ playerId, bookingId, categoryId }) => {
  if (!playerId) {
    throw new Error('Player Not Logged In');
  }

  if (!bookingId) {
    throw new Error('Booking Not Found');
  }

  if (!categoryId) {
    throw new Error('Category Not Found');
  }

  const ENDPOINT = `${PLAYER_ENDPOINT}/${playerId}/bookings/${bookingId}/delete-item`;
  const data = {
    categoryId: categoryId
  }

  let config = {
    method: 'POST',
    maxBodyLength: Infinity,
    url: ENDPOINT,
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json',
    },
    data : JSON.stringify(data)
  };

  try {
    const response = await axios.request(config);
    return response.data.data;
  } catch (error) {
    console.error(`🚀 || tournament.js:223 || deleteCategory || error:`, error);
    throw error.response?.data || error;
  }
};

export const createDraftCheckout = async ({ playerId, bookingId, tournamentId, bookingItems, discountCode = 0, totalAmount, discountAmount = 0, finalAmount, amountAfterDiscount, gstAmount }) => {
  if (!playerId) {
    throw new Error('Player Not Logged In');
  }

  if (!bookingId) {
    throw new Error('Booking Not Created');
  }

  if (!tournamentId) {
    throw new Error('Tournament Not Found');
  }

  const ENDPOINT = `${PLAYER_ENDPOINT}/${playerId}/bookings/${bookingId}/checkout`;

  let cleanedBookingItems = bookingItems.map(bookingItem => {
    if (!bookingItem.isDoubles) {
      return {
        categoryId: bookingItem.categoryId,
        amount: bookingItem.amount
      }
    }

    return {
      categoryId: bookingItem.categoryId,
      amount: bookingItem.amount,
      partnerDetails: {
        playerId: bookingItem.partnerDetails.playerId,
      }
    };
  });

  let data = {
    tournamentId: tournamentId,
    bookingItems: cleanedBookingItems,
    totalAmount: totalAmount,
    finalAmount: finalAmount,
    discountAmount: discountAmount,
    amountAfterDiscount: amountAfterDiscount,
    gstAmount: gstAmount,
  };

  if(discountCode) {
    data.discountCode = discountCode;
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
    return response.data.data;
  } catch (error) {
    console.error(`🚀 || tournament.js:99 || sendPartnerOTP || error:`, error);
    throw error.response?.data || error;
  }
}

export const createOrderForPayment = async ({ amount, playerId, bookingId }) => {
  if (!amount) {
    throw new Error('Amount Not Provided');
  }

  const ENDPOINT = `${PLAYER_ENDPOINT}/${playerId}/bookings/${bookingId}/pay-now`;

  let data = {
    amount: amount,
    currency: 'INR',
    receipt: `receipt#${playerId.substring(0,12)}${bookingId.substring(0,12)}`,
    notes: {},
  };

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
    console.error(`🚀 || tournament.js:223 || deleteCategory || error:`, error);
    throw error.response?.data || error;
  }
}

export const getTournamentScore = async ({playerId, fixtureId, tournamentHandle}) => {
  const baseURL = import.meta.env.VITE_DEV_URL;
  try {
    const response = await axios.get(`${baseURL}/api/players/${playerId}/activity/games/tournament/${tournamentHandle}/fixture/${fixtureId}`, {
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
      }
    });
    return response.data?.data;
  }
  catch (error) {
    console.error(error);
    throw error;
  }
}
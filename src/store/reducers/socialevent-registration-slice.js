// socialeventregistration-slice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  uiState: 'default',
  eventId: '',
  selectedEvent: null,
  discountCode: '',
  event: {
    eventName: '',
    description: '',
    startDate: '',
    endDate: '',
    startTime: '',
    endTime: '',
    bookingStartDate: '',
    bookingEndDate: '',
    eventLocation: {
      address: {
        line1: '',
        line2: '',
        city: '',
        state: '',
        country: '',
        zipCode: '',
      },
    },
  },
  booking: {
    bookingItem: null,
    playerId: '',
    eventId: '',
    _id: '',
    totalAmount: 0,
    amountAfterDiscount: 0,
    gstAmount: 0,
    finalAmount: 0,
    discountAmount: 0
  },
  checkout: {},
  order: {},
  paymentSuccess: false,
};

const socialEventRegistrationSlice = createSlice({
  name: 'socialEventRegistration',
  initialState,
  reducers: {
    setEvent: (state, action) => {
      if (!action.payload || !action.payload._id) return;

      if (state.event._id === '' || state.event._id !== action.payload._id) {
        state.event = { ...action.payload };
        state.eventId = action.payload._id;
        state.booking = initialState.booking;
        state.selectedEvent = { ...action.payload };
        state.checkout = initialState.checkout;
        state.order = initialState.order;
      } else {
        state.event = { ...action.payload };
        state.booking = initialState.booking;
        state.checkout = initialState.checkout;
        state.order = initialState.order;
        state.selectedEvent = { ...action.payload };
      }
    },

    setBooking: (state, action) => {
      state.booking = action.payload.booking;
      let eventInStore = JSON.parse(JSON.stringify(state.event));
      state.selectedEvent = {
        ...eventInStore,
        ...action.payload.booking.bookingItem,
      };
    },

    setDeletedEvent: (state) => {
      state.booking = initialState.booking;
      state.selectedEvent = null;
      state.event.isSelected = false;
      state.checkout = initialState.checkout;
    },

    setDraftCheckout: (state, action) => {
      state.checkout = action.payload;
    },

    setOrder: (state, action) => {
      state.order = action.payload.order;
    },

    resetBooking: (state) => {
      state.booking = initialState.booking;
      state.selectedEvent = initialState.selectedEvent;
      state.event = initialState.event;
      state.discountCode = initialState.discountCode;
      state.eventId = initialState.eventId;
      state.uiState = initialState.uiState;
      state.checkout = initialState.checkout;
      state.order = initialState.order;
    },

    setPaymentSuccess: (state, action) => {
      state.paymentSuccess = action.payload;
    },
  },
});

export const {
  setEvent,
  setBooking,
  setDeletedEvent,
  setDraftCheckout,
  setOrder,
  resetBooking,
  setPaymentSuccess,
} = socialEventRegistrationSlice.actions;

export default socialEventRegistrationSlice.reducer;


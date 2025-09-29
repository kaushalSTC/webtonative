// social-event-registration-slice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  uiState: "default",
  eventId: "",
  selectedCategories: [],
  selectedCategoriesIds: [],
  selectedSocialEvent: false,
  discountCode: "",
  event: {
    isSocialEventSelected: false,
    eventLocation: {
      address: {
        city: "",
        state: "",
        country: "",
        zipCode: "",
      },
    },
    tournamentData: {
      tournamentLocation: {
        address: {
          city: "",
          state: "",
          country: "",
          zipCode: "",
        },
      },
      categories: [],
    },
  },
  booking: {
    bookingItems: [],
  },
  checkout: {},
  order: {},
  paymentSuccess: false,
};

const socialEventRegistrationSlice = createSlice({
  name: "socialEventRegistration",
  initialState,
  reducers: {
    setSocialEvent: (state, action) => {
      if (!action.payload.eventId) return;
      state.selectedSocialEvent = action.payload.isSocialEventSelected;
      state.event = {
        ...state.event,
        eventId: action.payload.eventId,
      };
    },
    setCategories: (state, action) => {
      const incomingEvent = action.payload;

      /*
    ┌──────────────────────────────────────────┐
    │ Reset if it's a new event                │
    └──────────────────────────────────────────┘
  */
      if (state.eventId === "" || state.eventId !== incomingEvent._id) {
        state.event = { ...incomingEvent };
        state.eventId = incomingEvent._id;
        state.booking = initialState.booking;
        state.selectedCategories = initialState.selectedCategories;
        state.selectedCategoriesIds = initialState.selectedCategoriesIds;
        state.checkout = initialState.checkout;
        state.order = initialState.order;
        // Reset social event selection only for new events
        state.selectedSocialEvent = initialState.selectedSocialEvent;
      }

      // If event is same, just overwrite data (reset booking/checkout/order)
      if (state.eventId === incomingEvent._id) {
        state.event = { ...incomingEvent };
        state.booking = initialState.booking;
        state.checkout = initialState.checkout;
        state.order = initialState.order;
        // DO NOT reset selectedSocialEvent here for same event
      }

      // Handle events with tournament data
      if (incomingEvent.tournamentData?.categories) {
        state.selectedCategories = incomingEvent.tournamentData.categories
          .filter((category) => category.isSelected)
          .map((category) => ({
            ...category,
            categoryId: category._id,
          }));

        state.selectedCategoriesIds = state.selectedCategories.map((category) => category._id);
      } else {
        // Handle events without tournament data (social events only)
        state.selectedCategories = initialState.selectedCategories;
        state.selectedCategoriesIds = initialState.selectedCategoriesIds;
      }
    },

    setBooking: (state, action) => {
      state.booking = action.payload.booking;

      state.selectedCategories = action?.payload?.booking?.bookingItems?.map((bookingItem) => {
        let x = state.event?.tournamentData?.categories?.find((category) => category?._id === bookingItem?.categoryId);
        let categoryInTournament = x ? JSON.parse(JSON.stringify(x)) : {};
        return {
          ...categoryInTournament,
          ...bookingItem,
        };
      });

      state.selectedCategoriesIds = state?.selectedCategories?.map((category) => category?._id);
    },

    setBookingItem: (state, action) => {
      const bookingItems = Array.isArray(action.payload) ? action.payload : [action.payload];

      state.booking = {
        ...state.booking,
        bookingItems: bookingItems,
      };

      // Update selectedCategories based on bookingItems
      state.selectedCategories = bookingItems.map((bookingItem) => {
        let x = state.event?.tournamentData?.categories?.find((category) => category?._id === bookingItem?.categoryId);
        let categoryInTournament = x ? JSON.parse(JSON.stringify(x)) : {};
        return {
          ...categoryInTournament,
          ...bookingItem,
        };
      });

      state.selectedCategoriesIds = state.selectedCategories.map((category) => category?._id);
    },

    setDeletedCategory: (state, action) => {
      let bookingItems = action.payload.booking ? action.payload.booking.bookingItems : [];
      state.booking = action.payload.booking ? action.payload.booking : initialState.booking;

      state.selectedCategories = state.selectedCategories.filter((category) =>
        bookingItems.some((bookingItem) => bookingItem.categoryId === category.categoryId)
      );
      state.selectedCategoriesIds = state.selectedCategories.map((category) => category._id);

      if (bookingItems.length === 0) {
        state.event.tournamentData.categories = state.event.tournamentData.categories.map((category) => {
          return {
            ...category,
            isSelected: false,
          };
        });
      }

      state.event.tournamentData.categories = state.event.tournamentData.categories.map((category) => {
        let categoryExistsInBooking = bookingItems.some((bookingItem) => bookingItem.categoryId === category._id);
        if (categoryExistsInBooking) {
          return {
            ...category,
            isSelected: true,
          };
        }
        return {
          ...category,
          isSelected: false,
        };
      });

      state.checkout = initialState.checkout;
    },

    setDraftCheckout: (state, action) => {
      state.checkout = action.payload;
    },

    setOrder: (state, action) => {
      state.order = action.payload.order;
    },

    setPaymentSuccess: (state, action) => {
      state.paymentSuccess = action.payload;
    },

    // New action: Reset booking data only, preserve social event selection
    resetBookingOnly: (state) => {
      state.booking = initialState.booking;
      state.selectedCategories = initialState.selectedCategories;
      state.selectedCategoriesIds = initialState.selectedCategoriesIds;
      state.checkout = initialState.checkout;
      state.order = initialState.order;
      // DO NOT reset selectedSocialEvent, eventId, or event data
    },

    resetBooking: (state) => {
      state.booking = initialState.booking;
      state.selectedCategories = initialState.selectedCategories;
      state.selectedCategoriesIds = initialState.selectedCategoriesIds;
      state.selectedSocialEvent = initialState.selectedSocialEvent;
      state.isSocialEventSelected = initialState.isSocialEventSelected;
      state.event = initialState.event;
      state.discountCode = initialState.discountCode;
      state.eventId = initialState.eventId;
      state.uiState = initialState.uiState;
      state.checkout = initialState.checkout;
      state.order = initialState.order;
    },
    setDeletedSocialEvent: (state, action) => {
      const updatedBooking = action.payload?.booking || initialState.booking;
      state.booking = updatedBooking;
      state.selectedSocialEvent = false;
      state.checkout = initialState.checkout;
      state.event = {
        ...state.event,
        isSocialEventSelected: false,
      };
    },
  },
});

export const {
  setSocialEvent,
  setCategories,
  setBooking,
  setBookingItem,
  setDeletedCategory,
  setDraftCheckout,
  setPaymentSuccess,
  setOrder,
  resetBooking,
  resetBookingOnly,
  setDeletedSocialEvent,
} = socialEventRegistrationSlice.actions;

export default socialEventRegistrationSlice.reducer;

// authSlice.js
import { createSlice } from '@reduxjs/toolkit';

/*
  ┌─────────────────────────────────────────────────────────────────────────┐
  │ isLoggedIn will come from auth-slice                                    │
  └─────────────────────────────────────────────────────────────────────────┘
*/
/*
  ┌─────────────────────────────────────────────────────────────────────────┐
  │ playerID will come from player-slice                                    │
  └─────────────────────────────────────────────────────────────────────────┘
*/
const initialState = {
  // Not Being Used Yet
  uiState: 'default', // default, Draft-Booking-Page,
  tournamentId: '',
  selectedCategories: [],
  selectedCategoriesIds: [],
  discountCode: '',
  tournament: {
    tournamentLocation: {
      address: {
        city: '',
        state: '',
        country: '',
        zipCode: '',
      },
    },
  },
  booking: {
    bookingItems: [],
  },
  checkout: {},
  order: {},
  paymentSuccess: false
};

const tournamentRegisterationSlice = createSlice({
  name: 'tournamentRegisteration',
  initialState,
  reducers: {
    setCatgories: (state, action) => {
      if (!action.payload.categories) return;

      /*
        ┌─────────────────────────────────────────────────────────────────────────────┐
        │       Initial State Setting on Tournament Page Load                         │
        │       OR                                                                    │
        │       If Tournament Page Changes to Different Tournament.                   │
        └─────────────────────────────────────────────────────────────────────────────┘
      */

      if (state.tournament._id === '' || state.tournament._id !== action.payload._id) {
        state.tournament = { ...action.payload };
        state.tournamentId = action.payload._id;
        state.booking = initialState.booking;
        state.selectedCategories = initialState.selectedCategories;
        state.selectedCategoriesIds = initialState.selectedCategoriesIds;
        state.checkout = initialState.checkout;
        state.order = initialState.order;
      }

      // If Tournament Is Same, Set Selected Categories To True for Checkout.
      if (state.tournament._id === action.payload._id) {
        state.tournament = { ...action.payload };
        state.booking = initialState.booking;
        state.checkout = initialState.checkout;
        state.order = initialState.order;
      }

      state.selectedCategories = action.payload.categories.filter((category) => category.isSelected);
      state.selectedCategories = state.selectedCategories.map((category) => {
        return {
          ...category,
          categoryId: category._id,
        };
      });
      state.selectedCategoriesIds = state.selectedCategories.map((category) => category._id);
    },

    setBooking: (state, action) => {
      state.booking = action.payload.booking;
      /*
        ┌─────────────────────────────────────────────────────────────────────────┐
        │ Add Partner Details to Selected Categories                              │
        └─────────────────────────────────────────────────────────────────────────┘
      */
      state.selectedCategories = action.payload.booking.bookingItems.map((bookingItem) => {
        let x = state.tournament.categories.find((category) => category._id === bookingItem.categoryId);
        let categoryInTournament = x ? JSON.parse(JSON.stringify(x)) : {};
        return {
          ...categoryInTournament,
          ...bookingItem,
        };
      });
      state.selectedCategoriesIds = state.selectedCategories.map((category) => category._id);
    },

    setDeletedCategory: (state, action) => {
      let bookingItems = action.payload.booking ? action.payload.booking.bookingItems : [];
      state.booking = action.payload.booking ? action.payload.booking : initialState.booking;

      state.selectedCategories = state.selectedCategories.filter((category) =>
        bookingItems.some((bookingItem) => bookingItem.categoryId === category.categoryId)
      );
      state.selectedCategoriesIds = state.selectedCategories.map((category) => category._id);

      if (bookingItems.length === 0) {
        state.tournament.categories = state.tournament.categories.map((category) => {
          return {
            ...category,
            isSelected: false,
          }
        });
      }

      state.tournament.categories = state.tournament.categories.map((category) => {
          let categoryExsistsInBooking =bookingItems.some((bookingItem) => bookingItem.categoryId === category._id);
          if(categoryExsistsInBooking) {
            return {
              ...category,
              isSelected: true,
            }
          }
          return {
            ...category,
            isSelected: false,
          }
        }
      );

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
      state.selectedCategories = initialState.selectedCategories;
      state.selectedCategoriesIds = initialState.selectedCategoriesIds;
      state.tournament = initialState.tournament;
      state.discountCode = initialState.discountCode;
      state.tournamentId = initialState.tournamentId;
      state.uiState = initialState.uiState;
      state.checkout = initialState.checkout;
      state.order = initialState.order;
    },

    setPaymentSuccess: (state, action) => {
      state.paymentSuccess = action.payload;
    },

    resetBooking: (state) => {
      state.booking = initialState.booking;
      state.selectedCategories = initialState.selectedCategories;
      state.selectedCategoriesIds = initialState.selectedCategoriesIds;
      state.tournament = initialState.tournament;
      state.discountCode = initialState.discountCode;
      state.tournamentId = initialState.tournamentId;
      state.uiState = initialState.uiState;
    },
  },
});

export const { setCatgories, setBooking, setDeletedCategory, setDraftCheckout, setPaymentSuccess, setOrder, resetBooking } = tournamentRegisterationSlice.actions;
export default tournamentRegisterationSlice.reducer;

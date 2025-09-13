// GTM Event Tracking Utility Functions

export const trackPageView = (pageTitle, pagePath) => {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: 'page_view',
    page: {
      title: pageTitle,
      path: pagePath
    }
  });
  // console.log('trackPageView',window.dataLayer);
};

export const trackLogin = (method, phoneNumber) => {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: 'login',
    login_method: method,
    phone_number: phoneNumber
  });
};

export const trackTournamentRegistrationClick = (tournamentHandle, tournamentName, selectedCategories, totalPrice) => {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: 'tournament_registration',
    tournament: {
      handle: tournamentHandle,
      name: tournamentName
    },
    selected_categories: selectedCategories,
    total_price: totalPrice
  });
};

export const trackPaymentStarted = (bookingId, amount, bookingItems) => {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: 'payment_started',
    booking_id: bookingId,
    amount: amount,
    bookingItems: bookingItems
  });
};

export const trackPaymentComplete = (bookingId, amount, bookingItems, paymentId, status) => {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: 'payment_complete',
    booking_id: bookingId,
    amount: amount,
    bookingItems: bookingItems,
    payment_id: paymentId,
    payment_status: status
  });
};

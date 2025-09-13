/* eslint-disable react/prop-types */
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import Button from '../../Button/Button';
import { PLAYER_ENDPOINT } from '../../../constants';
import { useCreateEventDraftCheckout, useCreateOrderForPayment } from '../../../hooks/SocialEventHooks';
import { setPaymentSuccess } from '../../../store/reducers/socialevent-registration-slice';
import { createErrorToast, createToast } from '../../../utils/utlis';
import { trackPaymentStarted, trackPaymentComplete } from '../../../utils/gtm';
import ErrorMessage from '../../ErrorMessage/ErrorMessage';
import { verifyPayment } from '../../../api/socialEvent';

const SocialEventCheckoutBar = ({ isBookingValid, createDraftBookingError }) => {
  const socialEventRegistration = useSelector((state) => state.socialEventRegistration);
  const player = useSelector((state) => state.player);
  const { booking, checkout, order } = socialEventRegistration;
  const finalAmount = booking?.finalAmount || 0;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Only create endpoints if we have all required IDs
  const hasRequiredIds = player?.id && checkout?.booking?._id;
  const PAYMENT_SUCCESS_ENDPOINT = hasRequiredIds 
    ? `${PLAYER_ENDPOINT}/${player.id}/event-bookings/${checkout.booking._id}/payment-success`
    : null;
  const PAYMENT_VERIFICATION_ENDPOINT = hasRequiredIds
    ? `${PLAYER_ENDPOINT}/${player.id}/event-bookings/${checkout.booking._id}/payment-verification`
    : null;
  const PAY_NOW_ENDPOINT = hasRequiredIds
    ? `${PLAYER_ENDPOINT}/${player.id}/event-bookings/${checkout.booking._id}/pay-now`
    : null;

  const RAZER_PAY_OPTIONS = order?.amount ? {
    key: `${import.meta.env.VITE_RAZORPAY_KEY_ID}`,
    amount: order.amount,
    currency: order.currency,
    name: "Picklebay",
    description: "Social Event Registration",
    order_id: order.id,
    prefill: {
      name: player?.name || '',
      contact: player?.phone || '',
    },
    theme: {
      color: "#244CB4",
    },
    handler: function (response) {
      if (!response?.razorpay_payment_id || !PAYMENT_VERIFICATION_ENDPOINT) {
        createErrorToast("Payment verification failed - missing required data");
        return;
      }

      let data = {
        razorpay_order_id: response.razorpay_order_id,
        razorpay_payment_id: response.razorpay_payment_id,
        razorpay_signature: response.razorpay_signature,
      };

      fetch(PAYMENT_VERIFICATION_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(data),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.status === "success" && checkout?.booking) {
            trackPaymentComplete(
              checkout.booking._id,
              checkout.booking.finalAmount,
              null, // No booking items for social events
              response.razorpay_payment_id,
              'success'
            );
            createToast("Payment successful");
            dispatch(setPaymentSuccess(true));
            navigate("/social-events/booking/payment-status");
          } else {
            trackPaymentComplete(
              checkout?.booking?._id,
              checkout?.booking?.finalAmount,
              null,
              response.razorpay_payment_id,
              'failed'
            );
            createErrorToast("Payment verification failed");
            dispatch(setPaymentSuccess(false));
            navigate("/social-events/booking/payment-status");
          }
        })
        .catch((error) => {
          console.error("Payment verification error:", error);
          createErrorToast(error?.message || "Payment verification failed");
        });
    },
  } : null;

  const { 
    mutate: createDraftCheckout, 
    isSuccess: isDraftCheckoutCreated,
    isPending: isDraftCheckoutCreationPending, 
    isError: isDraftCheckoutCreationError, 
    error: draftCheckoutCreationError 
  } = useCreateEventDraftCheckout();

  const { 
    mutate: createOrderForPayment, 
    isSuccess: isOrderCreatedForPayment,
    isPending: isOrderCreatedForPaymentCreationPending,
    isError: isOrderCreatedForPaymentCreationError,
    error: orderCreatedForPaymentError
  } = useCreateOrderForPayment();

  const handlePaymentVerification = async (response, checkout) => {
    if (!response?.razorpay_payment_id || !checkout?.booking?._id || !booking?.playerId) {
      createErrorToast("Payment verification failed - missing required data");
      return;
    }

    try {
      const verificationData = {
        razorpay_order_id: response.razorpay_order_id,
        razorpay_payment_id: response.razorpay_payment_id,
        razorpay_signature: response.razorpay_signature
      };

      const verifiedBooking = await verifyPayment({
        playerId: booking.playerId,
        bookingId: checkout.booking._id,
        paymentDetails: verificationData
      });

      trackPaymentComplete(
        checkout.booking._id,
        checkout.booking.finalAmount,
        null,
        response.razorpay_payment_id,
        'success'
      );
      createToast("Payment successful");
      dispatch(setPaymentSuccess(true));
      navigate("/social-events/booking/payment-status");
    } catch (error) {
      console.error("Payment verification error:", error);
      trackPaymentComplete(
        checkout?.booking?._id,
        checkout?.booking?.finalAmount,
        null,
        response.razorpay_payment_id,
        'failed'
      );
      createErrorToast(error?.message || "Payment verification failed");
      dispatch(setPaymentSuccess(false));
      navigate("/social-events/booking/payment-status");
    }
  };

  const createOrder = async () => {
    if (!PAY_NOW_ENDPOINT || !checkout?.booking) {
      createErrorToast("Cannot create order - missing required data");
      return;
    }

    try {
      const response = await fetch(PAY_NOW_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          amount: checkout.booking.finalAmount,
          currency: "INR",
          receipt: `receipt_${checkout.booking._id}`,
          notes: {
            eventId: booking.eventId,
            bookingId: booking._id,
            playerId: booking.playerId,
            amount: checkout.booking.finalAmount
          }
        }),
      });

      const data = await response.json();
      
      if (data.status === "success" && data.data?.order) {
        const orderData = data.data.order;
        if (window.Razorpay) {
          console.log('Initializing Razorpay with order:', orderData);
          const rzp = new window.Razorpay({
            key: `${import.meta.env.VITE_RAZORPAY_KEY_ID}`,
            amount: orderData.amount,
            currency: orderData.currency,
            name: "Picklebay",
            description: "Social Event Registration",
            order_id: orderData.id,
            prefill: {
              name: player?.name || '',
              contact: player?.phone || '',
            },
            theme: {
              color: "#244CB4",
            },
            handler: function(response) {
              handlePaymentVerification(response, checkout);
            },
          });
          rzp.open();
          console.log("SocialEventCheckoutBar.jsx | Razorpay SDK loaded and opened.");
        } else {
          createErrorToast("Payment gateway not loaded");
        }
      } else {
        createErrorToast("Failed to create payment order");
      }
    } catch (error) {
      console.error("Order creation error:", error);
      createErrorToast(error?.message || "Failed to create payment order");
    }
  };

  const payNowHandler = () => {
    if (!booking?.playerId || !booking?.eventId || !booking?._id) {
      createErrorToast("Missing required booking information");
      return;
    }

    if (!booking.finalAmount || booking.finalAmount <= 0) {
      createErrorToast("Invalid amount for payment");
      return;
    }

    trackPaymentStarted(
      booking._id,
      booking.finalAmount,
      null // No booking items for social events
    );

    createDraftCheckout({
      playerId: booking.playerId,
      eventId: booking.eventId,
      bookingId: booking._id,
      totalAmount: booking.totalAmount,
      amountAfterDiscount: booking.amountAfterDiscount,
      gstAmount: booking.gstAmount,
      finalAmount: booking.finalAmount,
      discountAmount: booking.discountAmount || 0
    });
  };

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => console.log("Razorpay SDK Loaded");

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  useEffect(() => {
    if (isDraftCheckoutCreated && checkout?.booking && checkout.booking.finalAmount > 0 && booking?.playerId && booking?._id) {
      console.log('Creating order after successful draft checkout');
      createOrder();
    }
  }, [isDraftCheckoutCreated, checkout, booking]);

  useEffect(() => {
    if (isOrderCreatedForPayment && order?.amount) {
      if (window.Razorpay && RAZER_PAY_OPTIONS) {
        const rzp = new window.Razorpay(RAZER_PAY_OPTIONS);
        rzp.open();
        console.log("SocialEventCheckoutBar.jsx | Razorpay SDK loaded.");
      } else {
        console.error("Razorpay SDK failed to load.");
      }
    }
  }, [isOrderCreatedForPayment, order, RAZER_PAY_OPTIONS]);

  return (
    <div className="w-full bg-ffffff gap-[18px] flex flex-col sticky bottom-0 left-0 right-0 z-[1] border-t-2 border-f2f2f2">
      <div className="flex flex-row w-full px-9 md:px-20 py-4 justify-between items-center">
        {finalAmount > 0 && (
          <div className="flex flex-col items-start justify-center gap-0">
            <p className="font-general font-medium text-383838 opacity-70">Registration Fee</p>
            <p className="font-general font-semibold text-base text-1c0e0e capitalize mt-0 mb-0 p-0">
              INR {finalAmount}/-
            </p>
          </div>
        )}
        <Button
          isLoading={isDraftCheckoutCreationPending}
          disabled={!isBookingValid || createDraftBookingError || !finalAmount || finalAmount <= 0}
          onClick={payNowHandler}
          className="bg-383838 flex ml-auto flex-row items-center justify-center text-ffffff font-general text-base w-auto rounded-full py-3.5 px-9 cursor-pointer"
        >
          Pay Now
        </Button>
      </div>
      {isDraftCheckoutCreationError && draftCheckoutCreationError?.message && (
        <ErrorMessage 
          message={draftCheckoutCreationError.message} 
          className="text-sm text-red-400 font-general font-medium mt-2 text-center"
        />
      )}
      {isOrderCreatedForPaymentCreationError && orderCreatedForPaymentError?.message && (
        <ErrorMessage 
          message={orderCreatedForPaymentError.message} 
          className="text-sm text-red-400 font-general font-medium mt-2 text-center"
        />
      )}
    </div>
  );
};

export default SocialEventCheckoutBar;

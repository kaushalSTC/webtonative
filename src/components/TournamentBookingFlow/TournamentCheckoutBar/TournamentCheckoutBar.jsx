/* eslint-disable react/prop-types */
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import Button from '../../../components/Button/Button';
import { PLAYER_ENDPOINT } from '../../../constants';
import { useCreateDraftCheckoutMutation, useCreateOrderForPaymentMutation } from '../../../hooks/TournamentHooks';
import { setPaymentSuccess } from '../../../store/reducers/tournament-registeration-slice';
import { createErrorToast, createToast } from '../../../utils/utlis';
import { trackPaymentStarted, trackPaymentComplete } from '../../../utils/gtm';
import ErrorMessage from '../../ErrorMessage/ErrorMessage';

const TournamentCheckoutBar = ({ isBookingValid, createDraftBookingError, playerFormData }) => {
  const tournamentRegisteration = useSelector((state) => state.tournamentRegisteration);
  const player = useSelector((state) => state.player);
  const { booking, checkout, order } = tournamentRegisteration;
  const { finalAmount } = booking;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const PAYMENT_SUCCESS_ENDPOINT = `${PLAYER_ENDPOINT}/${player.id}/bookings/${checkout.booking?._id}/payment-success`
  const PAYMENT_VERIFICATION_ENDPOINT = `${PLAYER_ENDPOINT}/${player.id}/bookings/${checkout.booking?._id}/payment-verification`
  const SUBMIT_FORM_ENDPOINT = `${PLAYER_ENDPOINT}/${player.id}/form-data`

  const RAZER_PAY_OPTIONS = {
    key: `${import.meta.env.VITE_RAZORPAY_KEY_ID}`,
    amount: order.amount,
    currency: order.currency,
    name: "Picklebay",
    description: "Transaction Completed",
    order_id: order.id, // This is the order_id created in the backend
    // callback_url: PAYMENT_SUCCESS_ENDPOINT, // Your success URL
    prefill: {
      name: player.name,
      contact: player.phone,
    },
    theme: {
      color: "#244CB4",
    },
    handler: function (response) {
      if (response.razorpay_payment_id) {
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
            console.log(
              "TournamentCheckoutBar.jsx:52 | .then | data:",
              data
            );
            if (data.status === "success") {
              trackPaymentComplete(
                checkout.booking._id,
                checkout.booking.finalAmount,
                booking.bookingItems,
                response.razorpay_payment_id,
                'success'
              );
              createToast("Payment successful");
              dispatch(setPaymentSuccess(true));
              navigate("payment-status");
            } else {
              trackPaymentComplete(
                checkout.booking._id,
                checkout.booking.finalAmount,
                booking.bookingItems,
                response.razorpay_payment_id,
                'failed'
              );
              createErrorToast(`${"Payment VerificatiAon failed"}`);
              dispatch(setPaymentSuccess(false));
              navigate("payment-status");
            }
          })
          .catch((error) => {
            0;
            console.log(
              "TournamentCheckoutBar.jsx:63 | TournamentCheckoutBar | error:",
              error
            );
            createErrorToast(
              `${error.message || "Payment VerificatiAon failed"}`
            );
          });
      }
    },
  };
  const { mutate: createDraftCheckout, isSuccess: isDraftCheckoutCreated, isPending: isDraftCheckoutCreationPending, isError: isDraftCheckoutCreationError, error: draftCheckoutCreationError} = useCreateDraftCheckoutMutation();
  const { mutate: createOrderForPayment, isSuccess: isOrderCreatedForPayment, isPending: isOrderCreatedForPaymentCreationPending, isError: isOrderCreatedForPaymentCreationError, error: orderCreatedForPaymentError} = useCreateOrderForPaymentMutation();
  
  const submitFormData = async () => {
  try {
    const formattedData = tournamentRegisteration.tournament.playerFormFields.map((field) => {
      let value = playerFormData[field.label];

      if (field.type === "Number") {
        if (value === "" || value === undefined || value === null) {
          value = null;
        } else {
          value = Number(value);
        }
      } else if (field.type === "String") {
        if (value === undefined || value === null) {
          value = "";
        } else {
          value = String(value);
        }
    }

      return {
        label: field.label,
        value
      };
    });

    const res = await fetch(SUBMIT_FORM_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        tournamentId: booking.tournamentId,
        playerFormDataResponse: formattedData
      }),
    });

    const data = await res.json();
    if (!res.ok || data.status !== "success") {
      throw new Error(data.message || "Failed to submit form");
    }
    return true;
  } catch (err) {
    createErrorToast(err.message);
    return false;
  }
};

  const payNowHandler = async() => {
    const formSaved = await submitFormData();
    if (!formSaved) return;
    
    trackPaymentStarted(
      booking._id,
      booking.finalAmount,
      booking.bookingItems
    );
    createDraftCheckout({
      playerId: booking.playerId,
      tournamentId: booking.tournamentId,
      bookingId: booking._id,
      bookingItems: booking.bookingItems,
      totalAmount: booking.totalAmount,
      finalAmount: booking.finalAmount,
      amountAfterDiscount: booking.amountAfterDiscount,
      gstAmount: booking.gstAmount,
      // discountCode: booking.discountCode,
      discountAmount: 0 
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
    if (isDraftCheckoutCreated && checkout.booking.finalAmount > 0 && booking.playerId && booking._id) {
      createOrderForPayment({
        amount: checkout.booking.finalAmount,
        playerId: booking.playerId,
        bookingId: booking._id,
      });
    }
  }, [isDraftCheckoutCreated, checkout, booking])

  useEffect(() => {
    if (isOrderCreatedForPayment) {
      if (window.Razorpay) {
        const rzp = new window.Razorpay(RAZER_PAY_OPTIONS);
        rzp.open();
        console.log("TournamentCheckoutBar.jsx:114 | Razorpay SDK loaded.");
      } else {
        console.error("Razorpay SDK failed to load.");
      }
    }
  }, [isOrderCreatedForPayment])
  
  return (
    <>
      <div className="w-full bg-ffffff gap-[18px] flex flex-col sticky bottom-0 left-0 right-0 z-[1] border-t-2 border-f2f2f2">
        <div className="flex flex-row w-full px-9 md:px-20 py-4 justify-between items-center">
          {finalAmount > 0 && (
            <div className="flex flex-col items-start justify-center gap-0">
              <p className="font-general font-medium text-383838 opacity-70">Registration Fee</p>
              <p className="font-general font-semibold text-base text-1c0e0e capitalize mt-0 mb-0 p-0">
                INR {finalAmount}/-{''}
              </p>
            </div>
          )}
          <Button
            isLoading={isDraftCheckoutCreationPending}
            disabled={!isBookingValid || createDraftBookingError}
            onClick={payNowHandler}
            className="bg-383838 flex ml-auto flex-row items-center justify-center text-ffffff font-general text-base w-auto rounded-full py-3.5 px-9 cursor-pointer"
          >
            Pay Now
          </Button>
        </div>
        {isDraftCheckoutCreationError && <ErrorMessage message={draftCheckoutCreationError.message} className="text-sm text-red-400 font-general font-medium mt-2 text-center"></ErrorMessage>}
      </div>
    </>
  );
};

export default TournamentCheckoutBar;

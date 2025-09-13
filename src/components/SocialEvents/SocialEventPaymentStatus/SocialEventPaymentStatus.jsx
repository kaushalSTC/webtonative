import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { PaymentFailed } from "../../../assets";
import Button from "../../Button/Button";
import SocialEventBookingSummary from "../SocialEventBookingSummary/SocialEventBookingSummary";

const SocialEventPaymentStatus = () => {
  const socialEventRegistration = useSelector((state) => state.socialEventRegistration);
  const navigate = useNavigate();

  if (!socialEventRegistration.paymentSuccess) return (
    <main className="w-full mx-auto bg-f2f2f2">
      <div className="max-w-[720px] mx-auto relative">
        <div className="w-full bg-f2f2f2 relative pt-[162px] md:pt-[48px] pb-40">
          <h1 className="font-author font-medium text-size-24 md:text-[44px] text-383838 opacity-70 text-center">
            Oops! Payment Failed
          </h1>
          <p className="font-general font-medium text-xs md:text-size-14 text-383838 opacity-70 text-center mt-3.5 max-w-[354px] mx-auto">
            Sorry, We Could Not Process Your Registration Request Because Your Payment Failed.
          </p>
          <img 
            src={PaymentFailed} 
            alt="Payment failed" 
            className="w-full h-auto object-contain ml-0 md:ml-auto mx-auto max-w-[354px] mt-[50px] md:mt-[33px]"
          />

          <Button
            className="bg-transparent border border-383838 mx-auto flex flex-row items-center justify-center text-383838 font-general text-sm w-auto rounded-full py-3.5 px-9 cursor-pointer"
            onClick={() => navigate('/social-events/booking')}
          >
            Try Again
          </Button>
        </div>
      </div>
    </main>
  );

  return (
    <SocialEventBookingSummary />
  );
};

export default SocialEventPaymentStatus;

const StaticHeading = ({pageType}) => {
  let heading;
  if (pageType === "termsConditions") {
    heading = "Terms & Conditions";
  } else if (pageType === "refundsCancellations") {
    heading = "Refunds & Cancellations";
  } else if (pageType === "privacyPolicy") {
    heading = "Privacy Policy";
  } else if (pageType === "guidelines") {
    heading = "Picklebay Guidelines";
  }
  else if (pageType === "contactUs") {
    heading = "Contact Us";
  }
  return (
    <h1 className="text-[2rem] font-semibold text-center text-gray-800">
      {heading}
    </h1>
  );
};

export default StaticHeading;

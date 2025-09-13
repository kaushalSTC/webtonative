import React from "react";
import { SocialEventBanner, SocialEventBannerMobile } from "../../assets";
import CommunityButton from "../CommunityButton/CommunityButton";

const PromotionalBanner = () => {
  return (
    <CommunityButton
      buttonTitle={
        <div className='cursor-pointer'>
          <img
            src={SocialEventBanner}
            alt="community-banner-desktop"
            className="w-full h-auto object-cover max-md:hidden"
          />
          <img
            src={SocialEventBannerMobile}
            alt="community-banner-mobile"
            className="w-full h-auto object-cover md:hidden"
          />
        </div>
      }
      buttonTitleStyle="block w-full"
      enableLoader={true}
    />
  );
};

export default PromotionalBanner;

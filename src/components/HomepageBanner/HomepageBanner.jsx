import React, { useState, useEffect } from "react";
import { Link } from "react-router";
import { GridBanner, GridBannerMobile } from "../../assets";
import axios from "axios";

const HomepageBanner = () => {
  const baseURL = import.meta.env.VITE_DEV_URL; // Access environment variable

  const [homepageBannerObj, setHomepageBannerObj] = useState({});

  const getWhyChoosePickleBayDetails = async () => {
    try {
      const response = await axios.get(
        `${baseURL}/api/public/homepage-sections?section=destinationDink`
      );
      setHomepageBannerObj({
        DesktopBanner: {
          image: response?.data?.data[0]?.DesktopBannerImage,
          mobImage:response?.data?.data[0]?.MobileBannerImage,
          link: response?.data?.data[0]?.link,
        },
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getWhyChoosePickleBayDetails();
  }, []);
  if (!homepageBannerObj || Object.keys(homepageBannerObj).length === 0) return null;

  return (
    <div>
      <div className="max-w-[904px] mx-auto px-5 md:px-0 mb-20">
        <Link
          to={homepageBannerObj?.DesktopBanner?.link}
          className="hidden md:block"
        >
          <div className="aspect-904/367 w-full h-full relative overflow-hidden">
            <img
              src={homepageBannerObj?.DesktopBanner?.image}
              alt="homepage-banner"
              className="w-full h-auto object-cover"
              loading='lazy'
            />
          </div>
        </Link>
        <Link
          to={homepageBannerObj?.DesktopBanner?.link}
          className="block md:hidden"
        >
          <div className="aspect-360/300 w-full h-full relative overflow-hidden">
            <img 
              src={homepageBannerObj?.DesktopBanner?.mobImage}
              alt="homepage-banner"
              className="w-full h-auto object-cover"
              loading='lazy'
            />
          </div>
        </Link>
      </div>
    </div>
  );
};

export default HomepageBanner;

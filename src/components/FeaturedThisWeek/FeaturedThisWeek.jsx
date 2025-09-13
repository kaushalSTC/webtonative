import React, { useState, useEffect } from "react";
import { FeaturedThisWeekBg } from "../../assets";
import { Link } from "react-router-dom";
import axios from "axios";
import DOMPurify from "dompurify";

const FeaturedThisWeek = () => {

  const baseURL = import.meta.env.VITE_DEV_URL; // Access environment variable

  const [featuredThisWeek, setFeaturedThisWeek] = useState({});

  const getFeatureThisWeek = async () => {
    try {
      const response = await axios.get(
        `${baseURL}/api/public/homepage-sections?section=featuredThisWeek`
      );
      setFeaturedThisWeek(response.data.data[0]);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getFeatureThisWeek();
  }, []);

  if (!featuredThisWeek || featuredThisWeek.length === 0) return null;
  return (
    <div className=" m-auto max-w-[848px] w-full mb-20">
      <h2 className="font-general font-medium text-sm md:text-base text-1c0e0eb3 capitalize mb-5 text-left md:text-center pl-8 md:pl-0">
        {featuredThisWeek?.sectionTitle}
      </h2>
      <div className="flex items-stretch justify-center flex-col md:flex-row md:max-h-[390px] md:rounded-r-20 md:overflow-hidden">
        <div className="aspect-390/390 w-full overflow-hidden max-w-[100%] md:max-w-[46%]">
          <img
            src={featuredThisWeek?.image}
            alt="featured-this-week"
            className="w-full h-full md:w-auto md:h-full object-cover"
          />
        </div>
        <div className="w-auto relative block">
          <img
            src={FeaturedThisWeekBg}
            alt="featured-this-week-bg"
            className="aspect-458/390 w-full md:w-auto h-auto md:h-full object-fill hidden md:block"
            loading="lazy"
          />
          <div className="static md:absolute bottom-[77px] left-[50px] bg-1c4ba3 md:bg-transparent px-9 py-10 md:px-0 md:py-0">
            <p className="font-author font-medium text-2xl text-white">
              {featuredThisWeek.heading}
            </p>
            <div className="w-full flex items-end gap-0 md:gap-8">
              <div className="text-xs font-medium font-general text-white opacity-70 mt-2 max-w-[80%] md:max-w-[60%] md:h-[230px] overflow-y-scroll scrollbar-hide"
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(featuredThisWeek.subHeading),
                }}
              />
              <Link
                to={`${featuredThisWeek.link}`}
                className="text-white font-general font-medium text-xs underline capitalize"
              >
                {featuredThisWeek.buttonText}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturedThisWeek;

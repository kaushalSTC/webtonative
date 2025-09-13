import React, { useState, useEffect } from "react";
import { LinkArrow, HomepageBgGradient } from "../../assets";
import { nanoid } from "@reduxjs/toolkit";
import { Link } from "react-router";
import axios from "axios";

const ExplorePicklebayFeatures = () => {
  const baseURL = import.meta.env.VITE_DEV_URL; // Access environment variable
  const [featuresData, setFeaturesData] = useState({});

  const getFeatureData = async () => {
    try {
      const response = await axios.get(
        `${baseURL}/api/public/homepage-sections?section=explore`
      );
      setFeaturesData({
        sectionTitle: response?.data?.data[0]?.sectionTitle,
        features: response?.data?.data[0]?.features,
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getFeatureData();
  }, []);

  if (!featuresData || featuresData.length === 0 || !featuresData.features) return null;

  return (
    <div style={{
      background: "linear-gradient(180deg, rgba(255, 255, 255, 0.8) 0%, #DBE0FC 56%, rgba(255, 255, 255, 0.8) 91%)",
    }}>
      <div className="pt-15 pl-4 md:pl-[120px] pr-0 md:pr-[90px]" style={{ backgroundImage: `url(${HomepageBgGradient})` }}>
        <h2 className="font-general font-medium text-sm md:text-base text-1c0e0eb3 capitalize mb-5 pl-[20px]">
          {featuresData?.sectionTitle}
        </h2>
        <div className="flex items-center justify-start gap-2 md:gap-4 whitespace-nowrap overflow-x-auto [&::-webkit-scrollbar]:hidden">
          {featuresData?.features?.map((feature) => {
            return (
              <div key={nanoid()} className="relative flex-none w-[45%] md:w-[22%]">
                <Link to={`${feature?.link}`} className="">
                  <div className="w-full overflow-hidden rounded-[20px]">
                    <img
                      src={feature?.image}
                      alt={feature?.title}
                      loading="lazy"
                      className="w-full h-auto object-cover"
                    />
                  </div>
                  <div className="absolute bottom-[16px] md:bottom-[20px] left-[10px] md:left-[20px] pr-2">
                    <div className="flex items-center gap-2">
                      <p className="font-general font-semibold text-white text-[14px] md:text-[18px] capitalize line-clamp-2 text-wrap flex-none max-w-[85%]">
                        {feature?.title}
                      </p>
                      <span className="w-[5px]">
                        <img
                          src={LinkArrow}
                          alt="link-arrow"
                          className="w-full h-full"
                        />
                      </span>
                    </div>
                    <p className="font-general font-medium text-xs text-white opacity-70 text-wrap w-3/4 line-clamp-2">
                      {feature?.subtitle}
                    </p>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ExplorePicklebayFeatures;

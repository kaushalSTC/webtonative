import axios from "axios";
import { ABOUT_US_ENDDPOINT } from "../constants";

export const getAboutUs = async ({sectionName}) => {
  let config = {
    method: "GET",
    maxBodyLength: Infinity,
    url: `${ABOUT_US_ENDDPOINT}?section=${sectionName}`,
  };

  try {
    const response = await axios.request(config);
    return response?.data?.data[0];
  } catch (error) {
    throw error;
  }
};

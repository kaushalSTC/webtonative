import axios from "axios";
import { TOURISM_ENDPOINT } from "../constants";

export const getTourismSection = async ({ sectionName }) => {

  let config = {
    method: "GET",
    maxBodyLength: Infinity,
    url: `${TOURISM_ENDPOINT}?section=${sectionName}`,
  };

  try {
    const response = await axios.request(config);
    return response?.data?.data[0];
  } catch (error) {
    throw error.response?.data || error;
  }
};

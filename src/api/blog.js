import axios from "axios";

export const getBlogs = async () => {
  const baseURL = import.meta.env.VITE_DEV_URL;
  const ENDPOINT = `${baseURL}/api/public/blogs`;
  let config = {
    method: "GET",
    maxBodyLength: Infinity,
    url: ENDPOINT,
  };

  try {
    const response = await axios.request(config);
    return response.data.data;
  } 
  catch (error) {
    throw error.response?.data || error;
  }
};

export const getBlogDetail = async ({ handle }) => {
  const baseURL = import.meta.env.VITE_DEV_URL;
  const ENDPOINT = `${baseURL}/api/public/blogs/${handle}`;

  let config = {
    method: "GET",
    maxBodyLength: Infinity,
    url: ENDPOINT,
  };

  try {
    const response = await axios.request(config);
    return response.data.data;
  } 
  catch (error) {
    throw error.response?.data || error;
  }
};

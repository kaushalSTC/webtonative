import axios from "axios";
import { TOURNAMENT_DETAILS_ENDPOINT } from "../constants";

export const getFixture = async ({ tournamentHandle, categoryId }) => {
  if (!tournamentHandle) {
    throw new Error("Tournament handle is required");
  }

  if (!categoryId) {
    throw new Error("Category id is required");
  }

  const ENDPOINT = `${TOURNAMENT_DETAILS_ENDPOINT}/${tournamentHandle}/categories/${categoryId}/fixtures`;

  let config = {
    method: "GET",
    maxBodyLength: Infinity,
    url: ENDPOINT,
  };

  try {
    const response = await axios.request(config);
    return response.data.data.fixtures;
  } catch (error) {
    console.error("🚀 || file: fixture.js:25 || getFixture || error:", error);
    throw error.response?.data || error;
  }
};

export const getSchedule = async ({ tournamentHandle, categoryId }) => {
  if (!tournamentHandle) {
    throw new Error("Tournament handle is required");
  }

  if (!categoryId) {
    throw new Error("Category id is required");
  }

  const ENDPOINT = `${TOURNAMENT_DETAILS_ENDPOINT}/${tournamentHandle}/categories/${categoryId}/schedule`;

  let config = {
    method: "GET",
    maxBodyLength: Infinity,
    url: ENDPOINT,
  }

  try {
    const response = await axios.request(config);
    return response.data.data;
  } catch (error) {
    console.error("🚀 || file: schedule.js:25 || getSchedule || error:", error);
    throw error.response?.data || error;
  }
};

export const getStandings = async ({ fixtureId }) => {
  if(!fixtureId) {
    throw new Error("Fixture id is required");
  }

  const BASEURL = import.meta.env.VITE_DEV_URL;
  const ENDPOINT = `${BASEURL}/api/public/fixtures/${fixtureId}/stage/0/standings`;

  let config = {
    method: "GET",
    maxBodyLength: Infinity,
    url: ENDPOINT,
  }

  try {
    const response = await axios.request(config);
    return response.data.data;
  } catch (error) {
    console.error("🚀 || file: standings.js:25 || getStandings || error:", error);
    throw error.response?.data || error;
  }
}
import axios from "axios";

const API_URL = "http://127.0.0.1:5000"; // Flask Backend URL

export const getEduBotSuggestions = async (jobRole) => {
  const res = await axios.post(`${API_URL}/edubot`, { job_role: jobRole });
  return res.data.resources;
};

export const getJobMateResumeTips = async (resume) => {
  const res = await axios.post(`${API_URL}/jobmate`, { resume });
  return res.data.resume_bullets;
};

export const getWellnessCheck = async (text) => {
  const res = await axios.post(`${API_URL}/wellness`, { text });
  return res.data.sentiment;
};


import axios from "axios";

const API_URL = "http://localhost:5000/api/songs";

export const uploadSong = async (file) => {
  const formData = new FormData();
  formData.append("song", file);
  await axios.post(`${API_URL}/upload`, formData);
};

export const getAllSongs = async () => {
  const response = await axios.get(`${API_URL}/all`);
  return response.data;
};

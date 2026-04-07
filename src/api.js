import axios from "axios";

// const API = axios.create({
//   baseURL: "https://datavision-backend.onrender.com/api",
// });

const API = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api`,
});

// ✅ Signup
export const registerUser = async (data) => {
  try {
    const res = await API.post("/register", data);
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

// ✅ Login
export const loginUser = async (data) => {
  try {
    const res = await API.post("/login", data);
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

export default API;

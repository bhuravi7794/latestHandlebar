import axios from "axios";

const axiosObject = axios.create({
  baseURL: "http://localhost:3010/api",
  headers: { "Content-Type": "application/json" },
});
export default axiosObject;

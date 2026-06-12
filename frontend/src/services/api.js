import axios from "axios";

const API = axios.create({
    baseURL: "https://auditing-monkey.vercel.app/api"
});

export default API;
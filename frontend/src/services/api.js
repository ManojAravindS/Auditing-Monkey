import axios from "axios";

const API = axios.create({
    baseURL: "https://auditing-monkey.onrender.com/api"
});

export default API;
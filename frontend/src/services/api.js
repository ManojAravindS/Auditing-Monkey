import axios from "axios";

const API = axios.create({
    baseURL: "https://auditing-monkey.railway.app/api"
});

export default API;
import axios from "axios";

const createApiClient = (baseURL, isMultipart = false) => {
    const headers = {
        "Accept": "application/json",
    };

    if (!isMultipart) {
        headers["Content-Type"] = "application/json";
    }

    const client = axios.create({
        baseURL,
        headers,
    });

    // Thêm token vào request nếu có
    client.interceptors.request.use((config) => {
        const token = localStorage.getItem("accessToken");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    });

    return client;
};

export default createApiClient;

import axios from "axios";
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import { toast } from "sonner";
import authHeader from "@/library/http/AuthTokenHeader";
import { convertJSONToFormData } from "@/library/helpers/helperFunctions";

const API_URL = "http://127.0.0.1:8090/api";

const axiosApi: AxiosInstance = axios.create({
    baseURL: API_URL,
});

// Default headers
axiosApi.defaults.headers["Access-Control-Allow-Origin"] = "*";

// Request Interceptor
axiosApi.interceptors.request.use(
    async (config: AxiosRequestConfig) => {
        const token = await authHeader();
        if (token) {
            config.headers = {
                ...config.headers,
                Authorization: token,
                "Access-Control-Allow-Origin": "*",
            };
        } else {
            config.headers = {
                ...config.headers,
                "Access-Control-Allow-Origin": "*",
            };
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response Interceptor
axiosApi.interceptors.response.use(
    (response: AxiosResponse) => {
        if (response.status >= 200 && response.status <= 299) {
            return response;
        }
        throw response;
    },
    (error) => {
        if (!error.response) {
            return Promise.reject(error);
        }

        let message: string | unknown;

        if (error.response && error.response.status) {
            if (error.response.status === 401) {
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                toast.error("Invalid Credentials", {
                    description: "Please try again",
                });
                // TODO: implement refresh token
            }

            switch (error.response.status) {
                case 404:
                    message = "Sorry! the page you are looking for could not be found";
                    toast.error(`Request Error: ${error.response.config.url}`, {
                        description: message,
                    });
                    break;

                case 500:
                    message = "Sorry! something went wrong, please contact our support team";
                    toast.error(
                        error.response.data?.message
                            ? `${error.response.data.message}`
                            : `Request Error: ${error.response.config.url}`,
                        {
                            description: error.response.data?.message ? "" : message,
                        }
                    );
                    break;

                default:
                    message = error.response.data;
                    break;
            }
        }

        throw message;
    }
);

// ✅ API utility functions

export async function get<T = any>(
    url: string,
    config: AxiosRequestConfig = {}
): Promise<T> {
    return axiosApi.get<T>(url, { ...config }).then((response) => response.data);
}

export async function post<T = any>(
    url: string,
    data?: unknown,
    config: AxiosRequestConfig = {}
): Promise<T> {
    return axiosApi
        .post<T>(url, data, { ...config })
        .then((response) => response.data);
}

export async function postUpload<T = any>(
    url: string,
    data: FormData,
    config: AxiosRequestConfig = {}
): Promise<T> {
    return axiosApi
        .post<T>(url, data, {
            ...config,
            headers: { "content-type": "multipart/form-data" },
        })
        .then((response) => response.data);
}

export async function putFormData<T = any>(
    url: string,
    data: Record<string, unknown>,
    config: AxiosRequestConfig = {}
): Promise<T> {
    const formData = convertJSONToFormData(data);
    formData.append("_method", "PUT");

    return axiosApi
        .post<T>(url, formData, {
            ...config,
            headers: { "content-type": "multipart/form-data" },
        })
        .then((response) => response.data);
}

export async function postFormData<T = any>(
    url: string,
    data: Record<string, unknown>,
    config: AxiosRequestConfig = {}
): Promise<T> {
    const formData = convertJSONToFormData(data);
    formData.append("_method", "POST");

    return axiosApi
        .post<T>(url, formData, {
            ...config,
            headers: { "content-type": "multipart/form-data" },
        })
        .then((response) => response.data);
}

export async function downloadFile(
    url: string,
    config: AxiosRequestConfig = {},
    filename: string
): Promise<void> {
    return axiosApi
        .get(url, {
            ...config,
            responseType: "blob",
        })
        .then((response) => {
            const blobUrl = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = blobUrl;
            link.setAttribute("download", filename);
            document.body.appendChild(link);
            link.click();
            link.remove();
        });
}

export async function downloadFilePost(
    url: string,
    filters: Record<string, unknown>,
    filename: string
): Promise<void> {
    return axiosApi
        .post(url, filters, { responseType: "blob" })
        .then((response) => {
            const fileURL = window.URL.createObjectURL(new Blob([response.data]));
            const fileLink = document.createElement("a");
            fileLink.href = fileURL;
            fileLink.setAttribute("download", filename);
            document.body.appendChild(fileLink);
            fileLink.click();
            document.body.removeChild(fileLink);
        });
}

export async function put<T = any>(
    url: string,
    data: unknown,
    config: AxiosRequestConfig = {}
): Promise<T> {
    return axiosApi
        .put<T>(url, data, { ...config })
        .then((response) => response.data);
}

export async function del<T = any>(
    url: string,
    config: AxiosRequestConfig = {}
): Promise<T> {
    return axiosApi
        .delete<T>(url, { ...config })
        .then((response) => response.data);
}

import axios from "axios";
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import { toast } from "sonner";
import authHeader from "@/library/http/AuthTokenHeader";
import { convertJSONToFormData } from "@/library/helpers/helperFunctions";
import * as url from './urlHelpers';

const API_URL = import.meta.env.VITE_API_URL;

const axiosApi: AxiosInstance = axios.create({
    baseURL: API_URL,
    withCredentials: true,
});

// Request Interceptor
axiosApi.interceptors.request.use(
    async (config: any) => {
        const token = await authHeader();
        const currentCompanyId = localStorage.getItem('current_company_id');

        if (token) {
            config.headers.Authorization = token;
        }

        // Always include company ID if available
        if (currentCompanyId) {
            config.headers['X-Company-ID'] = currentCompanyId;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response Interceptor
axiosApi.interceptors.response.use(
    (response: AxiosResponse) => {
        if (response.status >= 200 && response.status <= 299) {
            const method = response.config.method?.toUpperCase();
            const successMessage = response.data?.message;

            if (successMessage &&  successMessage !== "SUCCESS") {
                // @ts-ignore
                if (response.config.skipSuccessNotification) {
                    return response;
                } else {
                    toast.success("Success", {
                        description: successMessage,
                    });
                }
            } else {
                switch (method) {
                    case 'POST':
                        toast.success("Created Successfully");
                        break;
                    case 'PUT':
                    case 'PATCH':
                        toast.success("Updated Successfully");
                        break;
                    case 'DELETE':
                        toast.success("Deleted Successfully");
                        break;
                    default:
                        if (method !== 'GET') {
                            toast.success("Request Successful");
                        }
                }
            }

            return response;
        }
        throw response;
    },
    async (error) => {
        if (!error.response) {
            toast.error("Network Error", {
                description: "Please check your internet connection",
            });
            return Promise.reject(error);
        }

        const { status, data, config } = error.response;

        if (status === 401) {
            try {
                const response = await axiosApi.post(url.REFRESH);
                const newToken = response.data.data.token.access_token;
                localStorage.setItem('token', newToken);
                error.config.headers.Authorization = 'Bearer ' + newToken;
                return axiosApi(error.config);
            } catch (refreshError) {
                localStorage.removeItem('token');
                window.location.href = '/login';
            }
        } else if (status === 404) {
            toast.error(`Request Error: ${config.url}`, {
                description: "Sorry! the page you are looking for could not be found",
            });
        } else if (status === 500) {
            const errorMessage = data?.message || "Internal Server Error";
            const errorTitle = data?.message ? errorMessage : `Request Error: ${config.url}`;
            const errorDescription = data?.message
                ? "Please try again or contact support if the problem persists"
                : "Sorry! something went wrong, please contact our support team";

            toast.error(errorTitle, {
                description: errorDescription,
            });
        } else if (status >= 400 && status < 500) {
            const errorMessage = data?.message || data?.error || "Bad Request";
            toast.error("Request Failed", {
                description: errorMessage,
            });
        } else {
            const errorMessage = data?.message || "An unexpected error occurred";
            toast.error("Error", {
                description: errorMessage,
            });
        }

        return Promise.reject(error);
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

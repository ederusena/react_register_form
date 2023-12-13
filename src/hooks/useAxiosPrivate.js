import { axiosPrivate } from "../api/axios";
import { useEffect } from "react";
import useRefreshToken from "./useRefreshToken";
import useAuth from "./useAuth";

const useAxiosPrivate = () => {
    // Custom hooks for token refresh and authentication information
    const refresh = useRefreshToken();
    const { auth } = useAuth();

    useEffect(() => {
        // Intercepting Axios requests and responses
        const requestIntercept = axiosPrivate.interceptors.request.use(
            // Intercepting the request before it is sent
            config => {
                if (!config.headers['Authorization']) {
                    config.headers['Authorization'] = `Bearer ${auth?.accessToken}`;
                }
                return config;
            },
            // Handling request interception errors
            error => Promise.reject(error)
        );

        const responseIntercept = axiosPrivate.interceptors.response.use(
            // Intercepting the response before it is processed
            response => response,
            // Handling response interception errors
            async (error) => {
                const prevRequest = error?.config;
                // If the response status is 403 (forbidden) and the request hasn't been retried
                if (error?.response?.status === 403 && !prevRequest?.sent) {
                    prevRequest.sent = true;
                    // Refresh the access token
                    const newAccessToken = await refresh();
                    // Update the request header with the new access token
                    prevRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                    // Retry the original request with the updated token
                    return axiosPrivate(prevRequest);
                }
                // Reject the promise with the original error if not a 403 or if retried
                return Promise.reject(error);
            }
        );

        // Clean up the interceptors when the component unmounts or dependencies change
        return () => {
            axiosPrivate.interceptors.request.eject(requestIntercept);
            axiosPrivate.interceptors.response.eject(responseIntercept);
        }
    }, [auth, refresh]);

    // Return the modified axiosPrivate instance
    return axiosPrivate;
}
export default useAxiosPrivate;
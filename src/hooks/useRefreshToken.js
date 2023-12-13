import axios from '../api/axios';
import useAuth from './useAuth';

const useRefreshToken = () => {
    const { setAuth } = useAuth();

    // Define the refresh function, which makes a request to the '/refresh' endpoint
    const refresh = async () => {
        // Make a GET request to the '/refresh' endpoint with credentials (assuming it returns a new access token)
        const response = await axios.get('/refresh', {
            withCredentials: true
        });

        // Update the authentication state with the new access token
        setAuth(prev => {
            // Log the previous authentication state and the new access token for debugging
            console.log(JSON.stringify(prev));
            console.log(response.data.accessToken);

            // Return a new authentication state with the updated access token
            return { ...prev, accessToken: response.data.accessToken };
        });

        // Return the new access token
        return response.data.accessToken;
    };

    // Return the refresh function from the hook
    return refresh;
};

// Export the useRefreshToken hook as the default export
export default useRefreshToken;

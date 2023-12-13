// Import necessary dependencies from React and other modules
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import useUUID from "../hooks/useUUID";

// Functional component definition for Users
const Users = () => {
    // Custom hook to generate a new UUID each time
    const generateUUID = useUUID();

    // State hook to store the list of users
    const [users, setUsers] = useState();

    // Custom Axios hook for private requests (assuming it returns an axios instance)
    const axiosPrivate = useAxiosPrivate();

    // React Router hooks for navigation and location
    const navigate = useNavigate();
    const location = useLocation();

    // useEffect hook to fetch users when the component mounts
    useEffect(() => {
        // Flag to track whether the component is mounted
        let isMounted = true;

        // Create an AbortController for canceling the request if needed
        const controller = new AbortController();

        // Function to fetch users from the server
        const getUsers = async () => {
            try {
                // Make a GET request to retrieve users
                const response = await axiosPrivate.get('/users', {
                    signal: controller.signal
                });

                // Log the retrieved data and update the state (if component is still mounted)
                console.log(response.data);
                isMounted && setUsers(response.data);
            } catch (err) {
                // Log error and redirect to login page if authentication fails
                console.error(err);
                navigate('/login', { state: { from: location }, replace: true });
            }
        }

        // Call the getUsers function when the component mounts
        getUsers();

        // Cleanup function to handle component unmounting or updates
        return () => {
            isMounted = false;
            controller.abort();
        }
    }, []);

    // Render the Users component with a list of users (or a message if no users)
    return (
        <article>
            <h2>Users List</h2>
            {users?.length
                ? (
                    <ul>
                        {users.map((user) => <li key={generateUUID}>{user?.username}</li>)}
                    </ul>
                ) : <p>No users to display</p>
            }
        </article>
    );
};

// Export the Users component as the default export
export default Users;

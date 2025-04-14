import React, { useContext } from 'react';
import { AuthContext } from '../AuthContext';

const Profile = () => {
    const { user } = useContext(AuthContext);

    return (
        <div className="container mt-5">
            {user ? (
                <div className="p-4 border rounded shadow">
                    <h3>Welcome, {user.name}</h3>
                    <p>Email: {user.email}</p>
                </div>
            ) : (
                <div className="alert alert-danger">Unable to fetch user data. Please log in.</div>
            )}
        </div>
    );
};

export default Profile;

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { auth } from "../config/firebase";

function Login() {
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [checkingAuth, setCheckingAuth] = useState(true);

    // Check whether user is already logged in
    useEffect(() => {
        window.scrollTo(0, 0);

        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                // Already logged in: redirect to Home
                navigate('/home', { replace: true });
            } else {
                // Not logged in: show Login page
                setCheckingAuth(false);
            }
        });

        return () => unsubscribe();
    }, [navigate]);

    // Login function
    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');

        try {
            await signInWithEmailAndPassword(auth, email, password);
            navigate('/home', { replace: true });
        } catch (error) {
            console.log("Error signing in:", error);
            setError("Invalid email or password");
        }
    };

    // Wait until Firebase checks authentication
    if (checkingAuth) {
        return <div className="text-center mt-10">Checking login...</div>;
    }

    return (
        <div className="flex justify-center items-center h-screen bg-gray-100">

            <form
                onSubmit={handleLogin}
                className="p-10 bg-white rounded-lg shadow-md"
                style={{ width: "75%" }}
            >
                <h2 className="text-2xl font-bold mb-5 text-gray-800">
                    Login
                </h2>

                <div className="mb-4">
                    <label className="block text-gray-700">Email:</label>

                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="mt-1 p-2 w-full border rounded"
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700">Password:</label>

                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="mt-1 p-2 w-full border rounded"
                    />
                </div>

                <p className="text-red-600 my-2">{error}</p>

                <p
                    className="text-blue-600 cursor-pointer my-2"
                    onClick={() => navigate("/signup")}
                >
                    New user? Register here
                </p>

                <button
                    type="submit"
                    className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200 ease-in-out"
                >
                    Login
                </button>

            </form>
        </div>
    );
}

export default Login;
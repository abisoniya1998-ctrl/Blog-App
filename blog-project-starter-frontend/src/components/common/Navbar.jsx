import React, { useState, useEffect } from 'react';
import "./Navbar.css";
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../../config/firebase';
import { signOut } from 'firebase/auth';

function Navbar() {

  const navigate = useNavigate();
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setLoggedIn(true);
        console.log("User is logged in:", user);
      } else {
        setLoggedIn(false);
        console.log("User is logged out");
      }
    });

    

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.log("Logout error:", error);
    }
  };

  return (
    <div className="py-5 flex justify-between items-center">
      <h2 className="text-2xl font-bold">Personal</h2>

      <div className="flex items-center">
        <Link className="list-none px-5" to="/home">Home</Link>
        <Link className="list-none px-5" to="/blogs">Blogs</Link>
        <Link className="list-none px-5" to="/about">About</Link>

        {loggedIn ? (
          <button
            className="button-style hidden md:block"
            onClick={handleLogout}
          >
            Logout
          </button>
        ) : (
          <button
            className="button-style hidden md:block"
            onClick={() => navigate("/login")}
          >
            Login
          </button>
        )}
      </div>
    </div>
  );
}

export default Navbar;
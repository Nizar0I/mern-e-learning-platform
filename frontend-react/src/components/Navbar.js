import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode"; // or import { jwtDecode } from 'jwt-decode';
import { useCart } from "../context/CartContext"; // <-- Import your CartContext hook

const Navbar = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Access the cart state from CartContext
  const { cart } = useCart();

  useEffect(() => {
    checkLoggedInUser();
  }, []);

  const checkLoggedInUser = () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setUser(null);
        return;
      }
      const decoded = jwtDecode(token);
      // Example: if your token payload has "email" and "role"
      setUser({
        email: decoded.email,
        role: decoded.role,
      });
    } catch (error) {
      localStorage.removeItem("token");
      setUser(null);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/");
  };

  return (
    <header className="bg-white shadow sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-blue-600">
          StudyFi
        </Link>

        <nav className="space-x-4 flex items-center">
          {/* Courses Link */}
          <Link
            to="/courses"
            className="text-gray-600 hover:text-blue-600 transition"
          >
            Cours
          </Link>

          {/* Cart Link with badge */}
          <Link
            to="/cart"
            className="relative text-gray-600 hover:text-blue-600 transition"
          >
            Panier
            {cart.length > 0 && (
              <span className="absolute top-[-6px] right-[-12px] bg-red-600 text-white text-xs rounded-full px-2 py-0.5">
                {cart.length}
              </span>
            )}
          </Link>

          {/* If User is logged in */}
          {user ? (
            <>
              {/* If user is instructor, show a button to the instructor dashboard */}
              {user.role === "instructor" && (
                <Link
                  to="/instructor/dashboard"
                  className="text-gray-600 hover:text-blue-600 transition"
                >
                  Dashboard
                </Link>
              )}

              <span className="text-gray-600">
                Connecté en tant que <strong>{user.email}</strong>
                {user.role && ` (${user.role})`}
              </span>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
              >
                Se déconnecter
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-gray-600 hover:text-blue-600 transition"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
              >
                Sign Up
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;

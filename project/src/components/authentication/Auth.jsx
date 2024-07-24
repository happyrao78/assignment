import React, { useState, useEffect } from "react";
import { auth, provider } from "./firebase";
import { signInWithPopup, signOut } from "firebase/auth";
import { FaGoogle } from "react-icons/fa"; // Importing FontAwesome Google icon for better integration
import { FaChevronDown, FaChevronUp } from "react-icons/fa"; // Importing Chevron icons for dropdown

function Authentication({ onAuthStateChanged }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Added loading state
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // State for dropdown

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setLoading(false); // Set loading to false once auth state is determined
      if (user) {
        setUser(user);
        onAuthStateChanged(user);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe(); // Clean up subscription on component unmount
  }, [onAuthStateChanged]);

  const handleSignIn = () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        // Optional: handle additional actions after sign-in
      })
      .catch((error) => {
        console.error("Sign-in error:", error);
      });
  };

  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        setUser(null); // Update local state after sign-out
      })
      .catch((error) => {
        console.error("Sign-out error:", error);
      });
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen text-lg">Loading...</div>;
  }

  return (
    <div className="relative flex flex-col bg-white dark:bg-blue-200 dark:transition ease-linear duration-500 p-4">
      {!user ? (
        <div className="flex justify-center items-center flex-grow">
          <button
            onClick={handleSignIn}
            className="flex items-center justify-center bg-blue-500 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-300 ease-in-out w-full max-w-md sm:max-w-sm"
          >
            <FaGoogle className="mr-3 text-xl" />
            <span className="text-lg font-semibold">Sign in with Google</span>
          </button>
        </div>
      ) : (
        <>
          <div
            className="absolute top-4 right-4 flex items-center cursor-pointer"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <img
              src={user.photoURL}
              alt="User Profile"
              className="w-10 h-10 rounded-full"
            />
            <span className="text-lg font-bold text-gray-900 dark:text-white ml-2">
              {isDropdownOpen ? <FaChevronUp /> : <FaChevronDown />}
            </span>
          </div>
          {isDropdownOpen && (
            <div className="absolute top-16 right-4 bg-white dark:bg-blue-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-4 w-48 mt-2">
              <div className="flex items-center space-x-2 mb-2">
                <img
                  src={user.photoURL}
                  alt="User Profile"
                  className="w-12 h-12 rounded-full"
                />
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  Hello, {user.displayName}!
                </h3>
              </div>
              <button
                onClick={handleSignOut}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 transition duration-300 ease-in-out w-full text-sm"
              >
                Sign Out
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Authentication;

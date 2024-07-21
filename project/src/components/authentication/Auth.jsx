import React, { useState, useEffect } from "react";
import { auth, provider, db } from "./firebase";
import { signInWithPopup, signOut } from "firebase/auth";

function Authentication() {
  const [user,setUser]= useState(null);
  useEffect(()=>{
    auth.onAuthStateChanged((user)=>{
      if(user){
        setUser(user);
      }
      else{
        setUser(null);
      }
    })
  },[])
  const handleSignIn=()=>{
    signInWithPopup(auth,provider);
  }
  const handleSignOut=()=>{
    signOut(auth);
  }

  return (
    <>
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-3xl font-bold mb-8">Google Sign In</h1>
      {!user ? (
        <button
          onClick={handleSignIn}
          className="bg-blue-500 text-white px-4 py-2 rounded flex items-center"
        >
          <i className="fab fa-google mr-2"></i> Sign in with Google
        </button>
      ) : (
        <div>
          <div className="mb-4">
            <h3 className="text-xl">Hello, {user.displayName}!</h3>
          </div>
          
          <button
            onClick={handleSignOut}
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            Sign Out
          </button>
        </div>
      )}
    </div>
  
    </>
  )
}

export default Authentication;

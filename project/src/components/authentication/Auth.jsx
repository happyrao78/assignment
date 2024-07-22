import React, { useState, useEffect } from "react";
import { auth, provider, db } from "./firebase";
import { signInWithPopup, signOut } from "firebase/auth";

function Authentication({onAuthStateChanged}) {
  const [user,setUser]= useState(null);
  useEffect(()=>{
    auth.onAuthStateChanged((user)=>{
      if(user){
        setUser(user);
        onAuthStateChanged(user);
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
        <div className="flex flex-col items-center justify-center ">
      {/* <h1 className="text-3xl font-bold mb-8">Google Sign In</h1> */}
      {!user ? (
        <button
          onClick={handleSignIn}
          className="bg-blue-500 text-white px-4 py-2 rounded flex items-center mt-5 justify-center"
        >
          <i className="fab fa-google mr-2"></i> Sign in with Google
        </button>
      ) : (
        <div className=" flex top-0 right-0 items-center absolute p-4 space-x-4">
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

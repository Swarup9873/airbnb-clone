import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../../contexts/UserContext";
import { Navigate } from "react-router-dom";
import axios from "axios";
import "./profilePage.css";
const ProfilePage = () => {
  const [redirect, setRedirect] = useState(null);
  const { user, userReady, setUser } = useContext(UserContext);

  if (redirect) return <Navigate to={redirect} />;

  if (!userReady) {
    return "Loading...";
  }
  if (userReady && !user) {
    return <Navigate to={"/login"} />;
  }

  async function logout() {
    await axios.post("/logout");
    setUser(null);
    setRedirect("/");
  }

  const InitialIcon = ({ initials }) => {
    return (
      <div className='flex bg-neutral-800 items-center justify-center rounded-full w-28 h-28 md:w-36 md:h-36'>
        <p className="text-white text-7xl font-semibold pb-2 md:text-8xl">{initials}</p>
      </div>
    );
  };

  return (
    <div className="profileWhole">
      <div className="profileBody">
        <div className="profileBox">
            <div className="profileNameLogo">
                <InitialIcon initials={user.name.charAt(0).toUpperCase()} />
            </div>
            <div className="profileDetails">
                <p>Logged in as</p>
                <p className="profileName">{user.name}</p>
                <p className="profileEmail">({user.email})</p>
            </div>
        </div>
        <div className="horLine"></div>
        <div className="verifyBlock">
            <p className="verifyHead">{user.name.split(" ")[0]}'s confirmed information</p>
            <p className="verifyText">
                {user.verified?
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7">yes
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                    
                    :
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                }
                Email Address
            </p>
        </div>
        
        <div className="horLine"></div>

        <button className="logoutBut" onClick={logout}> Log out</button>
      </div>
    </div>
  );
};

export default ProfilePage;

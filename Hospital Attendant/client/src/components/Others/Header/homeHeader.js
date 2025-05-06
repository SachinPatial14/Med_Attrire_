import React from "react";
import "./homeHeader.css" ;
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse ,faUser } from '@fortawesome/free-solid-svg-icons';
import { useState ,useEffect} from "react";
import { useNavigate } from "react-router-dom";


const HomeHeader = ()=>{
    const [openProfile,setOpenProfile] = useState(false);
    const [profileActive,setProfileActive] = useState(false);
    const [hoverProfile,setHoverProfile] = useState(false);
    const[user,setUser] = useState({});

    const navigate  = useNavigate();

    const handleProfileClick = ()=>{
        setOpenProfile(true);
        setProfileActive(true);
    }

    const closeProfile =()=>{
        setOpenProfile(false);
        setProfileActive(false);
    }

    const fetchCrenditals = ()=>{
        const localUser = JSON.parse(localStorage.getItem("userdata"));
        if(localUser){
            setUser(localUser);
        };
    };
            

    useEffect(()=>{
        fetchCrenditals();
    },[]);

    const handleLogout = () => {
        if (window.confirm("Are you sure you want to logout?")) {
          localStorage.removeItem("userdata");
          localStorage.removeItem("token");
          navigate("/");
        }
      };
      
      
      

    return(<>
    <div id="homeHeader">
        <div id="homeHeaderElements">
           <img id="logoHome" src="/medlogo.jpeg" alt="logo image" />
           <p>MedAttire</p>
           <div id="navLinks">
                 <ul id="links">
                    <li><a id="active"><FontAwesomeIcon icon={faHouse} /></a></li>
                    <li><a onClick={handleProfileClick} onMouseEnter={()=>setHoverProfile(true)} onMouseLeave={()=> setHoverProfile(false)} style={{color:profileActive?"#ffd700":hoverProfile?"#ffd700":"#fff"}}><FontAwesomeIcon icon={faUser} /></a></li>
                 </ul>
             </div>
        </div>
    </div>

    {/* profile model */}

    <div id="profile" style={{display:openProfile?"block":"none"}}>
        <div id="fullName">
            <h2>Name:<h6>{user.name}</h6></h2>
        </div>
        <div id="btnDiv">
        <button id="logOut" onClick={handleLogout}>Log out</button>
        <button id="close" onClick={closeProfile}>Close</button>
        </div>
    </div>

    </>)
}

export default HomeHeader ;

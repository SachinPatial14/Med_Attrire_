import React from "react";
import "./authHeader.css" ;

const AuthHeader = ()=>{
    return (<>
    <div id="authHeader">
        <div id="headerElements">
           <img id="logoAuth" src="/medlogo.jpeg" alt="logo image" />
           <p>MedAttire</p>
        </div>
    </div>
    </>)
}

export default AuthHeader ;
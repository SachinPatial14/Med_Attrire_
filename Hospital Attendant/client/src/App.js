import React from "react" ;
import {BrowserRouter, Routes,Route} from "react-router-dom" ;
import Auth from "./components/Auth/auth";
import Home from "./components/home/home";
import ProtectedRoute from "./protectedRoute";

const App = ()=>{
    return(<>
    <BrowserRouter>
    <Routes>
    <Route path="/" element={< ProtectedRoute fallback={Auth} />} />
    <Route  path="/home" element={<Home />}/>
    </Routes>
    </BrowserRouter>
    </>)
}

export default App ;
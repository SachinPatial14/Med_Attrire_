import React, { useState } from "react";
import "./auth.css";
import AuthHeader from "../Others/Header/authHeader.js";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Auth = () => {
  const [isLogincontainer, setIsLoginContainer] = useState(true);
  const [data, setData] = useState({
    name: "",
    username: "",
    password: "",
    role: "",
    confirmpassword: "",
    loginUsername: "",
    loginPassword: "",
  });

  const navigate = useNavigate();

  const handleSwitchLC = (event) => {
    event.preventDefault();
    setIsLoginContainer(false);
  };

  const handleSwitchBackLC = (e) => {
    e.preventDefault();
    setIsLoginContainer(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSetupAccount = async (event) => {
    event.preventDefault();

    if (!data.name || !data.username || !data.password || !data.role) {
      window.alert("All fields are required!");
      return;
    }


    try {
      const response = await axios.post(
        "http://localhost:7071/createAccount",
        {
          name: data.name,
          username: data.username,
          password: data.password,
          role: data.role,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 201) {
        window.alert(response.data.message);
        setIsLoginContainer(true);
        setData({
          name: "",
          username: "",
          password: "",
          confirmpassword: "",
          role: "",
          loginUsername: "",
          loginPassword: "",
        });
      }
    } catch (err) {
      console.log(err);
      window.alert(
        err.response?.data?.message ||
          "An error occurred while creating the account."
      );
    }
  };

  const handleCheckUserDetails = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post("http://localhost:7071/loginUser", {
        username: data.loginUsername,
        password: data.loginPassword,
      });

      if (response.status === 200) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("userdata", JSON.stringify(response.data.user));
        navigate("/home");
      }
    } catch (err) {
      console.log(err);
      window.alert(
        err.response?.data?.message || "An error occurred while logging in."
      );
    }
  };

  return (
    <>
      <AuthHeader />

      {/* Login Container */}
      <div
        id="loginContainer"
        style={{ display: isLogincontainer ? "block" : "none" }}
      >
        <h2>Login Account</h2>
        <form id="loginArea" onSubmit={handleCheckUserDetails}>
          <label htmlFor="loginUsername">Username or Email</label>
          <input
            type="text"
            id="loginUsername"
            placeholder="Enter your username or email"
            name="loginUsername"
            value={data.loginUsername}
            onChange={handleInputChange}
            required
          />
          <label htmlFor="loginPassword">Password</label>
          <input
            type="password"
            id="loginPassword"
            placeholder="Enter your password"
            name="loginPassword"
            value={data.loginPassword}
            onChange={handleInputChange}
            required
          />
          <button id="loginSubmit" type="submit">
            Login
          </button>
          <p id="loginPara">
            Don't have an account?{" "}
            <span id="loginSpan" onClick={handleSwitchLC}>
              Create Account
            </span>
          </p>
        </form>
      </div>

      {/* Signup Container */}
      <div
        id="signContainer"
        style={{ display: !isLogincontainer ? "block" : "none" }}
      >
        <h2>SignUp Account</h2>
        <form id="signupArea" onSubmit={handleSetupAccount}>
          <label htmlFor="name">Full Name</label>
          <input
            type="text"
            placeholder="Enter Your Full Name"
            id="name"
            name="name"
            value={data.name}
            onChange={handleInputChange}
            required
          />
          <label htmlFor="userName">Username</label>
          <input
            type="text"
            placeholder="Create username"
            id="userName"
            name="username"
            value={data.username}
            onChange={handleInputChange}
            required
          />
          <label htmlFor="role">Role:</label>
          <select
            id="role"
            name="role"
            value={data.role}
            onChange={handleInputChange}
            required
          >
            <option value="">Select role</option>
            <option value="Patient">Patient</option>
            <option value="Doctor">Doctor</option>
            <option value="Attendant">Attendant</option>
          </select>
          <label htmlFor="setPassword">Set Password</label>
          <input
            id="setPassword"
            placeholder="Set password"
            type="password"
            name="password"
            value={data.password}
            onChange={handleInputChange}
            required
          />
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            id="confirmPassword"
            type="password"
            placeholder="Confirm password"
            name="confirmpassword"
            value={data.confirmpassword}
            onChange={handleInputChange}
            required
          />
          <button id="signupBtn" type="submit">
            Sign up
          </button>
          <p id="signupPara">
            Already have an account?{" "}
            <span id="signupSpan" onClick={handleSwitchBackLC}>
              Login
            </span>
          </p>
        </form>
      </div>
    </>
  );
};

export default Auth;

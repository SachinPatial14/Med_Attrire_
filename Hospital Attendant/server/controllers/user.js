import jwt from "jsonwebtoken";
import User from "../models/user.js";

export const createUser = async (req, res) => {
  try {
    const { name, username, password , role } = req.body;

    if (!name || !username || !password || !role) {
      return res.status(400).json({ message: "All required fields must be provided!" });
    }

    const existingUser = await User.findOne({ username });

    if (existingUser) {
      return res.status(400).json({ message: "This username is already in use. Try a different one!" });
    }

    const newUser = await User.create({ name, username, password , role });

    const token = jwt.sign(
      { userid: newUser._id, username: newUser.username },
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c",
      { expiresIn: "1d" }
    );

    res.status(201).json({
      message: "Account has been set up successfully, now you can login!",
      user: {
        id: newUser._id,
        name: newUser.name,
        username: newUser.username,
        role: newUser.role,
      },
      token,
    });
  } catch (error) {
    console.error("error creating user:", error);
    res.status(500).json({ message: "An error occurred while creating the account" });
  }
};

export const loginUser = async (req, res) => {
    try {
      const { username, password } = req.body;
      const user = await User.findOne({ username });
      if (!user)
        return res
          .status(401)
          .json({ message: "The account you are looking for does not exist!" });
      const isPasswordValid = await user.comparePassword(password);
      if (!isPasswordValid)
        return res
          .status(401)
          .json({ message: "Wrong email or password entered!!" });
      const token = jwt.sign(
        { userId: user._id, username: user.username,},
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c",
        { expiresIn: "1d" }
      );
      res.status(200).json({ message: "successfully logged in!!", user, token });
    } catch (error) {
      console.error("Error logging in user:", error);
      res.status(500).json({ message: "An error occurred while logging in." });
    }
  };
  
  export const userRole = async (req,res) =>{
    const { id } = req.params;
  const { role } = req.body;
  const allowedRoles = ["Doctor", "Patient", "Attendant"];

  if (!allowedRoles.includes(role)) {
    return res.status(400).json({ error: "Invalid role provided" });
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { role },
      { new: true, runValidators: true }
    );
    
    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }
    
    return res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Error updating user role:", error);
    return res.status(500).json({ error: "Server error" });
  }
  };

  export const getDoctors = async (req,res) =>{
    try {
      const doctors = await User.find({ role: "Doctor" }).select("name");
      res.status(200).json({ success: true, doctors });
    } catch (error) {
      res
        .status(500)
        .json({ success: false, message: "Error retrieving doctors", error: error.message });
    }
  };

  export const getAttendants = async (req,res) =>{
    try {
      const attendants = await User.find({ role: "Attendant" }).select("name");
      res.status(200).json({ success: true, attendants });
    } catch (error) {
      res
        .status(500)
        .json({ success: false, message: "Error retrieving attendants", error: error.message });
    }
  };




const bcrypt = require("bcrypt");
const UserModel = require("../Models/User");
const jwt = require("jsonwebtoken");
const {OAuth2Client}= require("google-auth-library");
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const Signup = async (req, res) => {

  try {
  
    const { name, email, password } = req.body;
    const user = await UserModel.findOne({ email });
    if (user) {
      return res
        .status(400)
        .json({ message: "user already exists", success: false });
    }
    const userModel = new UserModel({ name, email, password });
    userModel.password = await bcrypt.hash(password, 10);
    await userModel.save();
   res.status(201).json({ message: "User registered successfully", success: true , _id: userModel._id, name:userModel.name, email:userModel.email});
   console.log("Request Body:", req.body);
  } catch (error) {
    res.status(500).json({ message: "Internal server error", success: false });
  }
};
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email });
    const errorMsg = "Auth Failed email or password is incorrect";
    if (!user) {
      return res.status(403).json({ message: errorMsg, success: false });
    }
    const ispasswordMatch = await bcrypt.compare(password, user.password);
    if (!ispasswordMatch) {
      return res.status(403).json({ message: errorMsg, success: false });
    }
    const jwtToken = jwt.sign(
      { email: user.email, _id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "24h" },
    );

    res
      .status(200)
      .json({
        message: "Login successful",
        success: true,
        jwtToken,
        user:{
          _id: user._id,
          email: user.email,
          name: user.name,
        }
      });
  } catch (error) {
      console.log("LOGIN ERROR:", error);
    res.status(500).json({ message: "Internal server error", success: false });
  }
};

// Google login 
 const googleLogin = async (req, res) => {
  try {
      console.log("Body received:", req.body); 
  const { credential } = req.body;
 if (!credential) {
      return res.status(400).json({
        success: false,
        message: "Token missing",
      });
    }
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name } = payload;

    let user = await UserModel.findOne({ email });

    if (!user) {
      user = await UserModel.create({ email, name });
    }

    const jwtToken = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.json({
      success: true,
      jwtToken,
      user
    });

  } catch (error) {
    console.log(error);
    return res.json({
      success: false,
      message: "Google authentication failed"
    });
  }
};
module.exports = {
  Signup,
  login,
  googleLogin

};

import express from "express";
import { auth } from "express-openid-connect";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import connect from "./db/connect.js";
import asyncHandler from "express-async-handler";
import fs from "fs";
import User from "./models/UserModel.js";

dotenv.config();

const app = express();

// Auth config
const config = {
  authRequired: false,
  auth0Logout: true,
  secret: process.env.SECRET || "this_is_a_dev_secret_key",
  baseURL: process.env.BASE_URL || "http://localhost:5000",
  clientID: process.env.CLIENT_ID || "dev-client-id",
  issuerBaseURL: process.env.ISSUER_BASE_URL || "http://localhost:5000",
  routes: {
    postLogoutRedirect: process.env.CLIENT_URL || "http://localhost:3000",
    callback: "/callback",
    logout: "/logout",
    login: "/login",
  },
  session: {
    absoluteDuration: 30 * 24 * 60 * 60 * 1000, // 30 days
    cookie: {
      // Use secure cookies only in production/HTTPS. When SameSite is 'None' the cookie
      // must also be Secure according to browser rules. For local development over
      // HTTP keep secure=false and SameSite='Lax'.
      secure: process.env.NODE_ENV === "production",
      sameSite:
        process.env.NODE_ENV === "production" ? "None" : "Lax",
      // remove domain entirely for local dev
    },
  },
};

// CORS
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    exposedHeaders: ["set-cookie"],
  })
);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Auth0
app.use(auth(config));

// Ensure user exists in DB
const enusureUserInDB = asyncHandler(async (user) => {
  try {
    const existingUser = await User.findOne({ auth0Id: user.sub });
    if (!existingUser) {
      const newUser = new User({
        auth0Id: user.sub,
        email: user.email,
        name: user.name,
        role: "jobseeker",
        profilePicture: user.picture,
      });
      await newUser.save();
      console.log("User added to db", user);
    } else {
      console.log("User already exists in db", existingUser);
    }
  } catch (error) {
    console.log("Error checking or adding user to db", error.message);
  }
});

// Root route
app.get("/", async (req, res) => {
  if (req.oidc.isAuthenticated()) {
    await enusureUserInDB(req.oidc.user);
    return res.redirect(process.env.CLIENT_URL || "http://localhost:3000");
  } else {
    return res.send("Logged out");
  }
});

// Dynamic routes
const routeFiles = fs.readdirSync("./routes");
routeFiles.forEach((file) => {
  import(`./routes/${file}`)
    .then((route) => {
      app.use("/api/v1/", route.default);
    })
    .catch((error) => {
      console.log("Error importing route", error);
    });
});

// Start server
const server = async () => {
  try {
    await connect();
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.log("Server error", error.message);
    process.exit(1);
  }
};

server();

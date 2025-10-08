import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

// adding the middleware to allows cross origin resource sharing
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

// adding the middleware to get the data from the json format of certain limit

app.use(express.json({ limit: "16kb" }));

// adding the middleware to understand the requirement from the URL
app.use(express.urlencoded({ extended: true, limit: "16kb" }));

// allowing the folder for all users
app.use(express.static("public"));

// for Cookies
app.use(cookieParser());

export default app;

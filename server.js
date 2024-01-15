import express from "express";
import connectDB from "./config/index.js";
import cors from "cors";
import session from "express-session";

import passport from "passport";

//const express = require("express");
import { fileURLToPath } from "url";
import { join, dirname } from "path";
import exphbs from "express-handlebars";
import homeRouter from "./routes/index.js";
import helpers from "./helpers/index.js";
import userRouter from "./routes/api/users.js";
import bodyParser from "body-parser";
import dashboardrouter from "./routes/dashboard.js";
import authRouter from "./routes/api/auth.js";
import profileRouter from "./routes/api/profile.js";
import cookieParser from "cookie-parser";
import profileUIRouter from "./routes/profile.js";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
console.log(__dirname);
const app = express();
const PORT = 3010;
app.use(bodyParser.urlencoded({ extended: false }));
connectDB();
// to get the req data in terms of json
app.use(express.json());
// cors support
app.use(cors());
// refer teh static contnet
app.use(
  express.static(join(__dirname, "public"), {
    extensions: ["html", "htm", "js"],
  })
);
app.use(cookieParser());
app.use(passport.initialize());
// app.use(passport.session());
// app.use((req, res, next) => {
//   res.locals.login = req.isAuthenticated();
//   res.locals.session = req.session;
//   next();
// });
// express hbs integration.

// by setting up the engine hbs seettings
app.engine("hbs", exphbs.engine({ extname: ".hbs", helpers }));
app.set("view engine", ".hbs");
app.set("views", join(__dirname, "views"));

// routes

app.use("/", homeRouter);
app.use("/api/profile", profileRouter);
app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
app.use("/dashboard", dashboardrouter);
app.use("/profile", profileUIRouter);
app.listen(PORT, () => {
  console.log("server started");
  console.log(`Server running on port ${PORT}`);
});

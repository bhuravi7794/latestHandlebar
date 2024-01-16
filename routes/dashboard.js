import express from "express";
import navbarData from "../data/navbarData.js";

import authenticate from "../middleware/auth.js";
import { actionData, dashboardData } from "../data/dashboardData.js";
import axiosObject from "../utils/axiosObject.js";

const dashboardrouter = express.Router();

dashboardrouter.get("", authenticate, async (req, res) => {
  // console.log(req.user);
  // console.log(req.cookies);

  const user = req.user;
  console.log("user details " + JSON.stringify(req.user));
  // we have to perform the rest call.
  const data = dashboardData;
  await axiosObject
    .get("/profile/me", {
      headers: { Cookie: `jwtToken=${req.cookies.jwtToken}` },
    })
    .then((response) => {
      data.profile = response.data;
    })
    .catch((err) => {
      console.log(err.response.data);
      data.profile = null;
    });

  //console.log(data.profile.education);
  console.log(user.name + "user data");
  res.render("dashboard/dashboard", {
    dashboard: data,
    user,
    navbar: navbarData,
    actionData,
  });
});

export default dashboardrouter;

import express from "express";
import navbarData from "../data/navbarData.js";

import authenticate from "../middleware/auth.js";
import { actionData, dashboardData } from "../data/dashboardData.js";
import axiosObject from "../utils/axiosObject.js";
import {
  addEducation,
  addExperience,
  createProfile,
} from "../controllers/profileCreateController.js";

const profileUIRouter = express.Router();
profileUIRouter.get("/create", (req, res) => {
  res.render("profile/forms/CreateProfile", { navbar: navbarData });
});
profileUIRouter.get("/addExperience", authenticate, (req, res) => {
  res.render("profile/forms/addExperience", { navbar: navbarData });
});

profileUIRouter.post("/addExperience", authenticate, addExperience);
profileUIRouter.get("/addEducation", authenticate, (req, res) => {
  res.render("profile/forms/addEducation", { navbar: navbarData });
});

profileUIRouter.post("/addEducation", authenticate, addEducation);
profileUIRouter.post("/create", authenticate, createProfile);

export default profileUIRouter;

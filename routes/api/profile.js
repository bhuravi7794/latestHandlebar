import {
  createProfile,
  getProfile,
  getProfileByGithub,
  getProfileByUserId,
  getProfiles,
} from "../../controllers/profileController.js";
import { authenticateUser } from "../../controllers/users.js";
import authenticate from "../../middleware/auth.js";
import ProfileModel from "../../models/ProfileModel.js";

import express from "express";

const profileRouter = express.Router();

profileRouter.post("", authenticate, createProfile);
profileRouter.get("/me", authenticate, getProfile);
profileRouter.get("", getProfiles);
profileRouter.get("/:user_id", getProfileByUserId);
profileRouter.get("/github/:username", getProfileByGithub);
export default profileRouter;

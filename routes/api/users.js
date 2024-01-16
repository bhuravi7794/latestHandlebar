// 1st we need to render the template
// 2nd we need to handle the rest call.
import express from "express";
import { check, validationResult } from "express-validator";
import navbarData from "../../data/navbarData.js";
import {
  authenticateUser,
  getFooter,
  getNavBar,
  getRegisterUser,
  registerUser,
} from "../../controllers/users.js";

const router = express.Router();

router.get("/register", getRegisterUser);
router.post("/register", registerUser);
router.get("/navbar", getNavBar);
router.get("/footer", getFooter);
//router.get("/auth", authenticateUser);
export default router;

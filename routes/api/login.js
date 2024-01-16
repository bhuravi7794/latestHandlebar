import express from "express";
import { login, loginPost } from "../../controllers/login.js";
const router = express.Router();

router.get("", login);
router.post("", loginPost);

export default router;

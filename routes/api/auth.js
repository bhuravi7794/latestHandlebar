import { authenticateUser } from "../../controllers/users.js";
import authenticate from "../../middleware/auth.js";
import UserModel from "../../models/UsersModel.js";

import express from "express";

const authRouter = express.Router();

authRouter.get("/", authenticate, authenticateUser);
export default authRouter;

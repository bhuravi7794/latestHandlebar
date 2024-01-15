import navbarData from "../data/navbarData.js";
import bcrypt from "bcryptjs";
// validation api : express-validator lib
import jwt from "jsonwebtoken";
import { check, validationResult } from "express-validator";
import LoginModel from "../models/LoginModel.js";
const login = (req, res) => {
  res.render("auth/login");
};

const loginPost = (req, res) => {
  check("email", "Please include a valid email").isEmail(),
    check(
      "password",
      "Please enter a password with 6 or more characters"
    ).notEmpty(),
    async (req, res) => {
      console.log(req.body);
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, password } = req.body;

      try {
        user = new LoginModel({
          email,
          password,
        });

        const salt = await bcrypt.genSalt(10);

        user.password = await bcrypt.hash(password, salt);

        await user.save();

        const payload = {
          user: {
            id: user.id,
          },
        };

        jwt.sign(
          payload,
          "jwtSecret",
          { expiresIn: "5 days" },
          (err, token) => {
            if (err) throw err;
            res.json({ token });
          }
        );
      } catch (err) {
        console.error(err);
        res.status(500).send("Server error");
      }
    };
};

export { login, loginPost };

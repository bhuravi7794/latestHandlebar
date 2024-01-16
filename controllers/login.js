import navbarData from "../data/navbarData.js";
import bcrypt from "bcryptjs";
// validation api : express-validator lib
import jwt from "jsonwebtoken";
import { check, validationResult } from "express-validator";
import LoginModel from "../models/LoginModel.js";
import UserModel from "../models/UsersModel.js";

const login = (req, res) => {
  res.render("auth/login");
};

const loginPost =
  (check("email", "Please include a valid email").isEmail(),
  check(
    "password",
    "Please enter a password with 6 or more characters"
  ).notEmpty(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      let user = await UserModel.findOne({ email });
      console.log("users", user);
      if (!user) {
        return res
          .status(400)
          .json({ errors: [{ msg: "User Not Exist Please SignUp" }] });
      }
      let result;
      if (user) {
        await bcrypt.compare(password, user.password, function (err, result) {
          // execute code to test for access and login
          console.log(result);
        });
      }

      const payload = {
        user: {
          id: user.id,
          name: user.name,
        },
      };

      jwt.sign(payload, "jwtSecret", { expiresIn: "5 days" }, (err, token) => {
        if (err) throw err;
        //res.json({ token });
        // it should redirect us to dashboard .
        // return res.render("dashboard/dashboard", {
        //   jwtToken: { token },
        //   navbar: navbarData,
        // });

        res.cookie("jwtToken", token, { maxAge: 900000, httpOnly: true });
        res.redirect("/dashboard");
        // cookies
        // we should go for server side sessioning / db based token validations.
      });
    } catch (err) {
      console.error(err);
      res.status(500).send("Server error");
    }
  });

export { login, loginPost };

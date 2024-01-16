import navbarData from "../data/navbarData.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
// validation api : express-validator lib
import { check, validationResult } from "express-validator";
import UserModel from "../models/UsersModel.js";

const authenticateUser = async (req, res) => {
  try {
    const user = await UserModel.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    res.status(500).send("server error");
  }
};

const getRegisterUser = (req, res) => {
  res.render("auth/register", { navbar: navbarData });
};

// const registerUser2 =
//   // this final validated data we will pass it to our model.

//   (check("name", "Name is required").notEmpty(),
//   check("email", "Please include a valid email").isEmail(),
//   check(
//     "password",
//     "Please enter a password with 6 or more characters"
//   ).isLength({ min: 6 }),
//   async (req, res) => {
//     // we need to validate the data,

//     // finally we will share the token / error details as per the scenario

//     // req.body : new user data / json object.
//     console.log(JSON.stringify(req.body));
//     const { name, email, password } = req.body;

//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       console.log(errors);
//     }

//     try {
//       let user = null;

//       console.log("inside the try ");
//       const salt = await bcrypt.getnSalt(10);
//       user = new UserModel({ name, email, password });
//       user.password = await bcrypt.hash(password, salt);
//       console.log("input value" + JSON.stringify(user));
//       const result = await user.save();
//       console.log("final result " + JSON.stringify(result));
//       // then we will call save method to store the details in our DB.
//       return res.json(user);
//     } catch (err) {
//       console.log("inside the error handler");
//       console.log(JSON.stringify(err));
//     }
//     console.log("register user post called");
//   });

const registerUser =
  (check("name", "Name is required").notEmpty(),
  check("email", "Please include a valid email").isEmail(),
  check(
    "password",
    "Please enter a password with 6 or more characters"
  ).isLength({ min: 6 }),
  async (req, res) => {
    console.log(req.body);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    try {
      let user = await UserModel.findOne({ email });

      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: "User already exists" }] });
      }

      user = new UserModel({
        name,
        email,

        password,
      });

      const salt = await bcrypt.genSalt(10);

      user.password = await bcrypt.hash(password, salt);

      await user.save();

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

const getNavBar = (req, res) => {
  res.render("auth/navbar", { navbar: navbarData });
};
const getFooter = (req, res) => {
  res.render("auth/footer", { navbar: navbarData });
};
export {
  authenticateUser,
  getRegisterUser,
  registerUser,
  getNavBar,
  getFooter,
};

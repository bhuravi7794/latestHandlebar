import express from "express";
import navbarData from "../data/navbarData.js";

const homeRouter = express.Router();

homeRouter.get("", (req, res) => {
  console.log("hello from abhi");
  // return anything  : no.
  // it should render the hbs file.

  const landingData = {
    signup: "Signup",
    login: "Login",
    appName: "Dev",
  };
  res.render("pages/landing", { navbar: navbarData, landing: landingData });
});

export default homeRouter;

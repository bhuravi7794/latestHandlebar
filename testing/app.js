// app.js
const express = require("express");
const exphbs = require("express-handlebars");

const app = express();

app.engine("handlebars", exphbs());
app.set("view engine", "handlebars");

app.get("/navbar", (req, res) => {
  res.render("auth/navbar", {
    navbar: {
      title: "My App",
      developers: "Developers",
      register: "Register",
      login: "Login",
    },
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

module.exports = app; // Export the app for testing purposes

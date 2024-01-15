import jwt from "jsonwebtoken";

const authenticate = (req, res, next) => {
  console.log("hello from middleware");
  const token = req.cookies.jwtToken;
  // with extracting the toke from cookie
  console.log("token value ", token);
  // If the token is there or not
  if (!token) {
    return res.status(401).json({ msg: "no token, authorization denied" });
  }
  // verify the token
  try {
    console.log("inside the try middleware");
    res.cookie("jwtToken", token);
    jwt.verify(token, "jwtSecret", (error, decoded) => {
      if (error) {
        console.log("error details", error);
        return res.status(401).json({ msg: "token is not valid" });
      } else {
        req.user = decoded.user;
        next();
      }
    });
  } catch (err) {
    console.log("something went wrong with middleware");
    res.status(500).json({ msg: "server error" });
  }
};

export default authenticate;

const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(" ")[1];

    jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, user) => {
      if (err) {
        return res
          .status(403)
          .json({ status: false, message: "Invalid Token" });
      }

      req.user = user;
      next();
    });
  } else {
    return res
      .status(401)
      .json({ ststus: false, message: "You're not authenticated!" });
  }
};

module.exports = { verifyToken };

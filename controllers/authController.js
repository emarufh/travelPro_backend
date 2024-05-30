const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

module.exports = {
  createUser: async (req, res, next) => {
    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: CryptoJS.AES.encrypt(
        req.body.password,
        process.env.SECRET_KEY
      ).toString(),
    });

    try {
      await newUser.save();

      res
        .status(201)
        .json({ status: true, message: "User Successfully Created" });
    } catch (error) {
      return next(error);
    }
  },

  loginUser: async (req, res, next) => {
    try {
      const user = await User.findOne({ email: req.body.email });

      if (!user) {
        return res
          .status(401)
          .json({ status: false, message: "User Not Found" });
      }

      const decryptedPassword = CryptoJS.AES.decrypt(
        user.password,
        process.env.SECRET_KEY
      );
      const decryptedString = decryptedPassword.toString(CryptoJS.enc.Utf8);

      if (decryptedString !== req.body.password) {
        return res
          .status(401)
          .json({ status: false, message: "Wrong Password" });
      }

      const userToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, {
        expiresIn: "21d",
      });

      const userId = user._id;
      res.status(200).json({ status: true, id: userId, token: userToken });
    } catch (error) {
      return next(error);
    }
  },
};

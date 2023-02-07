const express = require("express");
const router = express.Router();
const passport = require("passport");
require("../passport.js");
const users = require("");
const Jwt = require("jsonwebtoken");
const axios = require("axios");
router.post("/getOTP", async (req, res) => {
  const mobileno = req.body.mobileno;
  if (!mobileno)
    return res.send({ message: "Please send mobileno to send otp to" });
  const randomno = (Math.random() * 10000).toFixed(0);
  users[mobileno] = randomno;
  //   try {
  //     const URL = `https://www.fast2sms.com/dev/bulkV2?authorization=${process.env.FAST_SMS_KEY}&route=q&message=${randomno}&language=english&flash=0&numbers=${mobileno}`;
  //     const resp = await axios.get(URL);
  //   } catch (err) {
  //     return res.status(500).send({ message: "Error in sending OTP" });
  //   }
  console.log(randomno);

  res.send({ message: "Sent OTP to " + mobileno });
});
router.post("/login", async (req, res, next) => {
  passport.authenticate("local", { session: false }, (err, user, info) => {
    if (err || !user) {
      return res
        .status(401)
        .send({ status: "failure", message: "Unauthorized" });
    }
    req.login(user, { session: false }, (err) => {
      if (err) return res.status(500).send(err);
      const token = Jwt.sign(user, process.env.JWT_KEY);
      return res.send({ user, token });
    });
  })(req, res, next);
});
module.exports = { router, users };

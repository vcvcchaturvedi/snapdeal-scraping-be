const passport = require("passport");
const PassportJWT = require("passport-jwt");
const { Strategy: LocalStrategy } = require("passport-local");
const JWt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();
const otp = require("./routes/otp.js");
const { users } = otp;
const Strategy = PassportJWT.Strategy;
passport.use(
  new LocalStrategy(async (username, password, done) => {
    console.log("users=" + users);
    console.log("username=" + username);
    console.log("password=" + password);
    if (Object.keys(users).includes(username)) {
      const otp = users[username];
      if (password == otp)
        done(null, { username }, { message: "Logged in successfully" });
      else done(null, false, { message: "Invalid OTP" });
    }
  })
);
passport.use(
  new Strategy(
    {
      jwtFromRequest: PassportJWT.ExtractJwt.fromAuthHeaderAsBearerToken,
      secretOrKey: process.env.JWT_KEY,
    },
    async (jwtPayload, cb) => {
      if (users.includes(jwtPayload.username)) cb(null, true);
    }
  )
);

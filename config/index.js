const mongoose = require("mongoose"); //mongoDB

// passport-jwt
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;

const config = require("config");

// user model
const User = require("../models/User");

module.exports = {
  // mongoDB
  mongoose: async () => {
    const db = process.env.mongoURI || config.get("mongoURI");
    mongoose
      .connect(db, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false
      })
      .then(() => console.log("mongoDB connected"))
      .catch(err => console.log(err));
  },

  // passport config
  passport: passport => {
    const keys = process.env.keys || require("config").get("jwtSecret");

    const opts = {};
    opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
    opts.secretOrKey = keys;

    passport.use(
      new JwtStrategy(opts, (jwt_payload, done) => {
        User.findById(jwt_payload.id)
          .then(user => {
            if (user) {
              return done(null, user);
            }
            return done(null, false);
          })
          .catch(err => console.log(err));
      })
    );
  }
};

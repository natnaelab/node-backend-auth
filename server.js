const express = require("express");
const passport = require("passport");
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.urlencoded({ extended: false })); //init mw
app.use(bodyParser.json());

require("./config").passport(passport);

// db config
require("./config").mongoose();

// Routes
app.use("/api/users", require("./routes/api/users"));

// init passport
app.use(passport.initialize());

const PORT = process.env.PORT || 9999;

app.listen(PORT, () => console.log(`server listening on port ${PORT}`));

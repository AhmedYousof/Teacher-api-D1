const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const passport = require("passport");
const mongoose = require("mongoose");
const indexRouter = require("./routes/index");
const studentsRouter = require("./routes/students");
const teacherRouter = require("./routes/teachers");

const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(passport.initialize());
app.use("/", indexRouter);
app.use("/students", studentsRouter);
app.use("/teachers", teacherRouter);
//Passport config

require("./config/passport")(passport);

//DB connection
mongoose
  .connect("mongodb://localhost:27017/teacherapi", {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log("DB Connected"))
  .catch(err => console.log(err));
const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`Server running on port ${port}`));

module.exports = app;

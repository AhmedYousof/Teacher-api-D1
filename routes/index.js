const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const Student = require("../models/Student");
const Teacher = require("../models/Teacher");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const validateLoginInput = require("../validation/login");

//@Route POST localhost:3000/login
//@DESC Login all users (Students & Teacher)
//@Parmeters(email, password)
router.post("/login", (req, res, next) => {
  const { errors, isValid } = validateLoginInput(req.body);
  const { email, password } = req.body;

  if (!isValid) {
    return res.status(400).json(errors);
  }

  Teacher.findOne({ email }).then(teacher => {
    Student.findOne({ email }).then(student => {
      if (!teacher && !student) {
        errors.email = "User not Found";
        return res.status(404).json(errors);
      }
      if (teacher) {
        user = teacher;
      }
      if (student) {
        user = student;
      }
      bcrypt.compare(password, user.password).then(isMatch => {
        if (isMatch) {
          const payload = { id: user.id, name: user.name, avatar: user.avatar };
          jwt.sign(payload, "secret", { expiresIn: 3600 }, (err, token) => {
            res.json({ Success: true, token: "Bearer " + token });
          });
        } else {
          errors.password = "Password Incorrect";
          return res.status(400).json(errors);
        }
      });
    });
  });
});

//@Route POST localhost:3000/reset-password
//@Desc RESET PASSWORD
//@Parmeters(email)
//@status Still UNCOMPLETE

router.post("/reset-password", (req, res, next) => {
  const { email } = req.body;
  Teacher.findOne({ email }).then(teacher => {
    Student.findOne({ email }).then(student => {
      if (!teacher && !student) {
        return res.status(404).json("User is not exist");
      }

      if (teacher) {
        user = teacher;
      }
      if (student) {
        user = student;
      }

      token = crypto.randomBytes(32).toString("hex"); //creating the token to be sent to the forgot password form (react)
      user.update({
        resetPasswordToken: token,
        resetPasswordExpires: Date.now() + 3600000
      });
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: `${process.env.EMAIL_ADDRESS}`,
          pass: `${process.env.EMAIL_PASSWORD}`
        }
      });
      const mailOptions = {
        from: "TeacharEG@gmail.com",
        to: `${user.email}`,
        subject: "Link to reset password",
        text: `https:localhost:3000/reset-password/${token}`
      };
      transporter.sendMail(mailOptions, (err, response) => {
        if (err) {
          res.status(400).json("Erorr " + err);
        } else {
          res.status(200).json("Recovery email sent");
        }
      });
    });
  });
});

router.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  (req, res, next) => {
    res.json({
      id: req.user.id,
      name: req.user.name,
      email: req.user.email
    });
  }
);

module.exports = router;

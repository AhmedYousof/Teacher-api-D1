const express = require("express");
const router = express.Router();
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const Teacher = require("../models/Teacher");
const Student = require("../models/Student");

// validations
const validateRegisterInput = require("../validation/register");

//@Route POST localhost:3000/students/register
//@DESC Student register
//@Parmeters(name, email, password, confirmpassword)

router.post("/register", (req, res, next) => {
  const { errors, isValid } = validateRegisterInput(req.body);
  if (!isValid) {
    return res.status(400).json(errors);
  }
  Teacher.findOne({ email: req.body.email }).then(teacher => {
    Student.findOne({ email: req.body.email }).then(user => {
      errors.email = "Email Already exists";
      if (user || teacher) {
        return res.status(400).json(errors);
      } else {
        const avatar = gravatar.url(req.body.email, {
          s: "200",
          r: "pg",
          d: "mm"
        });
        const newUser = new Student({
          name: req.body.name,
          email: req.body.email,
          password: req.body.password,
          confirmpassword: req.body.confirmpassword,
          avatar
        });
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            bcrypt.compare(newUser.confirmpassword, hash).then(isMatch => {
              if (isMatch) {
                newUser
                  .save()
                  .then(user => res.json(user))
                  .catch(err => console.log(err));
              } else {
                return res.status(400).json("Confirm Password isn't correct ");
              }
            });
          });
        });
      }
    });
  });
});

module.exports = router;

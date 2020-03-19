const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const TeacherSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  confirmpassword: {
    type: String,
    required: true
  },
  sallary: {
    type: String,
    default: 0
  },
  avatar: {
    type: String
  },
  courses: {
    type: [Schema.Types.ObjectId],
    ref: "courses"
  },
  phone: {
    type: [String]
  },
  address: {
    type: String,
    default: ""
  },
  info: {
    type: String,
    default: ""
  }
});

module.exports = Teacher = mongoose.model("teachers", TeacherSchema);

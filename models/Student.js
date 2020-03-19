const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const StudentSchema = new Schema({
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
    type: String
  },
  info: {
    type: String
  }
});

module.exports = User = mongoose.model("students", StudentSchema);

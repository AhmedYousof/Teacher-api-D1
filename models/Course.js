const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const CourseSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  price: {
    type: String
  },
  pic: {
    type: String
  },
  startAt: {
    type: Date
  },
  endAt: {
    type: Date
  }
});
module.exports = User = mongoose.model("courses", CourseSchema);

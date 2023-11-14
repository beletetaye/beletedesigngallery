const { Schema, model } = require("mongoose");

const FeedbackSchema = new Schema({
  name: {
    type: String,
  },
  phone: String,
  message: {
    type: String,
    required: true,
  },
});

const Feedback = model("Feedback", FeedbackSchema);

module.exports = Feedback;

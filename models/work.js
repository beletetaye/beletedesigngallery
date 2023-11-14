const { Schema, model } = require("mongoose");

const ImageSchema = new Schema({ url: String, filename: String });

ImageSchema.virtual("thumbnail").get(function () {
  return this.url.replace("/upload", "/upload/w_200");
});

const WorkSchema = new Schema({
  title: {
    type: String,
    required: [true, "Title is required"],
  },
  detail: {
    type: String,
    required: [true, "Work detail is required"],
  },
  image: {
    type: ImageSchema,
    required: [true, "Image is required"],
  },
});

const Work = model("Work", WorkSchema);

module.exports = Work;

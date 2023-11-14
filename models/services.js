const { Schema, model } = require("mongoose");

const ImageSchema = new Schema({ url: String, filename: String });

ImageSchema.virtual("thumbnail").get(function () {
  return this.url.replace("/upload", "/upload/w_200");
});

const ServiceSchema = new Schema({
  service_title: {
    type: String,
    required: [true, "Title is required"],
  },
  service_detail: {
    type: String,
    required: [true, "Work detail is required"],
  },
  service_image: {
    type: ImageSchema,
    required: [true, "Image is required"],
  },
});

const Service = model("Service", ServiceSchema);

module.exports = Service;

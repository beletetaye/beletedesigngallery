const { Schema, model } = require("mongoose");

const ImageSchema = new Schema({ url: String, filename: String });

ImageSchema.virtual("thumbnail").get(function () {
  return this.url.replace("/upload", "/upload/w_200");
});

const CustomerSchema = new Schema({
  username: {
    type: String,
    required: [true, "Username is required!"],
  },
  phone: {
    type: Number,
    required: [true, "Phone number is required!"],
  },
  address: {
    type: String,
    required: [true, "Address is required!"],
  },
  project: {
    type: String,
    required: [true, "Project is required!"],
  },
  designcode: {
    type: String,
    required: [true, "Design Code is required!"],
  },
  area: {
    type: String,
    required: [true, "Area is required!"],
  },
  idcard: {
    type: ImageSchema,
    required: [true, "ID is required!"],
  },
  homeimage: {
    type: ImageSchema,
    required: [true, "Home image is required!"],
  },
  message: {
    type: String,
    required: false,
  },
});

const Customer = model("Customer", CustomerSchema);

module.exports = Customer;

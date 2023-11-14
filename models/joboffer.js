const { Schema, model } = require("mongoose");

const ImageSchema = new Schema({ url: String, filename: String });

ImageSchema.virtual("thumbnail").get(function () {
  return this.url.replace("/upload", "/upload/w_200");
});

const GetOfferSchema = new Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
  },
  phone: {
    type: Number,
    required: [true, "Phone number is required"],
  },
  address: {
    type: String,
    required: [true, "Address is required"],
  },
  image: {
    type: ImageSchema,
    required: [true, "Id is required"],
  },
});

const Offer = model("Offer", GetOfferSchema);
module.exports = Offer;

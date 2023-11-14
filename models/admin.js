const { Schema, model } = require("mongoose");

const AdminSchema = new Schema({
  username: {
    type: String,
    required: [true, "Username required"],
  },
  password: {
    type: String,
    required: [true, "Password is required"],
  },
});

const Admin = model("Admin", AdminSchema);

module.exports = Admin;

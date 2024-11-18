const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  user_name: { type: String, required: true, maxLength: 100, min: 3 },
  password: { type: String, required: true, minLength: 8, maxLength: 100 },
  firstName: { type: String, required: true, maxLength: 100, min: 3 },
  lastName: { type: String, requried: true, maxLength: 100, min: 3 },
  email: { type: String, required: true, maxLength: 100 },
  phoneNum: { type: String, required: true, maxLength: 100 },
  member_status: { type: String, enum: ["user", "admin"], default: "user" },
});

UserSchema.virtual("url").get(function () {
  return `/user/${this.id}`;
});

module.exports = mongoose.model("User", UserSchema);

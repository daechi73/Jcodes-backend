const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: { type: String, required: true, maxLength: 100 },
  user_name: { type: String, required: true, maxLength: 100 },
  password: { type: String, required: true, minLength: 8 },
  member_status: { type: String, enum: ["user", "admin"], default: "user" },
});

UserSchema.virtual("url").get(function () {
  return `/user/${this.id}`;
});

module.exports = mongoose.model("User", UserSchema);

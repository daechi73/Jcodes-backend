#! /user/bin/env node

console.log("This SCript populates users and comments to the database");

const userArgs = process.argv.slice(2);

const bcrypt = require("bcryptjs");
const Comment = require("./models/comment");
const User = require("./models/user");

const comments = [];
const users = [];

const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

const mongoDB = userArgs[0];

main().catch((err) => console.log(err));

async function main() {
  console.log("Debug: About to connect");
  await mongoose.connect(mongoDB);
  console.log("Debug: Should be connected?");
  await createUsers();
  //await createComments();
  console.log("Debug: Closing mongoose");
  mongoose.connection.close();
}
async function userCreate(
  index,
  user_name,
  password,
  status,
  firstName,
  lastName,
  email,
  phoneNum
) {
  const user = new User({
    user_name: user_name,
    password: await hashedPass2(password),
    member_status: status,
    firstName,
    lastName,
    email,
    phoneNum,
  });

  await user.save();
  users[index] = user;
  console.log(`added user: ${user.firstName} ${user.user_name}`);
}
async function commentCreate(index, user, date_added, comment) {
  const commentObj = new Comment({
    user: user,
    date_added: date_added,
    comment: comment,
  });
  await commentObj.save();
  comments[index] = commentObj;
  console.log(`added comment from ${user.user_name}`);
}

async function hashedPass2(password) {
  const result = await bcrypt.hash(password, 10);
  return result;
}

async function createUsers() {
  console.log("adding Users");
  await Promise.all([
    userCreate(
      0,
      "daechi73",
      "Wnsvy777!!!",
      "admin",
      "J",
      "H",
      "jcodes92@gmail.com",
      "647-529-9208"
    ),
  ]);
}

// async function createComments() {
//     console.log("creating Comments..");
//     console.log(users);
//     await Promise.all([
//       commentCreate(0, users[0], "1992-04-12", "Th1$ iS $o MucH FuN!"),
//     ]);
//   }

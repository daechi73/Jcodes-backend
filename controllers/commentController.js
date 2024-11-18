const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const Comment = require("../models/comment");
const user = require("../models/user");

exports.comment_list = asyncHandler(async (req, res, next) => {
  const comment = await Comment.find().populate("user").exec();
  if (comment.length === 0)
    return res.json({ status: "failure", msg: "no comments found" });
  return res.json({ status: "success", comment: comment });
});
exports.comment_post = [
  body("comment")
    .trim()
    .isLength({ min: 4 })
    .withMessage("You must type atleast 4 letters"),
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    const comment = new Comment({
      user: req.body.user,
      comment: req.body.comment,
    });
    if (!errors.isEmpty()) {
      res.json({
        status: "failed",
        user: user,
        errors: errors.array(),
      });
      return;
    } else {
      await comment.save();
      res.json({
        status: "success",
      });
    }
  }),
];

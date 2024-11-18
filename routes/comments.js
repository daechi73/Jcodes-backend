const express = require("express");
const router = express.Router();

const commentController = require("../controllers/commentController");

router.get("/", commentController.comment_list);
router.post("/", commentController.comment_post);
module.exports = router;

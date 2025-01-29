const Comment = require("../models/comment");
const { check, validationResult } = require("express-validator");

exports.addComment = async (req, res) => {
  const errors = validationResult(req);
  console.log("Comment::: ", req.body);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: errors.array()[0].msg,
    });
  }
  try {
    const { content } = req.body;
    if (!content) {
      res.status(400).json({ error: "Content is required" });
    }
    const comment = new Comment({
      content,
      user: req.profile._id,
      ticket: req.params.ticketId,
    });
    await comment.save();
    res.status(201).json(comment);
  } catch (err) {
    console.log("ERROR COMMENT: ", err);
    res.status(400).json({ error: "Error adding comment" });
  }
};

// Get all comments for a specific ticket
exports.getComments = async (req, res) => {
  try {
    const { ticketId } = req.params;
    const comments = await Comment.find({ ticket: ticketId }).populate(
      "user",
      "username email"
    );
    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ error: "Error fetching comments" });
  }
};

// Update a comment
exports.updateComment = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: errors.array()[0].msg,
    });
  }
  try {
    const { commentId } = req.params;
    const { content } = req.body;

    const comment = await Comment.findById(commentId);

    if (!comment) {
      return res.status(404).json({ error: "Comment not found" });
    }

    if (comment.user.toString() !== req.profile._id) {
      return res
        .status(403)
        .json({ error: "You can only edit your own comments" });
    }

    comment.content = content || comment.content;
    const updatedComment = await comment.save();

    res.status(200).json({
      message: "Comment updated successfully",
      comment: updatedComment,
    });
  } catch (error) {
    res.status(500).json({ error: "Error updating comment" });
  }
};

// Delete a comment
exports.deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;

    const comment = await Comment.findById(commentId);

    if (!comment) {
      return res.status(404).json({ error: "Comment not found" });
    }
    console.log("COMMENT USER: ", comment.user.toString());
    console.log("REQ PROFILE: ", req.profile);
    if (
      req.profile.role === "USER" &&
      comment.user.toString() !== req.profile._id.toString()
    ) {
      return res
        .status(403)
        .json({ error: "You can only delete your own comments" });
    }

    await Comment.deleteOne({ _id: commentId });

    res.status(200).json({ message: "Comment deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting comment" });
  }
};

const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  content: { type: String, required: true, trim: true, minlength: 1 },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  ticket: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Ticket",
    required: true,
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Comment", commentSchema);

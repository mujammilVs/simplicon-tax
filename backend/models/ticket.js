const mongoose = require("mongoose");

const ticketSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, minlength: 5 },
  description: { type: String, required: true, trim: true, minlength: 25 },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  status: { type: String, enum: ["OPEN", "CLOSED"], default: "OPEN" },
  files: [{ type: String }], // Array of file paths
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Ticket", ticketSchema);

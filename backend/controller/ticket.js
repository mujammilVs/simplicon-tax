const Ticket = require("../models/ticket");
const { check, validationResult } = require("express-validator");

exports.createTicket = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: errors.array()[0].msg,
    });
  }
  try {
    const { title, description, status } = req.body;
    console.log("USER: ", req.profile);
    const files = req.files.map((file) => file.filename);
    const ticket = new Ticket({
      title,
      description,
      files,
      status,
      user: req.profile._id,
    });
    await ticket.save();
    res.status(201).json({ message: "TIcket created succesffully", ticket });
  } catch (err) {
    console.log("ERROR TIKCET: ", err);
    res.status(400).json({ error: "Error creating ticket" });
  }
};

exports.getTickets = (req, res) => {
  console.log(" getTickets USER:: ", req.profile);
  const query = req.profile.role === "ADMIN" ? {} : { user: req.profile._id };
  console.log("Query: ", query);
  console.log("Req profile: ", req.profile);
  Ticket.find(query)
    .populate("user", "username")
    .exec((err, tickets) => {
      if (err) {
        return res.status(400).json({
          error: "Tickets not found",
        });
      }
      return res.json(tickets);
    });
};
exports.getTicketDetails = (req, res) => {
  return res.json(req.ticket);
};

exports.getTicketFiles = async (req, res) => {
  const { ticketId } = req.params;

  try {
    const ticket = await Ticket.findById(ticketId);

    if (!ticket) {
      return res.status(404).json({ error: "Ticket not found" });
    }

    res.status(200).json({ files: ticket.files });
  } catch (error) {
    res.status(500).json({ error: "Error fetching ticket files" });
  }
};

exports.getTicketById = (req, res, next, id) => {
  Ticket.findById(id)
    .populate("user", "username")
    .exec((err, ticket) => {
      if (err) {
        return res.status(400).json({
          error: "Ticket not found",
        });
      }
      req.ticket = ticket;
      next();
    });
};

exports.updateTicket = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: errors.array()[0].msg,
    });
  }
  try {
    const { title, description } = req.body;

    const ticket = await Ticket.findById(req.params.ticketId);

    if (!ticket) {
      return res.status(404).json({ error: "Ticket not found" });
    }
    // Update fields
    ticket.title = title || ticket.title;
    ticket.description = description || ticket.description;

    // Append newly uploaded files
    const uploadedFiles = req.files.map((file) => file.filename);
    ticket.files.push(...uploadedFiles);

    const updatedTicket = await ticket.save();

    res
      .status(200)
      .json({ message: "Ticket updated successfully", ticket: updatedTicket });
  } catch (err) {
    console.log("ERROR TIKCET: ", err);
    res.status(400).json({ error: "Error creating ticket" });
  }
};

exports.updateTicketStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const { role } = req.profile;

    const ticket = await Ticket.findById(req.params.ticketId);
    if (!ticket) {
      return res.status(404).json({ error: "Ticket not found" });
    }
    if (
      role === "USER" &&
      ticket.user.toString() !== req.profile._id.toString()
    ) {
      return res
        .status(401)
        .json({ error: "User can update their own ticket status" });
    }
    // Update fields
    ticket.status = status;
    const updatedTicket = await ticket.save();

    res.status(200).json({
      message: "Ticket status updated successfully",
      ticket: updatedTicket,
    });
  } catch (err) {
    console.log("ERROR TIKCET: ", err);
    res.status(400).json({ error: "Error updating ticket status" });
  }
};

exports.deleteTicket = (req, res) => {
  const ticket = req.ticket;

  ticket.remove((err, ticket) => {
    if (err) {
      return res.status(400).json({
        error: "failed to delete ticket",
      });
    }
    res.json({
      message: `${ticket.title} succesfully deleted`,
    });
  });
};

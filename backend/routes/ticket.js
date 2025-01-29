const { check } = require("express-validator");
const path = require("path");
const multer = require("multer");
const express = require("express");
const router = express.Router();

const {
  createTicket,
  getTickets,
  getTicketById,
  updateTicket,
  getTicketFiles,
  deleteTicket,
  updateTicketStatus,
  getTicketDetails,
} = require("../controller/ticket");
const {
  isAuthenticated,
  isSignedin,
  isAuthorized,
} = require("../controller/auth");
const { getUserById } = require("../controller/user");

// File Upload Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

// //MiddleWares
router.param("userId", getUserById);
router.param("ticketId", getTicketById);

// //Read Routes
router.get("/ticketDetails/:userId/:ticketId", isSignedin, getTicketDetails);
router.get("/tickets/:userId", isSignedin, getTickets);

// Secure file download route
router.post("/download", (req, res) => {
  console.log("Download Route");
  const { filename } = req.body;
  const filePath = path.join(process.cwd(), "uploads", filename);

  res.setHeader("Content-Disposition", `attachment; filename="${filename}"`); // Expose header for download
  res.setHeader("Access-Control-Expose-Headers", "Content-Disposition"); // Ensure browser sees this header

  // Validate if file exists
  res.sendFile(filePath, (err) => {
    if (err) {
      console.error("Error sending file:", err);
      res.status(404).send("File not found");
    }
  });
});

router.get(
  "/files/:userId/:ticketId",
  isSignedin,
  isAuthenticated,
  getTicketFiles
);

//Post Routes
router.post(
  "/create/:userId",
  upload.array("files"),
  [
    // ...some other validations...
    check("title")
      .isLength({ min: 5 })
      .withMessage("Title should be atleast 5 characters"),
    check("description")
      .isLength({ min: 25 })
      .withMessage("Description should be atleast 25 characters"),
  ],
  isSignedin,
  isAuthenticated,
  createTicket
);

// Update routes
router.put(
  "/ticket/:userId/:ticketId",
  upload.array("files"),
  [
    // ...some other validations...
    check("title")
      .isLength({ min: 5 })
      .withMessage("Title should be atleast 5 characters"),
    check("description")
      .isLength({ min: 25 })
      .withMessage("Description should be atleast 25 characters"),
  ],
  isSignedin,
  isAuthenticated,
  isAuthorized,
  updateTicket
);

router.put(
  "/ticket/status/:userId/:ticketId",
  isSignedin,
  isAuthenticated,
  updateTicketStatus
);

//Delete Routes
router.delete(
  "/ticket/:userId/:ticketId",
  isSignedin,
  isAuthenticated,
  deleteTicket
);

module.exports = router;

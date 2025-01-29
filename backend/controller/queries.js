const Query = require("../models/queriesList");
const { check, validationResult } = require("express-validator");

exports.addQuery = async (req, res) => {
  const errors = validationResult(req);
  console.log("Query::: ", req.body);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: errors.array()[0].msg,
    });
  }
  try {
    const { name, email, phone, details } = req.body;
    if (!name || !email || !phone || !details) {
      return res.status(400).json({ error: "All fields are required" });
    }
    const query = new Query({
      name,
      email,
      phone,
      details,
    });
    await query.save();
    res.status(201).json(query);
  } catch (err) {
    console.log("ERROR QUERY: ", err);
    res.status(400).json({ error: "Error adding query" });
  }
};
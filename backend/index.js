require("dotenv").config();
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const config = require("config");
const mongoURI = config.get("DB");
const bodyparser = require("body-parser");
const cookieparser = require("cookie-parser");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const app = express();
const mongodburi = process.env.MONGODB_URI;

//Routes
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const commentRoutes = require("./routes/comment");
const ticketRoutes = require("./routes/ticket");
const queryRoutes = require("./routes/queries");

//Middlewares
app.use(bodyparser.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(cookieparser());
app.use(cors());

//Routes Middlewares
app.use("/api", authRoutes);
app.use("/api", userRoutes);
app.use("/api", commentRoutes);
app.use("/api", ticketRoutes);
app.use("/api", queryRoutes);

mongoose
  .connect(
    mongoURI || mongodburi,
    {
      useNewUrlParser: true,
      keepAlive: 1,
      useCreateIndex: true,
      useUnifiedTopology: true,
    },
    () => {
      console.log("SERVER CONNECTED TO DB");
    }
  )
  .catch((error) => console.log("db connection error", error));

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => res.send("In Home Page...."));

app.listen(PORT, () => console.log(`listening on http://localhost:${PORT}`));

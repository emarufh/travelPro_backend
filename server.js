const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

const errorHandler = require("./middleware/errorHandling");
const authRouter = require("./routes/auth");
const userRouter = require("./routes/user");

dotenv.config();

const app = express();
const port = 5003;

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("Database connected!"))
  .catch((err) => console.log(err));

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

app.use("/api/", authRouter);
app.use("/api/users", userRouter);

app.get("/", (req, res) => res.send("Hello World!"));

app.use(errorHandler);

app.listen(process.env.PORT || port, () =>
  console.log(`App is listening on port ${process.env.PORT}!`)
);

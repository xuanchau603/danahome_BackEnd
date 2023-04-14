const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const cors = require("cors");
const app = express();

const { authRoutes } = require("./Routes");

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

app.get("/", (req, res) => {
  res.json("Welcome to server DanaHome");
});

app.use("/users", authRoutes);

app.listen(802, () => {
  console.log("Server is running at port 802");
});

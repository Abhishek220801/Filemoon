const dotenv = require("dotenv");
dotenv.config();

const mongoose = require("mongoose");
mongoose.connect(process.env.DB);

const express = require("express");
const multer = require("multer");
const path = require("node:path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "files/")
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9)
    let fileog = file.originalname;
    if (fileog.includes(".")) {     // since a filepath can contain multiple '.'
      fileog = fileog.split(".")
      fileog.pop()
      fileog = fileog.join(".")
    }
    cb(null, fileog + "-" + uniqueSuffix + path.extname(file.originalname))
  },
});

const upload = multer({ storage });

const { signup, login } = require("./controller/user.controller")
const {
  createFile,
  fetchFiles,
  deleteFile,
  downloadFile,
} = require("./controller/file.controller");
const fetchDashboard = require("./controller/dashboard.controller");

const app = express();
app.listen(process.env.PORT || 8080);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static("view"));

app.post("/signup", signup);
app.post("/login", login);
app.post("/file", upload.single("file"), createFile);
app.get("/files", fetchFiles);
app.delete("/file/:id", deleteFile);
app.get("/file/download/:id", downloadFile);
app.get("/dashboard", fetchDashboard);

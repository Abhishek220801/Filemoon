const dotenv = require("dotenv");
dotenv.config();

const mongoose = require("mongoose");
mongoose.connect(process.env.DB);

const root = process.cwd();
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

const upload = multer({ 
  storage, 
  limits: {
    fileSize: 200 * 1000 * 1000
  }
 });

const { signup, login, updateProfileImg, fetchProfilePic } = require("./controller/user.controller")
const {
  createFile,
  fetchFiles,
  deleteFile,
  downloadFile,
} = require("./controller/file.controller");
const fetchDashboard = require("./controller/dashboard.controller");
const verifyToken = require("./controller/token.controller");
const { shareFile, fetchShared } = require("./controller/share.controller");
const AuthMiddleware = require("./middleware/auth.middleware");

const app = express();
app.listen(process.env.PORT || 8080);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static("view"));

// UI endpoints 
const getPath = (filename) => {
  return path.join(root, 'view', filename);
}

app.get('/signup', (req, res) => {
  res.sendFile(getPath('signup.html'));
})
app.get('/login', (req, res) => {
  res.sendFile(getPath('index.html'));
})
app.get('/', (req, res) => {
  res.sendFile(getPath('index.html'));
})
app.get('/dashboard', (req, res) => {
  res.sendFile(getPath('app/dashboard.html'));
})
app.get('/history', (req, res) => {
  res.sendFile(getPath('app/history.html'));
})
app.get('/files', (req, res) => {
  res.sendFile(getPath('app/files.html'));
})

// API endpoints
app.post("/api/signup", signup);
app.post("/api/login", login);
app.post("/api/profile-pic", AuthMiddleware, upload.single('picture'), updateProfileImg); // post since multer upload will happen
app.get("/api/profile-pic", AuthMiddleware, fetchProfilePic); 
app.post("/api/file", AuthMiddleware, upload.single("file"), createFile);
app.get("/api/files", AuthMiddleware, fetchFiles);
app.delete("/api/file/:id", AuthMiddleware, deleteFile);
app.get("/api/file/download/:id", downloadFile);
app.get("/api/dashboard", AuthMiddleware, fetchDashboard);
app.post('/api/token/verify', verifyToken);
app.post('/api/file/share', AuthMiddleware, shareFile);
app.get('/api/files/shared', AuthMiddleware, fetchShared);


app.use((req, res) => {
  res.status(404).json({message: 'Page Not Found'});
})

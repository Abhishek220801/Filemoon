const dotenv = require('dotenv')
dotenv.config();

const mongoose = require('mongoose');
mongoose.connect(process.env.DB)

const express = require('express');
const multer = require("multer");
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'files/')
    },
    filename: (req, file, cb) => {
        const nameArr = file.originalname.split('.');
        const ext = nameArr.pop();
        const name = `${crypto.randomUUID()}.${ext}`
        cb(null, name);
    }
})
const upload = multer({storage});
const { signup, login } = require('./controller/user.controller');
const { createFile } = require('./controller/file.controller');
const app = express();
app.listen(process.env.PORT || 8080)

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(express.static('view'));

app.post('/signup', signup)
app.post('/login', login)
app.post('/file', upload.single("file") , createFile)
const dotenv = require('dotenv')
dotenv.config();

const mongoose = require('mongoose');
mongoose.connect(process.env.DB)

const express = require('express');
const { signup } = require('./controller/user.controller');
const app = express();
app.listen(process.env.PORT || 8080)

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(express.static('view'));

app.post('/signup', signup)
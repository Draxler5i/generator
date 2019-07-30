const express = require('express');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/');
const dataBase = require('./database/database');
const app = express();

dataBase.connect();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/', userRoutes);

module.exports = app;
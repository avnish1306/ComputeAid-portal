const express = require('express');
const path = require('path');
const morgan = require('morgan');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const dotenv = require('dotenv');
const cors = require('cors');
dotenv.config();
const app = express();
console.log(process.env.SECRET);
const port = process.env.PORT || 3000;

// Connecting to the DB
mongoose.connect('mongodb://localhost/cryptoquest');

mongoose.connection.on('open', () => {
    console.log("Connected to the DB");
});

mongoose.connection.on('error', () => {
    console.log("Error connecting to the DB");
});

const user = require("./routes/user");
const chals = require("./routes/chals");
const que = require("./routes/que");
const flaw=require("./routes/flaw");

// Middleware Setup
app.use(morgan('dev'));
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(expressValidator());
app.use(express.static(__dirname+'/public'));

// Importing Routes
app.use("/user", user);
app.use("/chals", chals);
app.use("/ques", que);
app.use("/flaws",flaw);
console.log(__dirname);
// Setting Up Error Messages and Status
app.use((req, res, next) => {
    const error = new Error("Not Found");
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        status: 0,
        error: error.message
    });
});

// Starting the Server
app.listen(port, () => {
    console.log("Listening on port: "+port);
});
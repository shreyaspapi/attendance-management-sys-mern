const express = require('express');
const mongoose = require('mongoose');
const passport = require("passport");
const bodyParser = require("body-parser");

const users = require("./routes/api/users")

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const db = require("./config/keys").mongoURI;

mongoose.connect( db, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true });

const connection = mongoose.connection;
connection.once('open', () => {
    console.log("MongoDB database connection established successfully");
})


app.use(passport.initialize());

require("./config/passport")(passport);
// Routes
app.use("/api/users", users);

const port = process.env.PORT || 5000;


app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
})

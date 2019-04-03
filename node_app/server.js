//modules - third party helpers
const express = require("express"); //express hosts the server and serves the static files
const mongoose = require("mongoose"); //mongoose is my selected method of database, nosql, simply takes a whole datamodel and either gets, sets or deletes it
const bodyParser = require("body-parser"); //bodyparser is a must have for any nodejs back end to correctly process and manipulate json
const passport = require("passport"); //passport is an authentication module, there are many auth types to use, I will be using jwt - json web tokens, but it also comes with other predefined methods such as oAuth

//route files - rest api routes, these will be the web services, used transfer and transform data
//here you should group your routes in a smart efficient way
//with mongo db, as an unrelational database I'm going to declare each table I use
//nosql is very good at handling 'big data'
//here we just import the files ready to be used below to be neat
const users = require("./routes/api/users");

const app = express(); //this sets my var app as the express function which creates a new server

//bodyparser configuration
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json()); //this makes my app use the json bodyparser because that is the datatype I will be using

//dbconf
const db = require("./config/keys").mongoURI;
//Here I create a new var called db which gets my database connection credentials, these are stored in a file called keys which are inaccessible by any other file and wont be included in the git commit
//I require the filename then add the object key I want to use, this is called object destructuring

//dbconn
mongoose
  .connect(db, { newUrlParser: true })
  .then(() => {
    console.log("Mongo DB Connected");
  })
  .catch(err => console.log(err));
//Here I'm using the mongoose module to connect to my database with the connetion from the keys file
//This returns a promise which allows me to use .then, a call back
//in the call back if the connetion is successul I simply console log out into my node app that it's connected
//if I catch an error then I will console log the error in the node app

//passport
app.use(passport.initialize()); //the module passport needs to be initialized
require("./config/passport"); //I'm getting some configuration for passport from a config file because I don't want this to be available to public

//routes
app.use("/api/users", users);
//This means if my app uses the path "/api/userAccounts" then it will point to the userAccounts file in the routes/api folder, this keeps everything modular and neat, and makes it easy to debug

const port = process.env.PORT || 5000; //here I'm setting what port to run the app on, if I don't set a port it will use 5000 as a default

app.listen(port, () => {
  console.log(`Running on port: ${port}`); //Here I tell the app to listen on the port I specified above, if the connection is successful it will console log out 'listening on port: [port]'
});

//This is absolutely everything you need to run the back end service.

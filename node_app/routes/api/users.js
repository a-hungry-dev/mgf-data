//modules
const express = require("express");
const router = express.Router(); //brings in express to use it's router functionality
const bcrypt = require("bcryptjs"); //this is an encryption module for passwords
const jwt = require("jsonwebtoken"); //this brings in the json web token module to use authentication/authorization
const passport = require("passport"); //this brings in our passport module to carry out the jwt authoriztaion

//users
const UserAccount = require("../../models/userAccount"); //this brings in the user accounts database model (table)

//validation
const validateRegisterInput = require("../../validation/register");
const validateLoginInput = require("../../validation/login");
//these are the helper files we wrote for validation

//keys
const { secretOrKey } = require("../../config/keys"); //this loads in the secret keys we put in our config file

//you will see the following tags below used for description purposes
//the route is the url you go to, the web service you call
//the description is as the name suggests, describes what the api does
//the access is whether or not the route is accessible by public, or if you have to be logged in, or have a certain role to use it

// @ROUTE       GET /api/userAccounts/test
// @DESCRIPTION Tests the user route works
// @ACCESS      Public
router.get("/test", (req, res) => {
  console.log("here in test route");
  //router is the route we go to, it called a get request (like ajax) using request and response
  res.json({
    //this simple responds with json, the key message with the value of the text below
    message: "This User Test Route Works By Going To /api/userAccounts/test"
  });
});

// @ROUTE       POST /api/userAccount/regsiter
// @DESCRIPTION registers a new user into the userAccounts model (table)
// @ACCESS      Public

router.post("/register", (req, res) => {
  const { errors, isValid } = validateRegisterInput(req.body);
  //this destructures the validateRegisterInput file we brought in to give us any errors or is valid variables it returns when we pass in our request.body

  if (!isValid) return res.status(400).json(errors);

  //here we check if the validateRegisterInput returns valid or not, if it doesn't then we return a status of 400 which is a bad request along with the errors that are returned from the file
  //else our code carries on

  UserAccount.findOne({ email: req.body.email })
    //syntax to find one user(by the email, you can search by any field), alomst the same as c#, easier than mysql queries, which are also a good method if that's preffered, just as easy to do
    .then(user => {
      if (user) {
        //if it finds a user then it cannot register this user because its already there
        errors.email = "Email already exists";
        //sets an errors object with a key of email to specify which field is wrong to the above text
        return res.status(400).json(errors);
        //this returns to the user with a status of 400 (bad request) and then sends the errors (which we just set) as json
      } else {
        //it did not find a user with that email
        const newUser = new UserAccount({
          //sets new var of newUser equal to the constructor of new UserAccounts which is the database model (table) we brought in
          userAccountCode: req.body.userAccountCode || null, //I'm setting this as null as I don't know what it's for yet
          Email: req.body.email,
          UserName: req.body.username,
          Password: req.body.password,
          FirstName: req.body.firstname,
          Surname: req.body.surname,
          TelephoneNumber: req.body.telephone,
          LastLoggedIn: Date.now(),
          LoginAttempts: 0,
          IsSuppressed: null //don't know what this is for so it's null
        });
        //now that we have our new user we're going to generate a salt password using bcrypt
        bcrypt.genSalt(10, (err, salt) => {
          //bcrypt has a function for generating a salt, you just pass in an int to say how many characters, if successful it gives you the salt otherwise gives you back the rror
          bcrypt.hash(newUser.Password, salt, (err, hash) => {
            //bcrypts function for hashing a password using the newly created salt
            if (err) throw err;
            //throws error if any
            newUser.Password = hash;
            //sets the new users password as the password hash (we will later decrypt this for login)
            newUser
              .save()
              //mongoose's save function nice and simple like c#
              .then(user => res.json(user))
              //if save is successful then send back the user as a json object
              .catch(err => console.log(err));
            //else throw an error in the console
          });
        });
      }
    })
    .catch(err => console.log(err));
});

//*NOTE this may look like a log, but every other line is a comment, I've tried to be as thorough as possible to pre-emtpively answer any questions you may have.

// @ROUTE       POST /api/userAccount/login
// @DESCRIPTION logs a user in with the userAccounts model (table)
// @ACCESS      Public
router.post("/login", (req, res) => {
  // const email = req.body.email;
  // const username = req.body.email;
  // const password = req.body.password;

  //the above is quite a bit of code compared to destructuring below

  const { email, username, password } = req.body;

  const { errors, isValid } = validateLoginInput(req.body);
  //running our validateLoginInput against the body

  if (!isValid) return res.status(400).json(errors);

  //here we check if the validateRegisterInput returns valid or not, if it doesn't then we return a status of 400 which is a bad request along with the errors that are returned from the file
  //else our code carries on

  // UserAccounts.findOne({ email: email }).then(user => {
  //this method is slow and repetative
  //if a key name is the same as the variable name, you can simply pass the same name inside {} and it will automatically resolve to {email: email} this is also part of es6 destructuring
  UserAccount.findOne({ Email: email }).then(user => {
    //finds user in the userAccount model (table) by the email
    if (!user) {
      //if there isnt a user, set an error object key as email and say the user is not found
      errors.email = "User not found";
      res.status(404).json(errors);
      //here you can see we're setting the status to a 404, which is not found
      //we then send back the errors object
    }

    //else carry on with rest of code
    bcrypt.compare(password, user.Password).then(match => {
      //use bcrypts compare function to see if the password passed in is the same as the one found for the user in the db
      if (match) {
        //if the passwords match then create a payload for jasonwebtoken
        //we do this instead of simply returning the user, because there may be fields we don't want to return (password)
        const payload = {
          id: user.id,
          UserAC: user.userAccountCode,
          username: user.UserName,
          firstName: user.FirstName,
          surname: user.Surname,
          telephone: user.TelephoneNumber
        };
        //this is the information we want to return about the user when they log in

        //this bit looks complicated, but you can just check the docs for jwt and see what options can get passed in
        //im going to put in the payload, which is what I want to return, my secret key andwhen the user login session expires
        //remember you can hover over things in vsc to see the documentation
        //expires in can take a string or an int, int will be seconds, and string you can pass in different options which you can check the docs for, I'm going to pass in 7 days
        //the response is either going to be an error, or a token(jwt) which will save the users session for 7 days unless they log back in
        jwt.sign(payload, secretOrKey, { expiresIn: 3600 }, (err, token) => {
          console.log(err, token);
          if (err) throw err;
          //if there's an error then throw one, else carry on
          res.json({
            success: true,
            token: "Bearer " + token
          });
          //here I'm returning an object to say success: true which I'll check on the front end
          //also the token, which is Bearer (the authentication type + the token which is the jwt token)
        });
      } else {
        errors.password = "Password Incorrect";
        return res.status(400).json(errors);
        //this means the password entered was incorrect and doesn't match the user found
        //so I'm creating the password key of the errors object to tell them the specific reason they can't log in
        //then returning a bad request with the errors object
      }
    });
  });
});

module.exports = router;

//remember we created all of this under the router method of express
//we now export that to make it widely avaiable to the rest of the app

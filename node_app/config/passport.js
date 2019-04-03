//modules
const { JwtStrategy, ExtractJwt } = require("passport-jwt");
//here I'm creating new vars called JwtStrategy and ExtractJwt
//these are functions that are in the passport-jwt module
/*--------MOVE THIS TO THE API DOCUMENTATION--------*/
//this can also be done the way below
// const JwtStrategy = require("passport-jwt").Strategy;
// const ExtractJwt = require("passport-jwt").ExtractJwt;
//you can also just require the module and access the functions like the below
// const PassportJwt = require("passport-jwt")
// PassportJwt.ExtractJwt
// PassportJwt.Strategy
/*--------MOVE THIS TO THE API DOCUMENTATION--------*/

const mongoose = require("mongoose");
//Mongoose the module used to connect to mongo db, our noswl database

const UserAccounts = mongoose.model("UserAccounts");
//database files
//this creates a new var of useraccounts that comes from the user accounts database model (table)
//hover over any prototype, function or method to see it's documentation

//config files
const keys = require("../config/keys");
//I'm going to be using some of the confidential information from the keys file so I'm bringing it into this file

const opts = {};
//I'm creating a blank options var to set with jwt and a secret key

opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
//here I'm setting the jtwFromRequest key in my options object to be a bearer token
//this is an authorization token type
opts.secretOrKey = keys.secretOrKey;
//here I'm setting a secret key to pass in to my jwt strategy

module.exports = passport => {
  //this exports a function which takes in passport data as a parameter
  //this runs passports use function and creates a new jwtStrat witht he options passed in
  passport.use(
    new JwtStrategy(opts, (jwt_payload, done) => {
      //this then gives a jwt_payload which will have an id of a user
      UserAccounts.findById(jwt_payload.id)
        //this looks through useraccounts which is out userAccounts table and finds one with the id send in with the payload
        .then(user => (!user ? done(null, false) : done(null, user)))
        //user is returned and if there's no user then it calls done and gives back nothing otherwise it calls done and gives back the user
        .catch(err => console.log(err));
      //if there's an error it will console log out in the app
    })
  );
};

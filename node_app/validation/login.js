//modules
// import { isEmpty as _isEmpty, isEmail } from "validator";
const Validator = require("validator");

//validator has simple helper functions to check data types and lengths etc
const isEmpty = require("./isEmpty");
//the file we made to validate empty fields

//settting module exports here exports this as a function that takes in data and returns a value (true or false for our use)
module.exports = function validateRegisterInput(data) {
  let errors = {};
  //set an errors object that's going to change

  //here we're going to check all the fields that get input when you register a user

  data.email = !isEmpty(data.email) ? data.email : "";
  data.username = !isEmpty(data.username) ? data.username : "";
  //checks the input data.username to see if it's empty
  //if it's not it will return data.username
  //else if it's empty it will return an empty string
  data.password = !isEmpty(data.password) ? data.password : "";

  //   if (Validator.isEmpty(data.username)) {
  //     errors.username = "Username field is required";
  //   }
  //uses validator empty field to check if it's empty, if it is empty we ask the user to put their name is

  if (!Validator.isEmail(data.email)) {
    errors.email = "Email is invalid";
  }
  if (Validator.isEmpty(data.email)) {
    errors.email = "Email field is required";
  }

  if (Validator.isEmpty(data.password)) {
    errors.password = "Password field is required";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};

//you may notice this file is different from login
//because login has been destructured
//the validator module to only import the functions it needs
//you can use vsc intellisense to perform tasks to help your app run better
//highlight the code where you see '...'
//this means vsc suggests something to improve your code
//this will also change anything else affected by or using this function
//try it now!

//modules
const Validator = require("validator");
//validator has simple helper functions to check data types and lengths etc
const isEmpty = require("./isEmpty");
//the file we made to validate empty fields
//settting module exports here exports this as a function that takes in data and returns a value (true or false for our use)
module.exports = function validateRegisterInput(data) {
  let errors = {};
  //set an errors object that's going to change

  //here we're going to check all the fields that get input when you register a user

  data.firstname = !isEmpty(data.firstname) ? data.firstname : "";
  //checks the input (data) .firstname to see if it's empty, if it's not it will return data.firstname, if it's empty it will return an empty string
  data.surname = !isEmpty(data.surname) ? data.surname : "";
  data.email = !isEmpty(data.email) ? data.email : "";
  data.password = !isEmpty(data.password) ? data.password : "";
  data.password_confirm = !isEmpty(data.password_confirm)
    ? data.password_confirm
    : "";

  if (!Validator.isLength(data.username, { min: 2, max: 15 })) {
    errors.username = "Username must be between 2-30 characters";
  }

  if (!Validator.isLength(data.surname, { min: 2, max: 30 })) {
    errors.surname = "Surname must be between 2-30 characters";
  }
  if (!Validator.isLength(data.firstname, { min: 2, max: 30 })) {
    errors.firstname = "First Name must be between 2-30 characters";
    //this uses the validator module to check the name field to make sure it's between 2 and 30 characters in length
    //otherwise it will set a name error on the errors object to send back telling them why they can't have this as a name
  }

  if (Validator.isEmpty(data.firstname)) {
    errors.firstname = "First Name field is required";
  }

  if (Validator.isEmpty(data.surname)) {
    errors.surname = "Surname field is required";
  }

  if (Validator.isEmpty(data.username)) {
    errors.username = "Username field is required";
  }
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

  if (Validator.isEmpty(data.password_confirm)) {
    errors.password_confirm = "Please confirm password";
  }

  if (!Validator.isLength(data.password, { min: 6, max: 30 })) {
    errors.password = "Password must be between 6-30 characters";
  }

  if (!Validator.equals(data.password, data.password_confirm)) {
    errors.password_confirm = "Passwords don't match";
  }
  //checks to make sure the password confirm matches the password entered

  return {
    errors,
    isValid: isEmpty(errors)
  };
};

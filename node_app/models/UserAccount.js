const mongoose = require("mongoose");
//brings in the mongoose modules to access database functions
const Schema = mongoose.Schema;
//sets the schema with mongoose schema function

const UserAccountsSchema = new Schema({
  //this creates a new schema for the userAccounts
  //everything gets an id as a pk so we'll leave that one out
  //not sure why we need user account code but I'll add it in anyway and assume it's unique
  userAccountCode: {
    type: Number
  },
  Email: {
    type: String,
    required: true
  },
  UserName: {
    type: String
  },
  Password: {
    type: String,
    require: true
  },
  FirstName: {
    type: String,
    required: true
  },
  Surname: {
    type: String,
    required: true
  },
  TelephoneNumber: {
    type: String
  },
  DatCreated: {
    type: Date,
    required: true,
    default: Date.now()
  },
  LastLoggedIn: {
    type: Date,
    required: true
  },
  LoginAttempts: {
    type: Number
  },
  IsSuppressed: {
    type: Number
  }
});
//this has set all of our table columns with their types, required, and default values

module.exports = UserAccount = mongoose.model(
  "UserAccounts",
  UserAccountsSchema
);

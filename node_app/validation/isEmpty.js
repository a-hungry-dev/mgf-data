//simple function to check if is empty
//takes in value

const isEmpty = value =>
  value === undefined || //if value is undefined
  value === null || //or if value is null
  (typeof value === "object" && Object.keys(value).length === 0) || //or if value is an empty object
  (typeof value === "string" && value.trim().length === 0); //or if value is empty string

module.exports = isEmpty;
//exports to make available to other files

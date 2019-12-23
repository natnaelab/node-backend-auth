const validator = require("validator");
const isEmpty = require("./isEmpty");

module.exports = {
  // register validation
  validateRegisterInput: data => {
    let errors = {};

    data.userHandle = !isEmpty(data.userHandle) ? data.userHandle : "";
    data.email = !isEmpty(data.email) ? data.email : "";
    data.password = !isEmpty(data.password) ? data.password : "";
    data.cnfpassword = !isEmpty(data.cnfpassword) ? data.cnfpassword : "";

    if (!validator.isLength(data.userHandle, { min: 4, max: 12 })) {
      errors.userHandle = "username must be between 4 and 12 characters";
    }

    if (validator.isEmpty(data.userHandle)) {
      errors.userHandle = "username field is required";
    }

    if (validator.isNumeric(data.userHandle)) {
      errors.userHandle = "username should contain alphabet letters";
    }

    if (!validator.isEmail(data.email)) {
      errors.email = "invalid email";
    }

    if (validator.isEmpty(data.email)) {
      errors.email = "email field is required";
    }

    if (!validator.isLength(data.password, { min: 6, max: 30 })) {
      errors.password = "invalid password length";
    }

    if (validator.isEmpty(data.password)) {
      errors.password = "password field is required";
    }

    if (validator.isEmpty(data.cnfpassword)) {
      errors.cnfpassword = "confirm password field is required";
    } else {
      if (!validator.equals(data.password, data.cnfpassword)) {
        errors.cnfpassword = "password must match";
      }
    }

    return {
      errors,
      isValid: isEmpty(errors)
    };
  },

  // login validation
  validateLoginInput: data => {
    let errors = {};

    data.email = !isEmpty(data.email) ? data.email : "";
    data.password = !isEmpty(data.password) ? data.password : "";

    if (!validator.isEmail(data.email)) {
      errors.email = "invalid email";
    }

    if (validator.isEmpty(data.email)) {
      errors.email = "Email or Username field is required";
    }

    if (validator.isEmpty(data.password)) {
      errors.password = "Password field is required";
    }

    return {
      errors,
      isValid: isEmpty(errors)
    };
  }
};

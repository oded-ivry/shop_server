const Joi = require("joi");

//Register validation
const registerValidate = (data) => {
  const schema = {
    name: Joi.string().min(3).max(10).required(),
    user_name: Joi.string().min(3).max(10).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(3).max(10).required(),
  };
  return Joi.validate(data, schema);
};


//Login validation
const loginValidate = (data) => {
    const schema = {
      user_name: Joi.string().min(3).max(10).required(),
      password: Joi.string().min(3).max(10).required(),
    };
    return Joi.validate(data, schema);
  };


module.exports.registerValidate = registerValidate;
module.exports.loginValidate = loginValidate;
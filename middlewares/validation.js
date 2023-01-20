const { Validator, addCustomMessages } = require('node-input-validator')

const validateCreateUser = (req, res, next) => {
  const rules = new Validator(req.body, {
    firstname: 'required|minLength:5|maxLength:50',
    lastname: 'required|minLength:5|maxLength:50',
    phone: 'required|minLength:11|maxLength:14|phoneNumber',
    email: 'required|minLength:5|maxLength:70|email',
    password: 'required|minLength:8|alphaNumeric',
    photo: 'nullable'
  })

  rules.check().then(function (success) {
    if (success) {
      next()
    } else {
      res.status(404).json({
        status: false,
        message: rules.errors,
        data: []
      })
    }
  })
}

const validateLogin = (req, res, next) => {
  const rules = new Validator(req.body, {
    email: 'required|email',
    password: 'required'
  })

  rules.check().then(function (success) {
    if (success) {
      next()
    } else {
      res.status(400).json({
        status: false,
        message: rules.errors,
        data: []
      })
    }
  })
}

module.exports = {
  validateCreateUser,
  validateLogin,
}
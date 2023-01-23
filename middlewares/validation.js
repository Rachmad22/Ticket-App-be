const { Validator, addCustomMessages } = require('node-input-validator');
const jwt = require('jsonwebtoken')

// User
const validateCreateUser = (req, res, next) => {
  const rules = new Validator(req.body, {
    firstname: 'required|regex:^[a-zA-Z_ ]+$|minLength:5|maxLength:20',
    lastname: 'required|regex:^[a-zA-Z_ ]+$|minLength:5|maxLength:20',
    phone: 'required|phoneNumber|minLength:11|maxLength:14',
    email: 'required|email|minLength:5|maxLength:70',
    password: 'required|minLength:8|alphaNumeric',
    photo: 'nullable',
    role: 'nullable',
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

const validateEditUser = (req, res, next) => {
  const rules = new Validator(req.body, {
    firstname: 'nullable|regex:^[a-zA-Z_ ]+$|minLength:5|maxLength:20',
    lastname: 'nullable|regex:^[a-zA-Z_ ]+$|minLength:5|maxLength:20',
    phone: 'nullable|phoneNumber|minLength:11|maxLength:14',
    email: 'nullable|email|minLength:5|maxLength:70',
    password: 'nullable|minLength:8|alphaNumeric',
    // photo: 'nullable',
  })

  rules.check().then(function (success) {
    if(success){
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

// Movie
const validateCreateMovie = (req, res, next) => {
  const rules = new Validator(req.body, {
    name: 'required',
    genre: 'required',
    directed_by: 'required',
    duration: 'required',
    casts: 'required',
    synopsis: 'required'
  }, req.files.photo, {
    photo: 'required'
  })

  rules.check().then(function (success) {
    if (success) {
      next()
    } else {
      res.status(404).json({
        status: false,
        message: rules?.errors,
        data: []
      })
    }
  })
}

const validateRole = (req, res, next) => {
  try {
    const { authorization } = req.headers;
    
    if(authorization){
      const token = authorization.split(' ')[1]
      const decoded = jwt.verify(token, process.env.JWT_KEY)
    
      if(decoded?.role === 'admin') {
        next()
      } else {
        throw { code: 401, message: 'Only admins can access'}
      }
    } else {
      throw { code: 401, message: 'No token provide'}
    }
    
  } catch (error) {
    res.status(error?.code ?? 500).json({
      status: false,
      message: error?.message ?? error,
      data: []
    })
  }
}

module.exports = {
  validateCreateUser,
  validateLogin,
  validateEditUser,
  validateCreateMovie,
  validateRole
}
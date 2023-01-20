require('dotenv').config()
const bcrypt = require('bcrypt')
const user = require('../models/user')
const jwt = require('jsonwebtoken')

const login = async (req, res) => {
  try {
    const { email, password } = req.body

    const checkEmail = await user.getUserByEmail({email})

    if(checkEmail.length === 0){
      throw { code: 401, message: 'Unregistered email'}
    }

    bcrypt.compare(password, checkEmail[0].password, (err, result) => {
      try {
        if (err) {
          throw 'There was an error on the server'
        }

        const token = jwt.sign(
          {
            id: checkEmail[0]?.id,
            name: checkEmail[0]?.firstname,
            email: checkEmail[0]?.email,
            iat: new Date().getTime(),
          },
          process.env.JWT_KEY
        )

        if (result) {
          res.status(200).json({
            status: true,
            message: 'Login successful',
            data: {
              token,
              profile: checkEmail[0]
            }
          })
        } else {
          throw { code: 401, message: 'Login failed, wrong password'}
        }
      } catch (error) {
        res.status(error?.code ?? 500).json({
          status:false,
          message: error?.message ?? error,
          data: []
        })
      }
    })
  } catch (error) {
    res.status(error?.code ?? 500).json({
      status: false,
      message: error?.message ?? error,
      data: []
    })
  }
}

module.exports = {
  login
}
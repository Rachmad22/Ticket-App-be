const user = require("../models/user");
const bcrypt = require("bcrypt");
const saltRounds = 10;

const createUser = async (req, res) => {
  try {
    const { firstname, lastname, phone, email, password } = req.body;
    
    const checkPhone = await user.getUserByPhone({ phone })
    
    if (checkPhone.length >= 1) {
      throw { code: 401, message: 'Number already in use' }
    }
    
    const checkEmail = await user.getUserByEmail({ email })

    if (checkEmail.length >= 1) {
      throw { code : 401, message: 'Email already in use' }
    }

    bcrypt.genSalt(saltRounds, (err, salt) => {
      bcrypt.hash(password, salt, async (err, hash) => {
        if (err) {
          throw 'Authentication process failed, please try again'
        }
      
        const addToDb = await user.createUser({
          firstname,
          lastname,
          phone,
          email,
          password: hash,
        });
      
        res.json({
          status: true,
          message: "Data added successfully",
          data: addToDb,
        });
      });
      });
  } catch (error) {
    res.status(error?.code ?? 500).json({
      status: false,
      message: error?.message ?? error,
      data: [],
    });
  }
};

const getUsers = async (req, res) => {
  try {
    const { id } = req.params;

    const getAllUsers = await user.getAllUsers();

    res.json({
      status: true,
      message: "Data retrieved successful",
      data: getAllUsers,
    });
  } catch (error) {
    res.status(error?.code ?? 500).json({
      status: false,
      message: error?.message ?? error,
      data: []
    })
  }
};

module.exports = {
  createUser,
  getUsers,
};

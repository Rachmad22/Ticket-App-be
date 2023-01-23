const user = require("../models/user");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const { cloudinary} = require('../helper')
const {v4:uuidv4} = require('uuid');

const createUser = async (req, res) => {
  try {
    const { firstname, lastname, phone, email, password, role } = req.body;
    
    const checkPhone = await user.getUserPhone({ phone })
    
    if (checkPhone.length >= 1) {
      throw { code: 401, message: 'Number already in use' }
    }
    
    const checkEmail = await user.getUserEmail({ email })

    if (checkEmail.length >= 1) {
      throw { code : 401, message: 'Email already in use' }
    }

    if(role){
      bcrypt.genSalt(saltRounds, (err, salt) => {
        bcrypt.hash(password, salt, async (err, hash) => {
          if (err) {
            throw 'Authentication process failed, please try again'
          }
        
          const addToDbRole = await user.createUserWithRole({
            firstname,
            lastname,
            phone,
            email,
            password: hash,
            role,
          });
        
          res.json({
            status: true,
            message: "Data added successfully",
            data: addToDbRole,
          });
        });
        });
    } else {
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
    }

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

const editUser = async (req, res) => {
  try {
    const { id } = req.params
    const { firstname, lastname, phone, email, password} = req.body
    
    // Check the user id, is there or not
    const checkUser = await user.getUserById({id})

    if(checkUser.length === 0){
      throw { code: 401, message: `User with id ${id} doesn't exist`}
    }

    // Check phone number, whether already used or not
    if (phone) {
      const checkPhone = await user.getUserPhone({ phone })
      if (checkPhone.length >= 1) {
        throw { code: 401, message: 'Number already in use' }
      }
    }
    
    // Check email, whether already used or not
    if (email) {
      const checkEmail = await user.getUserEmail({ email })

      if (checkEmail.length >= 1) {
        throw { code: 401, message: 'Email already in use' }
      }
    }

    const getUser = await user.getUserById({id})

    const file = req.files.photo 

      const mimeType = file.mimetype.split('/')[1];
  
      const allowedFile = ["jpg", "png", "jpeg", "webp"];
  
      if (allowedFile.find((item) => item === mimeType)) {
        cloudinary.v2.uploader.upload(
          file.tempFilePath,
          { public_id: uuidv4() },
          function (error, result) {
            if (error) {
              throw "Photo upload failed";
            }
  
            bcrypt.genSalt(saltRounds, (err, salt) => {
              bcrypt.hash(password, salt, async (err, hash) => {
                if(err){
                  throw 'Authentication process failed, please try again'
                }
  
                const addToDbPhoto = await user.editUserPhoto({
                  id,
                  firstname,
                  lastname,
                  phone,
                  email,
                  password: hash,
                  photo: result.url,
                  getUser
                });
    
      
                res.json({
                  status: true,
                  message: "User edited successful",
                  data: addToDbPhoto,
                });
              })
            })
            
          }
        );
      } else {
        throw {code: 401, message: 'Upload failed, only photo format input'}
      }

  } catch (error) {
    res.status(error?.code ?? 500).json({
      status: false,
      message: error?.message ?? error,
      data: []
    })
  }
}

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params

    const checkId = await user.getUserById({id})

    if(checkId.length === 0){
      throw {code: 401, message: 'Data is empty, please try again'}
    }

    await user.deleteUser({id})

    res.json({
      status: true,
      message: 'User deleted successful'
    })
  } catch (error) {
    res.status(error?.code ?? 500).json({
      status: false,
      message: error?.message ?? error
    })
  }
}

module.exports = {
  createUser,
  getUsers,
  editUser,
  deleteUser
};

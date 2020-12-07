const bcrypt = require('bcryptjs');

const UserModel = require('../models/user.model');
const createToken = require('../utils/createToken');

module.exports.userLogin = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await UserModel.findByUsername(username);
    if (!user) {
      return res.status(400).json({
        status: 'error',
        message: 'Username is not correct',
      });
    }

    const auth = await bcrypt.compare(password, user.password);
    if (!auth) {
      return res.status(400).json({
        status: 'error',
        message: 'Password is not correct',
      });
    }

    const token = createToken(user.userId);

    delete user.password;

    res.status(200).json({
      status: 'success',
      data: {
        token,
        userInfo: user,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      status: 'error',
      message: error.message,
    });
  }
};

module.exports.adminLogin = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await UserModel.findByUsername(username);
    if (!user || user.role !== 1) {
      return res.status(400).json({
        status: 'error',
        message: 'Username is not correct',
      });
    }

    const auth = await bcrypt.compare(password, user.password);
    if (!auth) {
      return res.status(400).json({
        status: 'error',
        message: 'Password is not correct',
      });
    }

    const token = createToken(user.userId);

    delete user.password;

    res.status(200).json({
      status: 'success',
      data: {
        token,
        userInfo: user,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      status: 'error',
      message: error.message,
    });
  }
};

module.exports.signup = async (req, res) => {
  try {
    const { username, password, fullname, email } = req.body;
    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(password, salt);

    await UserModel.create({
      username,
      password: hashPassword,
      fullname,
      email,
    });

    res.status(200).json({
      status: 'success',
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message,
    });
  }
};

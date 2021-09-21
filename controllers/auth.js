const User = require('../models/user');
const throwError = require('../static-funcions/throw-error');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.signup = (req, res, next) => {
  const name = req.body.name;
  const password = req.body.password;
  bcrypt
      .hash(password, 12)
      .then(hashedPassword => {
        const user = new User({
          name: name,
          password: hashedPassword
        });
        return user.save();
      })
      .then(_ => {
        res.status(201);
      })
      .catch(err => {
        if (!err.statusCode) {
          err.statusCode = 500;
        }
        next(err);
      });
}

exports.login = async (req, res, next) => {
  const name = req.body.name;
  const password = req.body.password;
  let loadedUser;
  try {
    const user = await User.findOne({name: name});
    if (!user) {
      return throwError(403, 'invalid_user_or_password', next);
    }
    loadedUser = user;
    const equal = await bcrypt.compare(password, user.password);
    if (!equal) {
      return throwError(403, 'invalid_user_or_password', next);
    }
    const token = jwt.sign({
      userId: loadedUser._id.toString()
    }, 'binadaria', {expiresIn: '12h'})
    res.status(200).json({token: token});
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
}

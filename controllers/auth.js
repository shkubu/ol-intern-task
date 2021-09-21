const User = require('../models/user');
const throwError = require('../static-funcions/throw-error');
const jwt = require('jsonwebtoken');

exports.signup = (req, res, next) => {
  const name = req.body.name;
  const password = req.body.password;
  const user = new User(name, password);
  user.checkUser();
  res.status(201);
  // bcrypt
  //     .hash(password, 12)
  //     .then(hashedPassword => {
  //       const user = new User({
  //         name: name,
  //         password: hashedPassword
  //       });
  //       return user.showUser();
  //     })
  //     .then(_ => {
  //       res.status(201);
  //     })
  //     .catch(err => {
  //       if (!err.statusCode) {
  //         err.statusCode = 500;
  //       }
  //       next(err);
  //     });
}

exports.login = async (req, res, next) => {
  const name = req.body.name;
  const password = req.body.password;
  const user = new User(name, password);
  console.log(user.checkUser());
  res.status(201);
  if (user.checkUser()) {
    const token = jwt.sign({
      name: user.name.toString()
    }, 'test', {expiresIn: '12h'});
    res.status(200).json({token: token});
  } else {
    return throwError(403, 'invalid_user_or_password', next);
  }
}

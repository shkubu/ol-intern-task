const throwError = (code, message, next) => {
  const error = new Error(message);
  error.statusCode = code;
  next(error);
};

module.exports = throwError;

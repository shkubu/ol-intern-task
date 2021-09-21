const throwError = require('../static-funcions/throw-error');

const {validationResult} = require('express-validator/check');

const Orders = require('../models/orders');

exports.getData = (req, res, next) => {
  const queryParams = req.query;
  const startRow = parseInt(queryParams.startRow) - 1;
  const endRow = parseInt(queryParams.endRow);
  const sortString = `${queryParams.asc === 'false' ? '-' : ''}${queryParams.orderBy}`;
  Orders.find()
      .sort(sortString)
      .skip(startRow)
      .limit(endRow - parseInt(startRow))
      .exec((err, result) => {
    if (!result) {
      const error = new Error('Item not found!');
      error.statusCode = 404;
    }
    res.status(200).json(result);
  });
};

exports.searchData = async (req, res, next) => {
  const queryParams = req.query;
  const startRow = parseInt(queryParams.startRow) - 1;
  const endRow = parseInt(queryParams.endRow);
  const sortString = `${queryParams.asc === 'false' ? '-' : ''}${queryParams.orderBy}`;
  console.log(queryParams.search);
  console.log(await Orders.find({$text: {$search: 'test1'}}));
};

exports.createData = async (req, res, next) => {
  const data = req.body;
  try {
    await Orders.updateOne({phoneNumber: data.phoneNumber}, { $set: {
      email: data.email,
      name: data.name,
      unread: data.unread,
      projectName: data.projectName,
      apartmentName: data.apartmentName,
      comment: data.comment,
      comeFrom: data.comeFrom,
      areaRange: data.areaRange,
      personId: data.personId,
      phoneNumber: data.phoneNumber
    }}, {upsert: true});
    res.status(201).json({
      message: 'order created'
    })
  } catch (err) {
    throwError(500, 'nooo', next);
  }
};

exports.deleteData = (req, res, next) => {
  const id = req.params.id;
  Orders.findById(id).then(item => {
    if (!item) {
      const error = new Error('Item not found!');
      error.statusCode = 404;
      throw error;
    }
    return Orders.findByIdAndDelete(id);
  }).then(result => {
    res.status(200).json(result);
  }).catch(err => {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  });
}

exports.updateData = async (req, res, next) => {
  const id = req.params.id;
  const data = req.body;
  try {
    await Orders.findByIdAndUpdate(id, { $set: {
        email: data.email,
        name: data.name,
        unread: data.unread,
        projectName: data.projectName,
        apartmentName: data.apartmentName,
        comment: data.comment,
        comeFrom: data.comeFrom,
        areaRange: data.areaRange,
        personId: data.personId,
        phoneNumber: data.phoneNumber
      }}, {upsert: true});
    res.status(201).json({
      message: 'order created'
    })
  } catch (err) {
    throwError(500, 'nooo', next);
  }
}

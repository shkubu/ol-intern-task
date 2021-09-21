const throwError = require('../static-funcions/throw-error');

const {validationResult} = require('express-validator/check');

const Apartments = require('../models/apartments');
const Projects = require('../models/projects');

exports.getData = (req, res, next) => {
  const queryParams = req.query;
  const startRow = parseInt(queryParams.startRow) - 1;
  const endRow = parseInt(queryParams.endRow);
  let dbParams = {
    projectId: queryParams.projectId
  };
  if (queryParams.floor) {
    dbParams.floor = parseInt(queryParams.floor, 10);
  }
  if (queryParams.apartmentTypeId) {
    dbParams = {
      ...dbParams,
      'apartmentType._id': queryParams.apartmentTypeId
    }
  }
  const sortString = `${queryParams.asc === 'false' ? '-' : ''}${queryParams.orderBy}`;
  Apartments.find(dbParams)
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

exports.updateData = async (req, res, next) => {
  const apartmentId = req.params.apartmentId;
  const data = req.body;
  try {
    const existedItem = await Apartments.findById(apartmentId);
    if (!existedItem) {
      throwError(404, 'not_found', next);
    }
    if (existedItem.sold && !data.sold) {
      await Projects.findByIdAndUpdate(data.projectId, {$inc: {leftApartmentCount: 1}})
    }
    if (!existedItem.sold && data.sold) {
      await Projects.findByIdAndUpdate(data.projectId, {$inc: {leftApartmentCount: -1}})
    }
    existedItem.price = data.price;
    existedItem.sold = data.sold;
    existedItem.name = data.name;
    const result = await existedItem.save();
    res.status(204).json(result);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
      next(err);
    }
  }
}

exports.getApartment = (req, res, next) => {
  const id = req.params.id;
  Apartments.findById(id).then(result => {
    if (!result) {
      const error = new Error('Item not found!');
      error.statusCode = 404;
    }
    res.status(200).json(result);
  }).catch(err => {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  });
}

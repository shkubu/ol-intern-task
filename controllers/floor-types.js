const throwError = require('../static-funcions/throw-error');

const {validationResult} = require('express-validator/check');
const {uploadToCloud, deleteFileFromCloud} = require('../files-middleware/floor-types');

const FloorTypes = require('../models/floor-types');

exports.getData = (req, res, next) => {
  const queryParams = req.query;
  const startRow = parseInt(queryParams.startRow) - 1;
  const endRow = parseInt(queryParams.endRow);
  const sortString = `${queryParams.asc === 'false' ? '-' : ''}${queryParams.orderBy}`;
  FloorTypes.find({projectId: queryParams.projectId})
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

exports.createData = async (req, res, next) => {
  const data = JSON.parse(req.body.data);
  if (!req.file) {
    const error = new Error('no_main_image');
    error.statusCode = 422;
    throw error;
  }
  let mainImageUrl = '';
  try {
    mainImageUrl = await uploadToCloud(req.file);
  } catch (err) {
    throwError(500, 'noo', next);
    return;
  }
  const floors = new FloorTypes({
    projectId: data.projectId,
    name: data.name,
    floor: data["floor"],
    apartments: data.apartments,
    mainImageUrl: mainImageUrl
  });
  floors.save().then(_ => {
    res.status(201).json({
      message: 'floor created!'
    })
  }).catch(err => {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  });
}

exports.deleteData = (req, res, next) => {
  const floorId = req.params.floorId;
  FloorTypes.findById(floorId).then(item => {
    if (!item) {
      const error = new Error('Item not found!');
      error.statusCode = 404;
      throw error;
    }
    if (item.mainImageUrl) {
      deleteFileFromCloud(item.mainImageUrl);
    }
    return FloorTypes.findByIdAndRemove(floorId);
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
  const floorId = req.params.floorId;
  const data = JSON.parse(req.body.data);
  let mainImageUrl = data.mainImageUrl;
  if (req.file) {
    try {
      mainImageUrl = await uploadToCloud(req.file);
    } catch (err) {
      throwError(500, 'noo', next);
      return;
    }
  }
  FloorTypes.findById(floorId).then(item => {
    if (!item) {
      const error = new Error('Item not found!');
      error.statusCode = 404;
      throw error;
    }
    if (mainImageUrl !== item.mainImageUrl) {
      deleteFileFromCloud(item.mainImageUrl);
    }
    item.name = data.name;
    item.floor = data["floor"];
    item.floorImageSvgViewBox = data.floorImageSvgViewBox;
    item.floorImageSvgPaths = data.floorImageSvgPaths;
    item.apartments = data.apartments;
    item.mainImageUrl = mainImageUrl;
    return item.save();
  }).then(result => {
    res.status(204).json(result);
  }).catch(err => {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  });
}

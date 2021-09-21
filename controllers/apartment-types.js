const {validationResult} = require('express-validator/check');
const {
  uploadToCloud,
  createNewDir,
  deleteDirFromCloud,
  deleteFileFromCloud
} = require('../files-middleware/apartment-types');

const ApartmentTypes = require('../models/apartment-types');
const Apartments = require('../models/apartments');

exports.getData = (req, res, next) => {
  const queryParams = req.query;
  const projectId = queryParams.projectId;
  const startRow = parseInt(queryParams.startRow) - 1;
  const endRow = parseInt(queryParams.endRow);
  const sortString = `${queryParams.asc === 'false' ? '-' : ''}${queryParams.orderBy}`;
  ApartmentTypes.find({projectId: projectId})
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
  // const errors = validationResult(req);
  // if (!errors.isEmpty()) {
  //   const error = new Error('Validation failed!');
  //   error.statusCode = 422;
  // }
  let imagesDirName = '';
  try {
    imagesDirName = await createNewDir();
  } catch (err) {
    throw new Error();
  }
  const data = JSON.parse(req.body.data);
  const images2DUrls = [];
  if (req.files.images2D) {
    for (let image of req.files.images2D) {
      let url = '';
      try {
        url = await uploadToCloud(image, imagesDirName);
      } catch (err) {
        throwError(500, 'noo', next);
        return;
      }
      images2DUrls.push(url);
    }
  }
  const images3DUrls = [];
  if (req.files.images3D) {
    for (let image of req.files.images3D) {
      let url = '';
      try {
        url = await uploadToCloud(image, imagesDirName);
      } catch (err) {
        throwError(500, 'noo', next);
        return;
      }
      images3DUrls.push(url);
    }
  }
  const apartmentTypes = new ApartmentTypes({
    projectId: data.projectId,
    name: data.name,
    roomsCount: data.roomsCount,
    area: data.area,
    rooms: data.rooms,
    imagesDirName: imagesDirName,
    images2DUrls: images2DUrls,
    images3DUrls: images3DUrls
  });
  apartmentTypes.save().then(result => {
    res.status(201).json({
      message: 'apartment type created!',
      post: result
    })
  }).catch(err => {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  });
}

exports.deleteData = (req, res, next) => {
  const apartmentTypeId = req.params.apartmentTypeId;
  ApartmentTypes.findById(apartmentTypeId).then(item => {
    if (!item) {
      const error = new Error('Item not found!');
      error.statusCode = 404;
      throw error;
    }
    deleteDirFromCloud(item.imagesDirName);
    return ApartmentTypes.findByIdAndRemove(apartmentTypeId);
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
  const apartmentTypesId = req.params.apartmentTypeId;
  const data = JSON.parse(req.body.data);
  let images2DUrls = data.images2DUrls;
  let images3DUrls = data.images3DUrls;
  if (req.files.images2D) {
    for (let image of req.files.images2D) {
      let url = '';
      try {
        url = await uploadToCloud(image, data.imagesDirName);
      } catch (err) {
        throwError(500, 'noo', next);
        return;
      }
      images2DUrls.push(url)
    }
    images2DUrls.sort();
    images2DUrls = [...new Set(images2DUrls)];
  }
  if (req.files.images3D) {
    for (let image of req.files.images3D) {
      let url = '';
      try {
        url = await uploadToCloud(image, data.imagesDirName);
      } catch (err) {
        throwError(500, 'noo', next);
        return;
      }
      images3DUrls.push(url)
    }
  }
  ApartmentTypes.findById(apartmentTypesId).then(item => {
    if (!item) {
      const error = new Error('Item not foundaa!');
      error.statusCode = 404;
      throw error;
    }
    item.projectId = data.projectId;
    item.name = data.name;
    item.roomsCount = data.roomsCount;
    item.area = data.area;
    item.rooms = data.rooms;
    for (let i = 0; i < item.images2DUrls.length; i++) {
      if (images2DUrls.indexOf(item.images2DUrls[i]) < 0) {
        deleteFileFromCloud(item.images2DUrls[i]);
      }
    }
    for (let i = 0; i < item.images3DUrls.length; i++) {
      if (images3DUrls.indexOf(item.images3DUrls[i]) < 0) {
        deleteFileFromCloud(item.images3DUrls[i]);
      }
    }
    item.images2DUrls = images2DUrls;
    item.images3DUrls = images3DUrls;
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

exports.getApartmentType = (req, res, next) => {
  const id = req.params.id;
  ApartmentTypes.findById(id).then(result => {
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

exports.changePrice = async (req, res, next) => {
  const apartmentTypeId = req.params.apartmentTypeId;
  const price = req.body.price;
  try {
    await Apartments.updateMany({apartmentTypeId}, {$inc: {price: price}});
    res.status(204).json();
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
}

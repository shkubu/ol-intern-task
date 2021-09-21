const throwError = require('../static-funcions/throw-error');

const {validationResult} = require('express-validator/check');

const Floors = require('../models/floors');
const FloorTypes = require('../models/floor-types');
const Apartments = require('../models/apartments');
const Projects = require('../models/projects');

const generateApartments = async (floors, next) => {
  try {
    const project = await Projects.findById(floors[0].projectId);
    const apartments = [];
    for (let floor of floors) {
      await Apartments.deleteMany({projectId: project._id, floor: floor.floor});
      const floorType = await FloorTypes.findById(floor.floorTypeId);
      const apartmentTypes = floorType.apartments;
      for (let i = 0; i < apartmentTypes.length; i++) {
        apartments.push({
          projectId: project._id,
          floorTypeId: floorType._id,
          apartmentType: apartmentTypes[i],
          apartmentName: `${apartmentTypes[i].name} - ${apartmentTypes[i].area}`,
          name: `${floor.floor}_${i + 1}`,
          floor: floor.floor,
          price: project.defaultPrice,
          sold: false
        });
      }
    }
    await Apartments.insertMany(apartments)
  } catch (err) {
    throwError(500, 'apartments_not_generated', next);
  }
};

const setApartmentsLeftCount = async (projectId) => {
  const count = await Apartments.find({projectId, sold: false}).countDocuments();
  await Projects.findByIdAndUpdate(projectId, {$set: {leftApartmentCount: count}});
};

exports.getData = (req, res, next) => {
  const queryParams = req.query;
  const startRow = parseInt(queryParams.startRow) - 1;
  const endRow = parseInt(queryParams.endRow);
  const sortString = `${queryParams.asc === 'false' ? '-' : ''}${queryParams.orderBy}`;
  Floors.find({projectId: queryParams.projectId})
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
  const data = req.body;
  const floorTypeId = data.floorTypeId;
  const floorTypeName = data.floorTypeName;
  const projectId = data.projectId;
  const floorArr = [];
  for (let i = data.min; i <= data.max; i++) {
    floorArr.push({
      projectId: projectId,
      floorTypeId: floorTypeId,
      floorTypeName: floorTypeName,
      floor: i
    });
  }
  for (const floor of floorArr) {
    try {
      await Floors.findOneAndDelete({projectId, floor: floor["floor"]});
    } catch (err) {
      throwError(500, 'noo', next);
      return;
    }
  }
  await generateApartments(floorArr, next);
  await setApartmentsLeftCount(projectId);
  Floors.insertMany(floorArr).then(_ => {
    res.status(201).json({
      message: 'floor created!'
    })
  }).catch(err => {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  });
};

exports.deleteData = async (req, res, next) => {
  const floorId = req.params.floorId;
  try {
    const deletedFloor = await Floors.findById(floorId);
    await Apartments.deleteMany({projectId: deletedFloor.projectId, floor: deletedFloor.floor});
    await Floors.findByIdAndDelete(floorId);
    await setApartmentsLeftCount(deletedFloor.projectId);
    res.status(200).json({message: 'floor_deleted'})
  } catch (err) {
    throwError(500, 'apartments_error', next);
  }
}

exports.changePrice = async (req, res, next) => {
  const floor = req.params['floor'];
  const price = req.body.price;
  try {
    await Apartments.updateMany({floor}, {$inc: {price: price}});
    res.status(204).json();
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
}

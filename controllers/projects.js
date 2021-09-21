const throwError = require('../static-funcions/throw-error');

const {validationResult} = require('express-validator/check');
const {uploadToCloud, deleteDirFromCloud, deleteFileFromCloud} = require('../files-middleware/projects');

const Projects = require('../models/projects');
const Apartments = require('../models/apartments');

exports.getProjects = (req, res, next) => {
  const queryParams = req.query;
  const startRow = parseInt(queryParams.startRow) - 1;
  const endRow = parseInt(queryParams.endRow);
  const sortString = `${queryParams.asc === 'false' ? '-' : ''}${queryParams.orderBy}`;
  Projects.find()
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

exports.checkKeyword = async (req, res, next) => {
  try {
    const existedKeyword = await Projects.findOne({keyword: req.body.keyword})
    if (existedKeyword) {
      throwError(409, 'keyword_already_exists', next);
      return;
    }
    res.status(204).json();
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    throwError(err.statusCode, 'undefined_error', next);
  }
};

exports.createProjects = async (req, res, next) => {
  // const errors = validationResult(req);
  // if (!errors.isEmpty()) {
  //   const error = new Error('Validation failed!');
  //   error.statusCode = 422;
  // }
  //   throw error;
  const data = JSON.parse(req.body.data)
  if (!req.files.mainImage) {
    const error = new Error('no_main_image');
    error.statusCode = 422;
    throw error;
  }
  if (!req.files.blockImage) {
    const error = new Error('no_block_image');
    error.statusCode = 422;
    throw error;
  }
  let mainImageUrl = '';
  let blockImageUrl = '';
  let projectFileUrl = '';
  try {
    const mainImage = req.files.mainImage[0];
    mainImageUrl = await uploadToCloud(mainImage, data.keyword);
  } catch (err) {
    throwError(500, 'Storage Err', next);
  }
  try {
    const blockImage = req.files.blockImage[0];
    blockImageUrl = await uploadToCloud(blockImage, data.keyword);
  } catch (err) {
    throwError(500, 'Storage Err', next);
  }
  try {
    const projectFile = req.files.projectFile[0];
    projectFileUrl = await uploadToCloud(projectFile, data.keyword);
  } catch (err) {
    throwError(500, 'Storage Err', next);
  }
  const sliderImageUrls = [];
  if (req.files.sliderImages) {
    for (let image of req.files.sliderImages) {
      let url = '';
      try {
        url = await uploadToCloud(image, data.keyword);
        console.log(url);
      } catch (err) {
        throwError(500, 'noo', next);
        return;
      }
      sliderImageUrls.push(url);
    }
  }
  const projects = new Projects({
    nameKa: data.nameKa,
    nameEn: data.nameEn,
    sloganKa: data.sloganKa,
    sloganEn: data.sloganEn,
    descriptionKa: data.descriptionKa,
    descriptionEn: data.descriptionEn,
    defaultPrice: data.defaultPrice,
    backgroundOpacity: data.backgroundOpacity,
    keyword: data.keyword,
    status: data.status,
    blockName: data.blockName,
    blockNameEn: data.blockNameEn,
    floors: data.floors,
    videoUrl: data.videoUrl,
    showInHomePage: data.showInHomePage,
    startDate: data.startDate,
    endDate: data.endDate,
    coordinates: data.coordinates,
    location: data.location,
    locationEn: data.locationEn,
    apartmentCount: data.apartmentCount,
    sortIndex: data.sortIndex,
    mainImageUrl: mainImageUrl,
    blockImageUrl: blockImageUrl,
    projectFileUrl: projectFileUrl,
    sliderImageUrls: sliderImageUrls
  });
  console.log('finish');
  projects.save().then(result => {
    res.status(201).json({
      message: 'project created!',
      post: result
    })
  }).catch(err => {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  });
}

exports.deleteProject = (req, res, next) => {
  const projectId = req.params.projectId;
  Projects.findById(projectId).then( item => {
    if (!item) {
      const error = new Error('Item not found!');
      error.statusCode = 404;
      throw error;
    }
    deleteDirFromCloud(item.keyword);
    return Projects.findByIdAndRemove(projectId);
  }).then(result => {
    res.status(200).json(result);
  }).catch(err => {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  });
}

exports.updateProject = async (req, res, next) => {
  const projectId = req.params.projectId;
  const data = JSON.parse(req.body.data);
  let mainImageUrl = data.mainImageUrl;
  let blockImageUrl = data.blockImageUrl;
  let projectFileUrl = data.projectFileUrl;
  let sliderImageUrls = data.sliderImageUrls;
  if (req.files.sliderImages) {
    for (let image of req.files.sliderImages) {
      let url = '';
      try {
        url = await uploadToCloud(image, data.keyword);
        console.log(url);
      } catch (err) {
        throwError(500, 'noo', next);
        return;
      }
      sliderImageUrls.push(url);
    }
  }
  if (req.files.mainImage) {
    try {
      mainImageUrl = await uploadToCloud(req.files.mainImage[0], data.keyword);
    } catch (err) {
      throwError(500, 'noo', next);
      return;
    }
  }
  if (req.files.blockImage) {
    try {
      blockImageUrl = await uploadToCloud(req.files.blockImage[0], data.keyword);
    } catch (err) {
      throwError(500, 'noo', next);
      return;
    }
  }
  if (req.files.projectFile) {
    try {
      projectFileUrl = await uploadToCloud(req.files.projectFile[0], data.keyword);
    } catch (err) {
      throwError(500, 'noo', next);
      return;
    }
  }
  if (!mainImageUrl) {
    const error = new Error('no_main_image_picked');
    error.statusCode = 422;
    throw error;
  }
  if (!blockImageUrl) {
    const error = new Error('no_floor_image_picked');
    error.statusCode = 422;
    throw error;
  }
  Projects.findById(projectId).then(item => {
    if (!item) {
      const error = new Error('Item not found!');
      error.statusCode = 404;
      throw error;
    }
    if (mainImageUrl !== item.mainImageUrl) {
      deleteFileFromCloud(item.mainImageUrl);
    }
    if (blockImageUrl !== item.blockImageUrl) {
      deleteFileFromCloud(item.blockImageUrl);
    }
    if (projectFileUrl !== item.projectFileUrl) {
      // deleteFileFromCloud(item.projectFileUrl);
    }
    item.nameKa = data.nameKa;
    item.nameEn = data.nameEn;
    item.sloganKa = data.sloganKa;
    item.sloganEn = data.sloganEn;
    item.descriptionKa = data.descriptionKa;
    item.descriptionEn = data.descriptionEn;
    item.defaultPrice = data.defaultPrice;
    item.backgroundOpacity = data.backgroundOpacity;
    item.status = data.status;
    item.blockName = data.blockName;
    item.blockNameEn = data.blockNameEn;
    item.floors = data.floors;
    item.videoUrl = data.videoUrl;
    item.startDate = data.startDate;
    item.endDate = data.endDate;
    item.coordinates = data.coordinates;
    item.showInHomePage = data.showInHomePage;
    item.location = data.location;
    item.locationEn = data.locationEn;
    item.mainImageUrl = mainImageUrl;
    item.blockImageUrl = blockImageUrl;
    item.projectFileUrl = projectFileUrl;
    item.sortIndex = data.sortIndex;
    item.apartmentCount = data.apartmentCount;
    item.blockImageSvgViewBox = data.blockImageSvgViewBox;
    item.blockImageSvgPaths = data.blockImageSvgPaths;
    for (let i = 0; i < item.sliderImageUrls.length; i++) {
      if (sliderImageUrls.indexOf(item.sliderImageUrls[i]) < 0) {
        deleteFileFromCloud(item.sliderImageUrls[i]);
        console.log(i)
      }
    }
    item.sliderImageUrls = sliderImageUrls;
    console.log('finish');
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

exports.getProject = (req, res, next) => {
  const projectId = req.params.id;
  Projects.findById(projectId).then(result => {
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
};

exports.changePrice = async (req, res, next) => {
  const projectId = req.params.projectId;
  const price = req.body.price;
  try {
    await Projects.findByIdAndUpdate(projectId, {$inc: {defaultPrice: price}});
    await Apartments.updateMany({projectId}, {$inc: {price: price}});
    res.status(204).json();
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
}


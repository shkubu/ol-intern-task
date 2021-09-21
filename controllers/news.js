const throwError = require('../static-funcions/throw-error');

const {validationResult} = require('express-validator/check');
const {uploadToCloud, deleteFileFromCloud} = require('../files-middleware/news');

const News = require('../models/news');

exports.getData = (req, res, next) => {
  const queryParams = req.query;
  const startRow = parseInt(queryParams.startRow) - 1;
  const endRow = parseInt(queryParams.endRow);
  const sortString = '-updatedAt';
  News.find()
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

exports.getSelectedNews = (req, res, next) => {
  const id = req.params.id;
  News.findById(id).then( item => {
    if (!item) {
      const error = new Error('Item not found!');
      error.statusCode = 404;
      throw error;
    }
    res.status(200).json(item);
  }).catch(err => {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  });
}

exports.createData = async (req, res, next) => {
  // const errors = validationResult(req);
  // if (!errors.isEmpty()) {
  //   const error = new Error('Validation failed!');
  //   error.statusCode = 422;
  // }
  const data = JSON.parse(req.body.data)
  //   throw error;
  if (!req.files.mainImage) {
    throwError(422, 'no_main_image', next);
    return;
  }
  // if (!req.files.extraImage) {
  //   throwError(422, 'no_extra_image', next);
  //   return;
  // }
  let mainImageUrl = '';
  // let extraImageUrl = '';
  try {
    const mainImage = req.files.mainImage[0];
    mainImageUrl = await uploadToCloud(mainImage);
    // const extraImage = req.files.extraImage[0];
    // extraImageUrl = await uploadToCloud(extraImage);
  } catch (err) {
    throwError(500, 'Storage Err', next);
  }
  const news = new News({
    title: data.title,
    titleEn: data.titleEn,
    text1: data.text1,
    textEn: data.textEn,
    date: data.date,
    // text2: data.text2,
    mainImageUrl: mainImageUrl
    // extraImageUrl: extraImageUrl
  });
  news.save().then(result => {
    res.status(201).json({
      message: 'news created!',
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
  const id = req.params.id;
  News.findById(id).then( item => {
    if (!item) {
      const error = new Error('Item not found!');
      error.statusCode = 404;
      throw error;
    }
    deleteFileFromCloud(item.mainImageUrl);
    // deleteFileFromCloud(item.extraImageUrl);
    return News.findByIdAndRemove(id);
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
  const data = JSON.parse(req.body.data);
  let mainImageUrl = data.mainImageUrl;
  // let extraImageUrl = data.extraImageUrl;
  try {
    if (req.files.mainImage) {
      mainImageUrl = await uploadToCloud(req.files.mainImage[0], data.keyword);
    }
    // if (req.files.extraImage) {
    //   extraImageUrl = await uploadToCloud(req.files.extraImage[0], data.keyword);
    // }
  } catch (err) {
    throwError(500, 'noo', next);
    return;
  }
  if (!mainImageUrl) {
    throwError(422, 'no_main_image_picked', next);
    return;
  }
  // if (!extraImageUrl) {
  //   throwError(422, 'no_extra_image_picked', next);
  //   return;
  // }
  News.findById(id).then(item => {
    if (!item) {
      const error = new Error('Item not found!');
      error.statusCode = 404;
      throw error;
    }
    if (mainImageUrl !== item.mainImageUrl) {
      deleteFileFromCloud(item.mainImageUrl);
    }
    // if (extraImageUrl !== item.extraImageUrl) {
    //   deleteFileFromCloud(item.extraImageUrl);
    // }
    item.title = data.title;
    item.titleEn = data.titleEn;
    item.text1 = data.text1;
    item.textEn = data.textEn;
    item.date = data.date;
    // item.text2 = data.text2;
    item.mainImageUrl = mainImageUrl;
    // item.extraImageUrl = extraImageUrl;
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

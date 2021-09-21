const throwError = require('../static-funcions/throw-error');

const {uploadToCloud, deleteFileFromCloud} = require('../files-middleware/news');

const Suggestion = require('../models/suggestion');

exports.getData = (req, res, next) => {
  const queryParams = req.query;
  const startRow = parseInt(queryParams.startRow) - 1;
  const endRow = parseInt(queryParams.endRow);
  const sortString = `${queryParams.asc === 'false' ? '-' : ''}${queryParams.orderBy}`;
  Suggestion.find()
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
  //   throw error;
  let mainImageUrl = '';
  try {
    const mainImage = req.files.mainImage[0];
    console.log(mainImage);
    mainImageUrl = await uploadToCloud(mainImage);
  } catch (err) {
    throwError(500, 'Storage Err', next);
  }
  const suggestion = new Suggestion({
    mainImageUrl: mainImageUrl,
  });
  suggestion.save().then(result => {
    res.status(201).json({
      message: 'suggestion created!',
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
  Suggestion.findById(id).then( item => {
    if (!item) {
      const error = new Error('Item not found!');
      error.statusCode = 404;
      throw error;
    }
    try {
      deleteFileFromCloud(item.mainImageUrl);
    } catch (err) {
      throwError(500, 'Storage Err', next);
    }
    return Suggestion.findByIdAndRemove(id);
  }).then(result => {
    res.status(200).json(result);
  }).catch(err => {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  });
}


const {validationResult} = require('express-validator/check');
const {
  uploadToCloud,
  deleteDirFromCloud,
  deleteFileFromCloud
} = require('../files-middleware/binadari-cards');
const throwError = require('../static-funcions/throw-error');

const CardTypes = require('../models/binadari-cards');

exports.getData = (req, res, next) => {
  const queryParams = req.query;
  const startRow = parseInt(queryParams.startRow) - 1;
  const endRow = parseInt(queryParams.endRow);
  const sortString = `${queryParams.asc === 'false' ? '-' : ''}${queryParams.orderBy}`;
  CardTypes.find()
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
  const data = JSON.parse(req.body.data);
  let existedItem;
  try {
    existedItem = await CardTypes.find({name: data.name});
  } catch (err) {
    throwError(500, 'noo', next);
    return;
  }
  if (existedItem.length) {
    throwError(409, 'item_already_exists', next);
    return;
  }
  const companies = [];
  for (const company of data.companies) {
    for (const image of req.files) {
      if (company.filename === image.originalname) {
        let url = '';
        try {
          url = await uploadToCloud(image, data.name);
        } catch (err) {
          throwError(500, 'noo', next);
          return;
        }
        companies.push({
          name: company.name,
          nameEn: company.nameEn,
          salePercent: company.salePercent,
          location: company.location,
          locationEn: company.locationEn,
          facebookUrl: company.facebookUrl,
          phoneNumber: company.phoneNumber,
          mail: company.mail,
          webSiteUrl: company.webSiteUrl,
          imagePath: url
        });
      }
    }
  }
  const cardTypes = new CardTypes({
    name: data.name,
    companies: companies
  });
  cardTypes.save().then(result => {
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
  const id = req.params.id;
  CardTypes.findById(id).then(item => {
    if (!item) {
      const error = new Error('Item not found!');
      error.statusCode = 404;
      throw error;
    }
    deleteDirFromCloud(item.name);
    return CardTypes.findByIdAndDelete(id);
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
  const companies = [];
  console.log(data.companies);
  for (const company of data.companies) {
    if (company.filename) {
      for (const image of req.files) {
        if (company.filename === image.originalname) {
          let url = '';
          try {
            url = await uploadToCloud(image, data.name);
          } catch (err) {
            throwError(500, 'noo', next);
            return;
          }
          companies.push({
            name: company.name,
            nameEn: company.nameEn,
            salePercent: company.salePercent,
            location: company.location,
            locationEn: company.locationEn,
            facebookUrl: company.facebookUrl,
            phoneNumber: company.phoneNumber,
            mail: company.mail,
            webSiteUrl: company.webSiteUrl,
            imagePath: url
          });
        }
      }
    } else {
      companies.push({
        name: company.name,
        nameEn: company.nameEn,
        salePercent: company.salePercent,
        location: company.location,
        locationEn: company.locationEn,
        facebookUrl: company.facebookUrl,
        phoneNumber: company.phoneNumber,
        mail: company.mail,
        webSiteUrl: company.webSiteUrl,
        imagePath: company.imagePath
      });
    }
  }
  let existedItem;
  try {
    existedItem = await CardTypes.findById(id);
  } catch (err) {
    throwError(500, 'no', next)
    return;
  }
  if (!existedItem) {
    throwError(404, 'not_found', next);
    return;
  }
  const oldUrls = existedItem.companies.map(item => item.imagePath);
  const newUrls = companies.map(item => item.imagePath);
  for (const oldUrl of oldUrls) {
    if (newUrls.indexOf(oldUrl) < 0) {
      try {
        await deleteFileFromCloud(oldUrl);
      } catch (err) {
        throwError(500, 'noo', next);
        return;
      }
    }
  }
  existedItem.companies = companies;
  try {
    const result = await existedItem.save();
    res.status(204).json(result);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
}

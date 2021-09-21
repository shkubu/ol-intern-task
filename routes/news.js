const express = require('express');
const {body} = require('express-validator/check');
const isAuth = require('../middleware/is-auth');

const multer = require('multer');

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' ||
      file.mimetype === 'image/png' ||
      file.mimetype === 'image/webp' ||
      file.mimetype === 'application/json' ||
      file.mimetype === 'image/jpg') {
    cb(null, true);
  } else {
    cb(null, false);
  }
}

const multerMid = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 1024 * 1024 * 100
  },
  fileFilter: fileFilter
});

const newsController = require('../controllers/news');

const router = express.Router();

router.get('', newsController.getData);

router.get('/:id', newsController.getSelectedNews);

router.post('', [
  isAuth,
  body('title').trim().isLength({min: 2}),
  multerMid.fields([
    {name: 'mainImage', maxCount: 1}])
], newsController.createData);

router.delete('/:id', isAuth, newsController.deleteData);

router.put('/:id', [
  isAuth,
  body('title').trim().isLength({min: 2}),
  multerMid.fields([
    {name: 'mainImage', maxCount: 1}])
], newsController.updateData)

module.exports = router;

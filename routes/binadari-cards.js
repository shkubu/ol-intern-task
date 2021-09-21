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

const binadariCardsController = require('../controllers/binadari-cards');

const router = express.Router();

router.get('', binadariCardsController.getData);

router.post('', [
  isAuth,
  body('name').trim().isLength({min: 1}),
  multerMid.array('image', 100)
], binadariCardsController.createData);

router.delete('/:id', isAuth, binadariCardsController.deleteData);

router.put('/:id', [
  isAuth,
  body('name').trim().isLength({min: 1}),
  multerMid.array('image', 100)
], binadariCardsController.updateData);

module.exports = router;

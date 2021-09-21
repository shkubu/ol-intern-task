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

const apartmentTypesController = require('../controllers/apartment-types');

const router = express.Router();

router.get('', apartmentTypesController.getData);

router.get('/:id', apartmentTypesController.getApartmentType);

router.post('', [
  isAuth,
  body('name').trim().isLength({min: 1}),
  multerMid.fields([
    {name: 'images2D', maxCount: 20},
    {name: 'images3D', maxCount: 20}])
], apartmentTypesController.createData);

router.delete('/:apartmentTypeId', isAuth, apartmentTypesController.deleteData);

router.put('/:apartmentTypeId', [
  isAuth,
  body('name').trim().isLength({min: 1}),
  multerMid.fields([
    {name: 'images2D', maxCount: 20},
    {name: 'images3D', maxCount: 20}])
], apartmentTypesController.updateData);

router.patch('/:apartmentTypeId/change-price', apartmentTypesController.changePrice);

module.exports = router;

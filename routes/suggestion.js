const express = require('express');
const isAuth = require('../middleware/is-auth');
const multer = require('multer');

const suggestionController = require('../controllers/suggestion');

const fileFilter = (req, file, cb) => {
  console.log(file.mimetype);
  if (file.mimetype === 'image/jpeg' ||
      file.mimetype === 'image/png' ||
      file.mimetype === 'image/webp' ||
      file.mimetype === 'application/pdf' ||
      file.mimetype === 'application/msword' ||
      file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      file.mimetype === 'application/vnd.ms-excel' ||
      file.mimetype === 'application/json' ||
      file.mimetype === 'image/jpg') {
    cb(null, true);
  } else {
    cb(null, false);
  }
}

const router = express.Router();

const multerMid = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 1024 * 1024 * 100
  },
  fileFilter: fileFilter
});

router.get('', suggestionController.getData);

router.post('', [
  isAuth,
  multerMid.fields([
    {name: 'mainImage', maxCount: 1}])
], suggestionController.createData);


router.delete('/:id', isAuth, suggestionController.deleteData);

module.exports = router;

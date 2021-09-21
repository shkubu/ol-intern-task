const express = require('express');
const {body} = require('express-validator/check');
const isAuth = require('../middleware/is-auth');

const multer = require('multer');

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

const multerMid = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 1024 * 1024 * 100
  },
  fileFilter: fileFilter
});

const projectsController = require('../controllers/projects');

const router = express.Router();

router.get('', projectsController.getProjects);

router.get('/:id', projectsController.getProject);

router.post('', [
  isAuth,
  body('nameKa').trim().isLength({min: 2}),
  multerMid.fields([
    {name: 'blockImage', maxCount: 1},
    {name: 'mainImage', maxCount: 1},
    {name: 'projectFile', maxCount: 1},
    {name: 'sliderImages', maxCount: 20}])
], projectsController.createProjects);

router.get('/:projectId', projectsController.getProject);

router.put('/checkkeyword', isAuth, projectsController.checkKeyword);

router.delete('/:projectId', isAuth, projectsController.deleteProject);

router.put('/:projectId', [
  isAuth,
  body('nameKa').trim().isLength({min: 2}),
  multerMid.fields([
    {name: 'blockImage', maxCount: 1},
    {name: 'mainImage', maxCount: 1},
    {name: 'projectFile', maxCount: 1},
    {name: 'sliderImages', maxCount: 20}])
], projectsController.updateProject)

router.patch('/:projectId/change-price', projectsController.changePrice);

module.exports = router;

const express = require('express');
const {body} = require('express-validator/check');
const isAuth = require('../middleware/is-auth');

const floorsController = require('../controllers/floors');

const router = express.Router();

router.get('', floorsController.getData);

router.post('', isAuth, floorsController.createData);

router.delete('/:floorId', isAuth, floorsController.deleteData);

router.patch('/:floor/change-price', floorsController.changePrice);

module.exports = router;

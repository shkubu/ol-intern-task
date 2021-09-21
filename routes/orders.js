const express = require('express');
const {body} = require('express-validator/check');
const isAuth = require('../middleware/is-auth');

const ordersController = require('../controllers/orders');

const router = express.Router();

router.get('', isAuth, ordersController.getData);

router.get('/search', isAuth, ordersController.searchData);

router.post('', ordersController.createData);

router.put('/:id', isAuth, ordersController.updateData);

router.delete('/:id', isAuth, ordersController.deleteData);

module.exports = router;

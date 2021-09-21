const express = require('express');
const {body} = require('express-validator/check');
const isAuth = require('../middleware/is-auth');

const apartmentsController = require('../controllers/apartments');

const router = express.Router();

router.get('', apartmentsController.getData);

router.get('/:id', apartmentsController.getApartment);

router.put('/:apartmentId', isAuth, apartmentsController.updateData)

module.exports = router;

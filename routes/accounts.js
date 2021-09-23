const express = require('express');
const router = express.Router();
const isAuth = require('../middleware/is-auth');

const accountsController = require('../controllers/accounts');

router.get('/:clientId', isAuth, accountsController.getData);

router.post('/:clientId', isAuth, accountsController.saveData);

module.exports = router;

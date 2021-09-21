const express = require('express');
const router = express.Router();
const isAuth = require('../middleware/is-auth');

const clientsController = require('../controllers/clients');

router.get('', clientsController.getData);

router.post('', clientsController.postData);

router.put('/:id', clientsController.updateData);

router.delete('/:id', clientsController.deleteData);

module.exports = router;

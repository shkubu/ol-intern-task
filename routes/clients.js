const express = require('express');
const router = express.Router();
const isAuth = require('../middleware/is-auth');

const clientsController = require('../controllers/clients');

router.get('', isAuth, clientsController.getData);

router.post('', isAuth, clientsController.postData);

router.put('/:id', isAuth, clientsController.updateData);

router.delete('/:id', isAuth, clientsController.deleteData);

module.exports = router;

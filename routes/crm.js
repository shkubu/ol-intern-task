const express = require('express');
const {body} = require('express-validator/check');
const isAuth = require('../middleware/is-auth');

const crmController = require('../controllers/crm');

const router = express.Router();

router.get('', isAuth, crmController.getData);

router.get('/all', isAuth, crmController.getAllData);

router.post('', crmController.createData);

router.post('/lead', isAuth, crmController.createLead);

router.put('/:id', isAuth, crmController.updateData);

router.patch('/read/:id', isAuth, crmController.readData);

router.delete('/:id', isAuth, crmController.deleteData);

router.post('/project', crmController.updateProjects);

module.exports = router;

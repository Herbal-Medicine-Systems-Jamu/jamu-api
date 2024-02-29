const express = require('express');
const router = require('express-promise-router')();
const passport = require('passport');
const passportConf = require('../configuration/passport');
const { validateBody, schemas } = require('../helpers/routeHelpers');

const adminController = require('../controllers/admin');


router.route('/dashbord')
  .get(adminController.CountDB);
  
module.exports = router;

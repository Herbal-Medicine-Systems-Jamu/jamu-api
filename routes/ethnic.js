const express = require('express');
const router = require('express-promise-router')();
const passport = require('passport');
const passportConf = require('../configuration/passport');
const { validateBody, schemas } = require('../helpers/routeHelpers');

const ethicController = require('../controllers/ethnic');
const checkrole = require('../controllers/checkrole');
const passportJWT = passport.authenticate('jwt', { session: false });


router.route('/')
  .get(ethicController.index);

router.route('/getlist')
  .get(ethicController.getlist);

router.route('/get/:id')
  .get(ethicController.detail);

router.route('/add')
  .post(passportJWT, checkrole.admin, ethicController.create);

router.route('/update/:id')
  .patch(passportJWT, checkrole.admin, ethicController.update);

router.route('/delete/:id')
  .delete(passportJWT, checkrole.admin, ethicController.delete);
  
module.exports = router;

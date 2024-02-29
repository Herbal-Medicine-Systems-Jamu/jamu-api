const express = require('express');
const router = require('express-promise-router')();
const passport = require('passport');
const passportConf = require('../configuration/passport');
const { validateBody, schemas } = require('../helpers/routeHelpers');

const plantethnicController = require('../controllers/plantethnic');
const checkrole = require('../controllers/checkrole');
const passportJWT = passport.authenticate('jwt', { session: false });


router.route('/pages/:page')
  .get(plantethnicController.index);

router.route('/pages')
  .get(plantethnicController.index);

router.route('/')
  .get(plantethnicController.all);

router.route('/getlist')
  .get(plantethnicController.list);

router.route('/get/:id')
  .get(plantethnicController.detail);

router.route('/add')
  .post(validateBody(schemas.plantethnicSchema), passportJWT, checkrole.admin, plantethnicController.create);

router.route('/update/:id')
  .patch(passportJWT, checkrole.admin, plantethnicController.update);

router.route('/delete/:id')
  .delete(passportJWT, checkrole.admin, plantethnicController.delete);
  
module.exports = router;

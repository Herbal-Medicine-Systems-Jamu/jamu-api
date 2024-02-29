const express = require('express');
const router = require('express-promise-router')();
const passport = require('passport');
const passportConf = require('../configuration/passport');
const { validateBody, schemas } = require('../helpers/routeHelpers');

const provinceController = require('../controllers/province');
const checkrole = require('../controllers/checkrole');
const passportJWT = passport.authenticate('jwt', { session: false });


router.route('/')
  .get(provinceController.index);

router.route('/getlist')
  .get(provinceController.getlist);

router.route('/get/:id')
  .get(provinceController.detail);

router.route('/add')
  .post(validateBody(schemas.provinceSchema), passportJWT, checkrole.admin, provinceController.create);

router.route('/update/:id')
  .patch(passportJWT, checkrole.admin, provinceController.update);

router.route('/delete/:id')
  .delete(passportJWT, checkrole.admin, provinceController.delete);
  
module.exports = router;

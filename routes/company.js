const express = require('express');
const router = require('express-promise-router')();
const passport = require('passport');
const passportConf = require('../configuration/passport');
const { validateBody, schemas } = require('../helpers/routeHelpers');

const companyController = require('../controllers/company');
const checkrole = require('../controllers/checkrole');
const passportJWT = passport.authenticate('jwt', { session: false });


router.route('/')
  .get(companyController.index);

router.route('/getlist')
  .get(companyController.list);

router.route('/get/:idcompany')
  .get(companyController.detailCompany);

// router.route('/detailplant/:idplant')
//   .get(companyController.detailPlant);

router.route('/add')
  .post(validateBody(schemas.companySchema), passportJWT, checkrole.admin, companyController.create);

router.route('/update/:idcompany')
  .patch(passportJWT, checkrole.admin, companyController.update);

router.route('/delete/:idcompany')
  .delete(passportJWT, checkrole.admin, companyController.delete);
  
module.exports = router;

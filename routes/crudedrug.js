const express = require('express');
const router = require('express-promise-router')();
const passport = require('passport');
const passportConf = require('../configuration/passport');
const { validateBody, schemas } = require('../helpers/routeHelpers');

const crudedrugController = require('../controllers/crudedrug');
const checkrole = require('../controllers/checkrole');
const passportJWT = passport.authenticate('jwt', { session: false });


router.route('/')
  .get(crudedrugController.index);

router.route('/search')
  .get(crudedrugController.search);

router.route('/pages')
  .get(crudedrugController.index);

router.route('/pages/:page')
  .get(crudedrugController.index);

  router.route('/getlist')
  .get(crudedrugController.list);

router.route('/get/:idcrude')
  .get(crudedrugController.detailCrude);

// router.route('/create')
//   .get(validateBody(schemas.crudedrugSchema), passportJWT, checkrole.admin, crudedrugController.showPlants);

router.route('/add')
  .post(validateBody(schemas.crudedrugSchema), passportJWT, checkrole.admin, crudedrugController.create);

router.route('/update/:idcrude')
  .patch(passportJWT, checkrole.admin, crudedrugController.update);

router.route('/delete/:idcrude')
  .delete(passportJWT, checkrole.admin, crudedrugController.delete);
  
module.exports = router;

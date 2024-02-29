const express = require('express');
const router = require('express-promise-router')();
const passport = require('passport');
const passportConf = require('../configuration/passport');
const { validateBody, schemas } = require('../helpers/routeHelpers');

const plantController = require('../controllers/plant');
const checkrole = require('../controllers/checkrole');
const passportJWT = passport.authenticate('jwt', { session: false });

router.route('/test')
  .get(plantController.test);

router.route('/')
  .get(plantController.getAll);

router.route('/pages/')
  .get(plantController.getAll);
  
router.route('/pages/:page')
  .get(plantController.getAll);

router.route('/search/')
  .get(plantController.search);

  router.route('/search/sort')
  .get(plantController.sortDate);

router.route('/getlist')
  .get(plantController.list);

router.route('/get/:idplant')
  .get(plantController.getPlant);

router.route('/add')
  .post(validateBody(schemas.plantSchema), passportJWT, checkrole.admin, plantController.add);

router.route('/update/:idplant')
  .patch(passportJWT, checkrole.admin, plantController.update);

router.route('/delete/:idplant')
  .delete(passportJWT, checkrole.admin, plantController.delete);
  
module.exports = router;

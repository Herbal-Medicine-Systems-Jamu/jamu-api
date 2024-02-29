const express = require('express');
const router = require('express-promise-router')();
const passport = require('passport');
const passportConf = require('../configuration/passport');
const { validateBody, schemas } = require('../helpers/routeHelpers');

const refformulaController = require('../controllers/refformula');
const checkrole = require('../controllers/checkrole');
const passportJWT = passport.authenticate('jwt', { session: false });


router.route('/')
  .get(refformulaController.index);
  
router.route('/pages')
  .get(refformulaController.index);

router.route('/pages/:page')
  .get(refformulaController.index);

router.route('/get/:idformula')
  .get(refformulaController.detailRefformula);

// router.route('/create')
//   .get(passportJWT, checkrole.admin, refformulaController.showHerbsmed);

router.route('/add')
  .post(validateBody(schemas.refformulaSchema), passportJWT, checkrole.admin, refformulaController.create);

router.route('/update/:idformula')
  .patch(passportJWT, checkrole.admin, refformulaController.update);

router.route('/delete/:idformula')
  .delete(passportJWT, checkrole.admin, refformulaController.delete);
  
module.exports = router;

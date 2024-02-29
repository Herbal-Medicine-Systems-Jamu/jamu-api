const express = require('express');
const router = require('express-promise-router')();
const passport = require('passport');
const passportConf = require('../configuration/passport');
const { validateBody, schemas } = require('../helpers/routeHelpers');

const medtypeController = require('../controllers/medtype');
const checkrole = require('../controllers/checkrole');
const passportJWT = passport.authenticate('jwt', { session: false });


router.route('/')
  .get(medtypeController.index);

router.route('/get/:idtype')
  .get(medtypeController.detailMedtype);

router.route('/add')
  .post(validateBody(schemas.medtypeSchema), passportJWT, checkrole.admin, medtypeController.create);

router.route('/update/:idtype')
  .patch(passportJWT, checkrole.admin, medtypeController.update);

router.route('/delete/:idtype')
  .delete(passportJWT, checkrole.admin, medtypeController.delete);
  
module.exports = router;

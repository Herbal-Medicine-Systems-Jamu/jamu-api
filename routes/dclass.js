const express = require('express');
const router = require('express-promise-router')();
const passport = require('passport');
const passportConf = require('../configuration/passport');
const { validateBody, schemas } = require('../helpers/routeHelpers');

const dclassController = require('../controllers/dclass');
const checkrole = require('../controllers/checkrole');
const passportJWT = passport.authenticate('jwt', { session: false });


router.route('/')
  .get(dclassController.index);

router.route('/get/:idclass')
  .get(dclassController.detailDclass);

router.route('/add')
  .post(validateBody(schemas.dclassSchema), passportJWT, checkrole.admin, dclassController.create);

router.route('/update/:idclass')
  .patch(passportJWT, checkrole.admin, dclassController.update);

router.route('/delete/:idclass')
  .delete(passportJWT, checkrole.admin, dclassController.delete);
  
module.exports = router;

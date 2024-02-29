const express = require('express');
const router = require('express-promise-router')();
const passport = require('passport');
const passportConf = require('../configuration/passport');
const { validateBody, schemas } = require('../helpers/routeHelpers');

const databaseController = require('../controllers/database');
const checkrole = require('../controllers/checkrole');
const passportJWT = passport.authenticate('jwt', { session: false });

var path = require('path');
const multer = require('multer');
var crypto = require('crypto');

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
      // cb(null, 'public/images/herbsmed');
      cb(null, path.resolve(__dirname, '../public/files/data/import'));
    },
    filename: function(req, file, cb) {
      cb(null, crypto.randomBytes(16).toString('hex') + new Date().toISOString().replace(/:/g, '-') + file.originalname);
    }
  });


const upload = multer({
    storage: storage, 
    limits:{
    fileSize: 1024 * 1024 * 5
    }
});

router.route('/delete/collection/all')
  .delete(passportJWT, checkrole.admin, databaseController.deleteAllCollections);

router.route('/import')
  .post(passportJWT, checkrole.admin,databaseController.import);

router.route('/import/plant')
  .post(passportJWT, checkrole.admin, upload.single('file'),databaseController.plant);

router.route('/import/company')
  .post(passportJWT, checkrole.admin, upload.single('file'),databaseController.company);

router.route('/import/combination')
  .post(passportJWT, checkrole.admin, upload.single('file'),databaseController.combination);

router.route('/import/crudedrug')
  .post(passportJWT, checkrole.admin, upload.single('file'),databaseController.crudedrug);

router.route('/import/dclass')
  .post(passportJWT, checkrole.admin, upload.single('file'),databaseController.dclass);

router.route('/import/ethnic')
  .post(passportJWT, checkrole.admin, upload.single('file'),databaseController.ethnic);

router.route('/import/herbsmed')
  .post(passportJWT, checkrole.admin, upload.single('file'),databaseController.herbsmed);

router.route('/import/plantcrude')
  .post(passportJWT, checkrole.admin, upload.single('file'),databaseController.plantcrude);

router.route('/import/refformula')
  .post(passportJWT, checkrole.admin, upload.single('file'),databaseController.refformula);

router.route('/import/medtype')
  .post(passportJWT, checkrole.admin, upload.single('file'),databaseController.medtype);

  // router.route('/')
//   .get(databaseController.index);

// router.route('/getlist')
//   .get(databaseController.list);

// router.route('/get/:idcompany')
//   .get(databaseController.detailCompany);


// router.route('/update/:idcompany')
//   .patch(passportJWT, checkrole.admin, databaseController.update);

// router.route('/delete/:idcompany')
//   .delete(passportJWT, checkrole.admin, databaseController.delete);
  
module.exports = router;

const express = require('express');
const router = require('express-promise-router')();
const passport = require('passport');
const passportConf = require('../configuration/passport');
const { validateBody, schemas } = require('../helpers/routeHelpers');

const tacitController = require('../controllers/tacit');
const checkrole = require('../controllers/checkrole');
const passportJWT = passport.authenticate('jwt', { session: false });

const multer = require('multer');
var path = require('path');
var crypto = require('crypto');

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
      // cb(null, 'public/images/herbsmed');
      cb(null, path.resolve(__dirname, '../public/files/tacit'));
    },
    filename: function(req, file, cb) {
      cb(null, crypto.randomBytes(16).toString('hex') + new Date().toISOString().replace(/:/g, '-') + file.originalname);
    }
  });

const fileFilter = (req, file, cb) => {
    //reject file
    if(file.mimetype === 'application/pdf' || file.mimetype === 'application/doc'){
        cb(null, true);
    }else{
        cb(null, false);
    }  
};

const upload = multer({
    storage: storage, 
    limits:{
    fileSize: 1024 * 1024 * 5
    },
    // fileFilter: fileFilter
});


router.route('/')
  .get(tacitController.all);

router.route('/pages')
  .get(tacitController.index);

router.route('/pages/:page')
  .get(tacitController.index);

// router.route('/indexes')
//   .get(tacitController.all);
router.route('/search/sort')
  .get(tacitController.sort);

router.route('/getlist')
  .get(tacitController.list);

router.route('/getbyverif/:status')
  .get(passportJWT, checkrole.admin, tacitController.getByVerif);

router.route('/get/:id')
  .get(tacitController.detail);

router.route('/add')
  .post(passportJWT, upload.single('file'), tacitController.create);

router.route('/file/:file')
  .get(tacitController.getFile);

router.route('/update/:id')
  .patch(passportJWT, checkrole.admin, upload.single('file'), tacitController.update);

router.route('/delete/:id')
  .delete(passportJWT, checkrole.admin, tacitController.delete);

router.route('/setverif/:id')
  .patch(passportJWT, checkrole.admin, tacitController.setVerif);
  
module.exports = router;

const express = require('express');
const router = require('express-promise-router')();
const passport = require('passport');
const passportConf = require('../configuration/passport');
const { validateBody, schemas } = require('../helpers/routeHelpers');

const explicitController = require('../controllers/explicit');
const checkrole = require('../controllers/checkrole');
const passportJWT = passport.authenticate('jwt', { session: false });

const multer = require('multer');
var path = require('path');
var crypto = require('crypto');

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
      // cb(null, 'public/images/herbsmed');
      cb(null, path.resolve(__dirname, '../public/files/explicit'));
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

    // var ext = path.extname(file.originalname);
    //     if(ext !== '.pdf' && ext !== '.doc') {
    //         return cb(new Error('Only images are allowed'))
    //     }
    //     cb(null, true)
};

const upload = multer({
    storage: storage, 
    limits:{
    fileSize: 1024 * 1024 * 5
    },
    // fileFilter: fileFilter
});


router.route('/')
  .get(explicitController.index);

router.route('/search/sort')
  .get(explicitController.sort);

router.route('/pages')
  .get(explicitController.index);

router.route('/pages/:page')
  .get(explicitController.index);

  router.route('/getlist')
  .get(explicitController.list);

router.route('/get/:id')
  .get(explicitController.detail);

router.route('/file/:file')
  .get(explicitController.getFile);

router.route('/add')
  .post(passportJWT, checkrole.admin, upload.single('file'), explicitController.create);

router.route('/update/:id')
  .patch(passportJWT, checkrole.admin, upload.single('file'), explicitController.update);

router.route('/delete/:id')
  .delete(passportJWT, checkrole.admin, explicitController.delete);
  
module.exports = router;

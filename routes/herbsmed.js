const express = require("express");
const router = require("express-promise-router")();
const passport = require("passport");
const passportConf = require("../configuration/passport");
const { validateBody, schemas } = require("../helpers/routeHelpers");

var crypto = require("crypto");
var path = require("path");
// Encrypt
// var ciphertext = CryptoJS.AES.encrypt('my message', 'secret key 123');

const herbsmedController = require("../controllers/herbsmed");
const checkrole = require("../controllers/checkrole");
const passportJWT = passport.authenticate("jwt", { session: false });
const multer = require("multer");

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    // cb(null, 'public/images/herbsmed');
    cb(null, path.resolve(__dirname, "../public/images/herbsmed"));
  },
  filename: function(req, file, cb) {
    cb(
      null,
      crypto.randomBytes(16).toString("hex") +
        new Date().toISOString().replace(/:/g, "-") +
        file.originalname
    );
  }
});

const fileFilter = (req, file, cb) => {
  //reject file
  if (
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg"
  ) {
    cb(null, true);
  } else {
    // req.fileValidationError = 'goes wrong on the mimetype';
    // cb(null, false, new Error('goes wrong on the mimetype'));
    console.log("err");
    cb(null, false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5
  },
  fileFilter: fileFilter,
  onError: function(err, next) {
    console.log("error", err);
    next(err);
  }
  // function(req, res) {
  //       res.status(204).end();
  //     }
});

router.route("/").get(herbsmedController.all);

router.route("/pages").get(herbsmedController.index);

router.route("/pages/:page").get(herbsmedController.index);

router.route("/getlist").get(herbsmedController.list);

// router.route('/list/:idtype')
//   .get(herbsmedController.listtype);

router.route("/getbytype").get(herbsmedController.listtype);

router.route("/get/:idherbsmed").get(herbsmedController.detail);

router
  .route("/add")
  .post(
    passportJWT,
    checkrole.admin,
    upload.single("img"),
    herbsmedController.create
  );

router
  .route("/update/:idherbsmed")
  .patch(
    passportJWT,
    checkrole.admin,
    upload.single("img"),
    herbsmedController.update
  );

router
  .route("/delete/:idherbsmed")
  .delete(passportJWT, checkrole.admin, herbsmedController.delete);

router.route("/image/:img").get(herbsmedController.getImage);

router.route("/search").get(herbsmedController.search);

router.route("/getbytype/search").get(herbsmedController.searchByType);

router.route("/search/sort").get(herbsmedController.sortDate);

module.exports = router;

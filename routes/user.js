const express = require("express");
const router = require("express-promise-router")();
const passport = require("passport");
const passportConf = require("../configuration/passport");

const { validateBody, schemas } = require("../helpers/routeHelpers");
const userController = require("../controllers/user");
const adminController = require("../controllers/admin");
const cobaController = require("../controllers/coba");
const checkrole = require("../controllers/checkrole");
const passportSignIn = passport.authenticate("local", { session: false });
const passportJWT = passport.authenticate("jwt", { session: false });

const multer = require("multer");
var path = require("path");
var crypto = require("crypto");

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    // cb(null, 'public/images/herbsmed');
    cb(null, path.resolve(__dirname, "../public/files/import"));
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

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5
  }
  // fileFilter: fileFilter
});

//Admin
// router.route('/scijamu/signup')
//   .post(validateBody(schemas.signUpSchema), adminController.signUp);

// router.route('/scijamu/signin')
//   .post(validateBody(schemas.signInSchema), checkrole.isVerified, passportSignIn, adminController.signIn);

// User
// router.route('/signup')
//   .post(validateBody(schemas.signUpSchema), userController.signUp);
router.route("/import").post(userController.import);

router.route("/get").get(userController.getitem);

router.route("/pipe").get(cobaController.pipe);
// ASLI
// upload.single('file'),
router
  .route("/signup")
  .post(validateBody(schemas.signUpSchema), userController.signUp);

router
  .route("/signin")
  .post(
    validateBody(schemas.signInSchema),
    checkrole.isVerified,
    passportSignIn,
    userController.signIn
  );

router.route("/confirmation/:token").get(userController.confirmation);

router.route("/getuser").get(passportJWT, userController.getUser);

router.route("/update").patch(passportJWT, userController.update);

router
  .route("/changepassword")
  .patch(
    validateBody(schemas.changepasswordSchema),
    passportJWT,
    userController.changePassword
  );

router.route("/resendtoken").post(userController.resendToken);

router.route("/secret").get(userController.secret);

module.exports = router;

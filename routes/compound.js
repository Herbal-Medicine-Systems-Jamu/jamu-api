const express = require("express");
const router = require("express-promise-router")();
const passport = require("passport");
const passportConf = require("../configuration/passport");
const { validateBody, schemas } = require("../helpers/routeHelpers");

const compoundController = require("../controllers/compound");
const checkrole = require("../controllers/checkrole");
const passportJWT = passport.authenticate("jwt", { session: false });

router.route("/").get(compoundController.all);

router.route("/pages/:page").get(compoundController.index);

router.route("/search/").get(compoundController.search);

router.route("/getlist").get(compoundController.list);

router.route("/get/:idcompound").get(compoundController.detailCompound);

router
  .route("/add")
  .post(
    validateBody(schemas.compoundSchema),
    passportJWT,
    checkrole.admin,
    compoundController.create
  );

router
  .route("/update/:idcompound")
  .patch(passportJWT, checkrole.admin, compoundController.update);

router
  .route("/delete/:idcompound")
  .delete(passportJWT, checkrole.admin, compoundController.delete);

module.exports = router;

const express = require("express");
const router = require("express-promise-router")();

const passport = require("passport");
const checkrole = require("../controllers/checkrole");
const passportJWT = passport.authenticate("jwt", { session: false });
const passportConf = require("../configuration/passport");
const { validateBody, schemas } = require("../helpers/routeHelpers");

const generateExistController = require("../controllers/generateExist");
const generateNewController = require("../controllers/generateNew");

// For NEW it has tobe urutan
router
  .route("/new/plantcrude")
  .get(passportJWT, checkrole.admin, generateNewController.plantCrude);

router
  .route("/new/plant")
  .get(passportJWT, checkrole.admin, generateNewController.plant);

router
  .route("/new/crudedrug")
  .get(passportJWT, checkrole.admin, generateNewController.crudeDrug);

router
  .route("/new/combination")
  .get(passportJWT, checkrole.admin, generateNewController.combination);

router
  .route("/new/herbsmed")
  .get(passportJWT, checkrole.admin, generateNewController.herbsMed);

router.route("/new/plantethnic").get(generateNewController.plantEthnic);

router.route("/plantplantethnic").get(generateNewController.PlantPlantEthnic);

router.route("/model").get(generateNewController.model);

router.route("/refPlantToSenyawa").get(generateNewController.refPlantToSenyawa);

router.route("/crudeherbmed").get(generateNewController.crudeHersbmed);

router
  .route("/refCrudeCompoundToSenyawa")
  .get(generateNewController.refCrudeCompoundToSenyawa);

router
  .route("/refCompoundToSenyawa")
  .get(generateNewController.refCompoundToSenyawa);

router
  .route("/refPlantToCrudeCompound")
  .get(generateNewController.refPlantToCrudeCompound);

router
  .route("/refCompoundToCrudeCompound")
  .get(generateNewController.refCompoundToCrudeCompound);

router
  .route("/refCrudeCompoundToCompound")
  .get(generateNewController.refCrudeCompoundToCompound);

router
  .route("/refPlantToCompound")
  .get(generateNewController.refPlantToCompound);

router
  .route("/refPlantToCompoundDistinc")
  .get(generateNewController.refPlantToCompoundDistinc);
router
  .route("/refCompoundToPlantDistinc")
  .get(generateNewController.refCompoundToPlantDistinc);

router
  .route("/refCompoundToPlant")
  .get(generateNewController.refCompoundToPlant);

router
  .route("/input-new-metabolite")
  .get(generateNewController.inputNewMetabolite);

router
  .route("/exist/plantcrude")
  .get(passportJWT, checkrole.admin, generateExistController.plant);

module.exports = router;
